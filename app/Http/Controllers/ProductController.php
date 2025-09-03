<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with(['author', 'votes', 'comments'])
            ->withCount(['votes', 'comments'])
            ->madeInMalaysia();

        // Filter by project type
        if ($request->has('type') && $request->type) {
            $query->byProjectType($request->type);
        }

        // Filter by location
        if ($request->has('location') && $request->location) {
            $query->byLocation($request->location);
        }

        // Filter by tags
        if ($request->has('tag') && $request->tag) {
            $query->whereJsonContains('tags', $request->tag);
        }

        // Sort by popularity (vote count) or date
        $sortBy = $request->get('sort', 'popular');
        if ($sortBy === 'popular') {
            $query->orderBy('votes_count', 'desc')->orderBy('created_at', 'desc');
        } else {
            $query->latest();
        }

        $products = $query->paginate(12)->withQueryString();

        // Get filter options
        $projectTypes = ['startup', 'company', 'personal', 'community'];
        $locations = Product::distinct()->whereNotNull('location')->pluck('location')->sort()->values();
        $allTags = Product::whereNotNull('tags')->pluck('tags')->flatten()->unique()->sort()->values();

        return Inertia::render('products/index', [
            'products' => $products,
            'filters' => [
                'type' => $request->get('type'),
                'location' => $request->get('location'),
                'tag' => $request->get('tag'),
                'sort' => $sortBy,
            ],
            'filterOptions' => [
                'projectTypes' => $projectTypes,
                'locations' => $locations,
                'tags' => $allTags,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $projectTypes = ['startup', 'company', 'personal', 'community'];
        $locations = ['Kuala Lumpur', 'Penang', 'Johor', 'Selangor', 'Sabah', 'Sarawak', 'Perak', 'Kedah', 'Negeri Sembilan', 'Pahang', 'Terengganu', 'Kelantan', 'Perlis', 'Melaka', 'Putrajaya', 'Labuan'];

        return Inertia::render('products/create', [
            'projectTypes' => $projectTypes,
            'locations' => $locations,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $product = Product::create([
            'title' => $request->title,
            'description' => $request->description,
            'url' => $request->url,
            'tags' => $request->tags ?? [],
            'project_type' => $request->project_type,
            'location' => $request->location,
            'is_made_in_my' => $request->boolean('is_made_in_my'),
            'author_id' => auth()->id(),
        ]);

        return redirect()->route('products.show', $product)
            ->with('success', 'Product submitted successfully! 🚀');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load([
            'author',
            'votes' => fn($query) => $query->latest(),
            'comments' => fn($query) => $query->with('author')->latest(),
        ]);

        $product->loadCount(['votes', 'comments']);

        // Check if current user has voted
        $userVote = null;
        if (auth()->check()) {
            $userVote = $product->votes()->where('user_id', auth()->id())->first();
        }

        return Inertia::render('products/show', [
            'product' => $product,
            'userVote' => $userVote,
        ]);
    }
}