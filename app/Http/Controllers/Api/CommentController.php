<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Task;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request, $taskId)
    {
        $task = Task::findOrFail($taskId);

        // Check if user can access the project
        if (!$request->user()->canAccessProject($task->project_id)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $comments = Comment::where('task_id', $taskId)
            ->with('user:id,name,email,avatar')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'comments' => $comments,
        ]);
    }

    public function store(Request $request, $taskId)
    {
        $task = Task::findOrFail($taskId);

        if (!$request->user()->canAccessProject($task->project_id)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $comment = Comment::create([
            'task_id' => $taskId,
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        return response()->json([
            'success' => true,
            'comment' => $comment->load('user'),
            'message' => 'Comment added successfully',
        ], 201);
    }

    public function update(Request $request, $taskId, $commentId)
    {
        $comment = Comment::where('task_id', $taskId)->findOrFail($commentId);

        // Only comment owner can update
        if ($comment->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update($validated);

        return response()->json([
            'success' => true,
            'comment' => $comment->fresh()->load('user'),
            'message' => 'Comment updated successfully',
        ]);
    }

    public function destroy(Request $request, $taskId, $commentId)
    {
        $comment = Comment::where('task_id', $taskId)->findOrFail($commentId);

        if ($comment->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully',
        ]);
    }
}