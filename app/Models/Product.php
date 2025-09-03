<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Product
 *
 * @property int $id
 * @property string $title
 * @property string $description
 * @property string $url
 * @property array|null $tags
 * @property string $project_type
 * @property string|null $location
 * @property bool $is_made_in_my
 * @property int $author_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $author
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Vote> $votes
 * @property-read int|null $votes_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Comment> $comments
 * @property-read int|null $comments_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Product newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Product newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Product query()
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereAuthorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereIsMadeInMy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereProjectType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereTags($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereUrl($value)
 * @method static \Database\Factories\ProductFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'url',
        'tags',
        'project_type',
        'location',
        'is_made_in_my',
        'author_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tags' => 'array',
        'is_made_in_my' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the author of the product.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get all votes for the product.
     */
    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    /**
     * Get all comments for the product.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Scope to only include Malaysian-made products.
     */
    public function scopeMadeInMalaysia($query)
    {
        return $query->where('is_made_in_my', true);
    }

    /**
     * Scope to filter by project type.
     */
    public function scopeByProjectType($query, $type)
    {
        return $query->where('project_type', $type);
    }

    /**
     * Scope to filter by location.
     */
    public function scopeByLocation($query, $location)
    {
        return $query->where('location', $location);
    }
}