<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get user's projects count
        $projectsCount = Project::where('owner_id', $user->id)
            ->orWhereHas('members', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->count();

        // Get tasks assigned to user
        $myTasksCount = Task::where('assigned_to', $user->id)->count();
        $completedTasksCount = Task::where('assigned_to', $user->id)
            ->where('status', 'completed')
            ->count();

        // Get overdue tasks
        $overdueTasks = Task::where('assigned_to', $user->id)
            ->where('status', '!=', 'completed')
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<', now())
            ->count();

        // Get recent tasks
        $recentTasks = Task::where('assigned_to', $user->id)
            ->with(['project:id,name', 'assignee:id,name'])
            ->latest()
            ->limit(5)
            ->get();

        // Get task breakdown by status
        $tasksByStatus = Task::where('assigned_to', $user->id)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        return response()->json([
            'success' => true,
            'stats' => [
                'projects_count' => $projectsCount,
                'my_tasks_count' => $myTasksCount,
                'completed_tasks_count' => $completedTasksCount,
                'overdue_tasks_count' => $overdueTasks,
            ],
            'recent_tasks' => $recentTasks,
            'tasks_by_status' => $tasksByStatus,
        ]);
    }
}