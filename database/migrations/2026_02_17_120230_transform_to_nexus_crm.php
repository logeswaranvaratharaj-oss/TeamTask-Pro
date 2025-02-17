<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Rename projects to deals if projects exists
        if (Schema::hasTable('projects')) {
            // Drop foreign keys first
            Schema::table('tasks', function (Blueprint $table) {
                $table->dropForeign(['project_id']);
            });
            
            Schema::table('project_user', function (Blueprint $table) {
                $table->dropForeign(['project_id']);
                $table->dropForeign(['user_id']);
            });

            Schema::rename('projects', 'deals');
        }

        // 2. Rename project_user to deal_user
        if (Schema::hasTable('project_user')) {
            Schema::rename('project_user', 'deal_user');
        }

        // 3. Update columns in deals
        if (Schema::hasTable('deals') && Schema::hasColumn('deals', 'name')) {
            Schema::table('deals', function (Blueprint $table) {
                $table->renameColumn('name', 'title');
            });
        }

        if (Schema::hasTable('deals') && !Schema::hasColumn('deals', 'deal_value')) {
            Schema::table('deals', function (Blueprint $table) {
                $table->decimal('deal_value', 15, 2)->default(0);
                $table->string('pipeline_stage')->default('discovery');
                $table->foreignId('contact_id')->nullable()->constrained('contacts')->onDelete('set null');
            });
        }

        // 4. Update deal_user table columns
        if (Schema::hasTable('deal_user') && Schema::hasColumn('deal_user', 'project_id')) {
            Schema::table('deal_user', function (Blueprint $table) {
                $table->renameColumn('project_id', 'deal_id');
            });
        }

        // 5. Update tasks table columns
        if (Schema::hasTable('tasks') && Schema::hasColumn('tasks', 'project_id')) {
            Schema::table('tasks', function (Blueprint $table) {
                $table->renameColumn('project_id', 'deal_id');
            });
        }

        // 6. Re-add foreign keys (carefully)
        Schema::table('deal_user', function (Blueprint $table) {
            // Check if foreign keys already exist is harder, but we can try adding them
            try {
                $table->foreign('deal_id')->references('id')->on('deals')->onDelete('cascade');
            } catch (\Exception $e) {}
            try {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            } catch (\Exception $e) {}
        });

        Schema::table('tasks', function (Blueprint $table) {
            try {
                $table->foreign('deal_id')->references('id')->on('deals')->onDelete('cascade');
            } catch (\Exception $e) {}
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
