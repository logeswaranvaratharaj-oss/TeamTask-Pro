<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Deal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DealController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $type = $request->query('type', 'team');

        $query = Deal::where(function($q) use ($user) {
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

        $deals = $query->with(['owner:id,name,email', 'members:id,name,email', 'contact'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'projects' => $deals, // Keeping the key as 'projects' for frontend compatibility or changing to deals
            'deals' => $deals,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deal_value' => 'nullable|numeric',
            'pipeline_stage' => 'nullable|string',
            'contact_id' => 'nullable|exists:contacts,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'type' => 'nullable|in:team,personal',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['owner_id'] = $request->user()->id;
        $data['type'] = $data['type'] ?? 'team';

        $deal = Deal::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Deal created successfully',
            'project' => $deal,
            'deal' => $deal,
        ]);
    }

    public function show($id)
    {
        $deal = Deal::with(['owner', 'members', 'tasks.assignee', 'contact'])->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'project' => $deal,
            'deal' => $deal,
        ]);
    }

    public function update(Request $request, $id)
    {
        $deal = Deal::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'deal_value' => 'sometimes|numeric',
            'pipeline_stage' => 'sometimes|string',
            'contact_id' => 'sometimes|exists:contacts,id',
            'status' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $deal->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Deal updated successfully',
            'project' => $deal,
            'deal' => $deal,
        ]);
    }

    public function destroy($id)
    {
        $deal = Deal::findOrFail($id);
        $deal->delete();

        return response()->json([
            'success' => true,
            'message' => 'Deal deleted successfully'
        ]);
    }

    public function addMember(Request $request, $id)
    {
        $deal = Deal::findOrFail($id);
        
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $deal->members()->syncWithoutDetaching([$request->user_id]);

        return response()->json([
            'success' => true,
            'message' => 'Member added to deal successfully'
        ]);
    }
}