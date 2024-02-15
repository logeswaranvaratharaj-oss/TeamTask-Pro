<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $type = $request->query('type', 'team');
        
        // Get projects where user is owner or member
        $query = Project::where(function($q) use ($user) {
            $q->where('owner_id', $user->id)
              ->orWhereHas('members', function($sq) use ($user) {
                  $sq->where('user_id', $user->id);
              });
        });

        if ($type === 'personal') {
            $query->where('type', 'personal')->where('owner_id', $user->id);
        } else {
            $query->where('type', '!=', 'personal');
        }

        $projects = $query->with(['owner:id,name,email', 'members:id,name,email'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'projects' => $projects,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|in:team,personal',
            'status' => 'required|in:planning,active,on_hold,completed',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $project = Project::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'] ?? 'team',
            'owner_id' => $request->user()->id,
            'status' => $validated['status'],
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
        ]);

        // Add owner as project member with owner role
        $project->members()->attach($request->user()->id, ['role' => 'owner']);

        return response()->json([
            'success' => true,
            'project' => $project->load('owner', 'members'),
            'message' => 'Project created successfully',
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $project = Project::with(['owner', 'members', 'tasks.assignee'])
            ->findOrFail($id);

        // Check access
        if (!$request->user()->canAccessProject($id)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this project',
            ], 403);
        }

        $stats = $project->getTaskStats();

        return response()->json([
            'success' => true,
            'project' => $project,
            'stats' => $stats,
        ]);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        // Only owner can update project
        if ($project->owner_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Only project owner can update the project',
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:planning,active,on_hold,completed',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $project->update($validated);

        return response()->json([
            'success' => true,
            'project' => $project->fresh()->load('owner', 'members'),
            'message' => 'Project updated successfully',
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        if ($project->owner_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Only project owner can delete the project',
            ], 403);
        }

        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully',
        ]);
    }

    public function addMember(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        if ($project->owner_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Only project owner can add members',
            ], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:admin,member',
        ]);

        // Check if already a member
        if ($project->members()->where('user_id', $validated['user_id'])->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'User is already a member of this project',
            ], 400);
        }

        $project->members()->attach($validated['user_id'], ['role' => $validated['role']]);

        return response()->json([
            'success' => true,
            'message' => 'Member added successfully',
            'project' => $project->fresh()->load('members'),
        ]);
    }
}