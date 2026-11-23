<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('path');
            $table->string('filename')->nullable();
            $table->string('alt')->nullable();
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->timestamps();
        });

        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('description');
            $table->string('icon');
            $table->boolean('active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category');
            $table->string('client')->nullable();
            $table->string('year')->nullable();
            $table->string('image_url', 2048)->nullable();
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->json('blocks')->nullable();
            $table->json('gallery')->nullable();
            $table->boolean('tall')->default(true);
            $table->boolean('featured')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        Schema::create('case_studies', function (Blueprint $table) {
            $table->id();
            $table->string('client');
            $table->string('sector');
            $table->string('result');
            $table->string('result_label');
            $table->text('description');
            $table->string('image_url', 2048)->nullable();
            $table->string('image')->nullable();
            $table->longText('body')->nullable();
            $table->json('metrics')->nullable();
            $table->boolean('published')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        Schema::create('audiences', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('icon');
            $table->boolean('published')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role');
            $table->text('quote');
            $table->unsignedTinyInteger('rating')->default(5);
            $table->boolean('published')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        Schema::create('proposals', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('email');
            $table->string('whatsapp');
            $table->string('company');
            $table->string('website')->nullable();
            $table->text('message')->nullable();
            $table->json('services')->nullable();
            $table->string('formal_price')->nullable();
            $table->json('content_blocks')->nullable();
            $table->text('formal_notes')->nullable();
            $table->string('client_response')->nullable();
            $table->text('negotiate_message')->nullable();
            $table->timestamp('client_responded_at')->nullable();
            $table->string('status')->default('nova')->index();
            $table->timestamp('sent_at')->nullable();
            $table->uuid('access_token')->nullable()->unique();
            $table->timestamps();
        });

        Schema::create('site_globals', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('data')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_globals');
        Schema::dropIfExists('proposals');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('audiences');
        Schema::dropIfExists('case_studies');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('services');
        Schema::dropIfExists('media');
    }
};
