<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Vote;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Check if user already voted
        $existingVote = Vote::where('user_id', auth()->id())
            ->where('product_id', $product->id)
            ->first();

        if ($existingVote) {
            // Remove vote (toggle)
            $existingVote->delete();
            $message = 'Vote removed! 👎';
        } else {
            // Add vote
            Vote::create([
                'user_id' => auth()->id(),
                'product_id' => $product->id,
            ]);
            $message = 'Thanks for your vote! 👍';
        }

        return back()->with('success', $message);
    }
}