<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Models\Comment;

class CommentController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCommentRequest $request)
    {
        Comment::create([
            'content' => $request->content,
            'author_id' => auth()->id(),
            'product_id' => $request->product_id,
        ]);

        return back()->with('success', 'Comment added successfully! 💬');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        // Check if user owns the comment
        if ($comment->author_id !== auth()->id()) {
            abort(403);
        }

        $comment->delete();

        return back()->with('success', 'Comment deleted! 🗑️');
    }
}