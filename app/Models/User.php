<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // User's owned projects
    public function ownedProjects()
    {
        return $this->hasMany(Project::class, 'owner_id');
    }

    // Projects user is member of
    public function projects()
    {
        return $this->belongsToMany(Project::class)
                    ->withPivot('role')
                    ->withTimestamps();
    }

    // Tasks assigned to user
    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    // Tasks created by user
    public function createdTasks()
    {
        return $this->hasMany(Task::class, 'created_by');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Helper method to check if user can access project
    public function canAccessProject($projectId)
    {
        return $this->projects()->where('project_id', $projectId)->exists() 
               || $this->ownedProjects()->where('id', $projectId)->exists();
    }
}