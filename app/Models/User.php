<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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

    // User's owned deals
    public function ownedDeals(): HasMany
    {
        return $this->hasMany(Deal::class, 'owner_id');
    }

    // Deals user is member of
    public function deals(): BelongsToMany
    {
        return $this->belongsToMany(Deal::class, 'deal_user', 'user_id', 'deal_id')
                    ->withTimestamps();
    }

    // Tasks assigned to user
    public function assignedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    // Tasks created by user
    public function createdTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'created_by');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // Contacts owned by user
    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class, 'owner_id');
    }

    // Helper method to check if user can access deal
    public function canAccessDeal($dealId)
    {
        return $this->deals()->where('deal_id', $dealId)->exists() 
               || $this->ownedDeals()->where('id', $dealId)->exists();
    }

    // Compatibility method
    public function canAccessProject($id)
    {
        return $this->canAccessDeal($id);
    }
}