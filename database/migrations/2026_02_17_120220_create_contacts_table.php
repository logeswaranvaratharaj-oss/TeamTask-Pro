<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $col) {
            $col->id();
            $col->string('name');
            $col->string('email')->nullable();
            $col->string('phone')->nullable();
            $col->string('company')->nullable();
            $col->string('job_title')->nullable();
            $col->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $col->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
