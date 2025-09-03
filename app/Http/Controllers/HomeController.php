<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index()
    {
        // Get trending products (most voted in last 7 days)
        $trendingProducts = Product::with(['author', 'votes', 'comments'])
            ->withCount(['votes', 'comments'])
            ->madeInMalaysia()
            ->whereHas('votes', function ($query) {
                $query->where('created_at', '>=', now()->subDays(7));
            })
            ->orderBy('votes_count', 'desc')
            ->limit(6)
            ->get();

        // Get recent products
        $recentProducts = Product::with(['author', 'votes', 'comments'])
            ->withCount(['votes', 'comments'])
            ->madeInMalaysia()
            ->latest()
            ->limit(6)
            ->get();

        // Get stats
        $totalProducts = Product::madeInMalaysia()->count();
        $totalVotes = \DB::table('votes')
            ->join('products', 'votes.product_id', '=', 'products.id')
            ->where('products.is_made_in_my', true)
            ->count();

        // Get featured locations and project types
        $topLocations = Product::madeInMalaysia()
            ->whereNotNull('location')
            ->select('location', \DB::raw('count(*) as count'))
            ->groupBy('location')
            ->orderBy('count', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('welcome', [
            'trendingProducts' => $trendingProducts,
            'recentProducts' => $recentProducts,
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalVotes' => $totalVotes,
            ],
            'topLocations' => $topLocations,
        ]);
    }
}