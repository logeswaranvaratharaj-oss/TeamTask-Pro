<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Deal;
use App\Models\Task;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Total Deals Count
        $dealsCount = Deal::where('owner_id', $user->id)
            ->orWhereHas('members', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->count();

        // Total Revenue (Deal Value of Active Deals)
        $totalRevenue = Deal::where('owner_id', $user->id)
            ->whereIn('pipeline_stage', ['qualified', 'proposal', 'negotiation', 'closed_won'])
            ->sum('deal_value');

        // contacts count
        $contactsCount = Contact::where('owner_id', $user->id)->count();

        // Get activities (tasks) assigned to user
        $myActivitiesCount = Task::where('assigned_to', $user->id)->count();
        $completedActivitiesCount = Task::where('assigned_to', $user->id)
            ->where('status', 'completed')
            ->count();

        // Get overdue activities
        $overdueActivities = Task::where('assigned_to', $user->id)
            ->where('status', '!=', 'completed')
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<', now())
            ->count();

        // Get recent activities
        $recentActivities = Task::where('assigned_to', $user->id)
            ->with(['deal:id,title', 'assignee:id,name'])
            ->latest()
            ->limit(5)
            ->get();

        // Sales Pipeline Data (Breakdown by stage)
        $pipelineData = Deal::where('owner_id', $user->id)
            ->select('pipeline_stage as stage', DB::raw('count(*) as count'), DB::raw('sum(deal_value) as value'))
            ->groupBy('pipeline_stage')
            ->get();

        return response()->json([
            'success' => true,
            'stats' => [
                'deals_count' => $dealsCount,
                'total_revenue' => $totalRevenue,
                'contacts_count' => $contactsCount,
                'overdue_activities' => $overdueActivities,
                'completed_ratio' => $myActivitiesCount > 0 ? round(($completedActivitiesCount / $myActivitiesCount) * 100) : 0,
                // Compatibility keys
                'projects_count' => $dealsCount,
                'my_tasks_count' => $myActivitiesCount,
            ],
            'recent_tasks' => $recentActivities,
            'pipeline_data' => $pipelineData,
        ]);
    }
}