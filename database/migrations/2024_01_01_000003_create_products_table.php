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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('url');
            $table->json('tags')->nullable();
            $table->enum('project_type', ['startup', 'company', 'personal', 'community'])->default('personal');
            $table->string('location')->nullable();
            $table->boolean('is_made_in_my')->default(true);
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('title');
            $table->index('project_type');
            $table->index('location');
            $table->index('is_made_in_my');
            $table->index(['created_at', 'is_made_in_my']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};