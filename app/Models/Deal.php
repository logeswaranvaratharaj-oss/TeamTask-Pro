<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Deal extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'owner_id',
        'pipeline_stage', // discovery, qualified, proposal, negotiation, closed_won, closed_lost
        'deal_value',
        'contact_id',
        'start_date',
        'end_date',
        'type', // team, personal (we can keep this or repurpose)
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'deal_value' => 'decimal:2',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'deal_user', 'deal_id', 'user_id')
            ->withTimestamps();
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function scopePersonal($query)
    {
        return $query->where('type', 'personal');
    }

    public function scopeTeam($query)
    {
        return $query->where('type', '!=', 'personal');
    }
}