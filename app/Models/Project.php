<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'type',
        'owner_id',
        'status',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class)
                    ->withPivot('role')
                    ->withTimestamps();
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    // Get task statistics for dashboard
    public function getTaskStats()
    {
        return [
            'total' => $this->tasks()->count(),
            'completed' => $this->tasks()->where('status', 'completed')->count(),
            'in_progress' => $this->tasks()->where('status', 'in_progress')->count(),
            'todo' => $this->tasks()->where('status', 'todo')->count(),
        ];
    }

    // Scope for active projects
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Scope for team projects
    public function scopeTeam($query)
    {
        return $query->where('type', 'team');
    }

    // Scope for personal projects
    public function scopePersonal($query)
    {
        return $query->where('type', 'personal');
    }
}