<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request, $projectId)
    {
        $project = Project::findOrFail($projectId);

        // Check access
        if (!$request->user()->canAccessProject($projectId)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $query = Task::where('project_id', $projectId)
            ->with(['assignee:id,name,email', 'creator:id,name,email']);

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by assigned user
        if ($request->has('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        $tasks = $query->latest()->get();

        return response()->json([
            'success' => true,
            'tasks' => $tasks,
        ]);
    }

    public function store(Request $request, $projectId)
    {
        $project = Project::findOrFail($projectId);

        if (!$request->user()->canAccessProject($projectId)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'priority' => 'required|in:low,medium,high,urgent',
            'status' => 'required|in:todo,in_progress,review,completed',
            'due_date' => 'nullable|date',
        ]);

        // Verify assigned user is project member
        if (isset($validated['assigned_to'])) {
            $isMember = $project->members()
                ->where('user_id', $validated['assigned_to'])
                ->exists();
            
            if (!$isMember) {
                return response()->json([
                    'success' => false,
                    'message' => 'Assigned user must be a project member',
                ], 400);
            }
        }

        $task = Task::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'project_id' => $projectId,
            'assigned_to' => $validated['assigned_to'] ?? null,
            'created_by' => $request->user()->id,
            'priority' => $validated['priority'],
            'status' => $validated['status'],
            'due_date' => $validated['due_date'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'task' => $task->load('assignee', 'creator'),
            'message' => 'Task created successfully',
        ], 201);
    }

    public function show(Request $request, $projectId, $taskId)
    {
        if (!$request->user()->canAccessProject($projectId)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $task = Task::where('project_id', $projectId)
            ->with(['assignee', 'creator', 'comments.user'])
            ->findOrFail($taskId);

        return response()->json([
            'success' => true,
            'task' => $task,
        ]);
    }

    public function update(Request $request, $projectId, $taskId)
    {
        if (!$request->user()->canAccessProject($projectId)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $task = Task::where('project_id', $projectId)->findOrFail($taskId);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'priority' => 'sometimes|required|in:low,medium,high,urgent',
            'status' => 'sometimes|required|in:todo,in_progress,review,completed',
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);

        return response()->json([
            'success' => true,
            'task' => $task->fresh()->load('assignee', 'creator'),
            'message' => 'Task updated successfully',
        ]);
    }

    public function destroy(Request $request, $projectId, $taskId)
    {
        if (!$request->user()->canAccessProject($projectId)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $task = Task::where('project_id', $projectId)->findOrFail($taskId);

        // Only creator or project owner can delete
        $project = Project::findOrFail($projectId);
        if ($task->created_by !== $request->user()->id && $project->owner_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to delete this task',
            ], 403);
        }

        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully',
        ]);
    }

    public function myTasks(Request $request)
    {
        $tasks = Task::where('assigned_to', $request->user()->id)
            ->with(['project:id,name', 'creator:id,name,email'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'tasks' => $tasks,
        ]);
    }
}