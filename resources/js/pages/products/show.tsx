import React from 'react';
import { router, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface User {
    id: number;
    name: string;
}

interface Vote {
    id: number;
    user_id: number;
}

interface Comment {
    id: number;
    content: string;
    created_at: string;
    author: User;
}

interface Product {
    id: number;
    title: string;
    description: string;
    url: string;
    tags: string[];
    project_type: string;
    location: string;
    votes_count: number;
    comments_count: number;
    author: User;
    created_at: string;
    votes: Vote[];
    comments: Comment[];
}

interface Props {
    product: Product;
    userVote: Vote | null;
    [key: string]: unknown;
}

export default function ShowProduct({ product, userVote }: Props) {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;
    
    const handleVote = () => {
        if (!auth?.user) {
            router.get('/login');
            return;
        }

        router.post('/votes', { product_id: product.id }, {
            preserveScroll: true,
        });
    };

    const handleComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!auth?.user) {
            router.get('/login');
            return;
        }

        const formData = new FormData(e.currentTarget);
        const content = formData.get('content') as string;

        if (content.trim()) {
            router.post('/comments', {
                content: content,
                product_id: product.id,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    (e.target as HTMLFormElement).reset();
                }
            });
        }
    };

    const handleDeleteComment = (commentId: number) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            router.delete(`/comments/${commentId}`, {
                preserveScroll: true,
            });
        }
    };

    const getProjectTypeEmoji = (type: string) => {
        const emojis = {
            startup: '🚀',
            company: '🏢',
            personal: '👤',
            community: '🤝'
        };
        return emojis[type as keyof typeof emojis] || '📱';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-MY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-MY', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Product Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                {product.title}
                            </h1>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                                <span>{getProjectTypeEmoji(product.project_type)} {product.project_type}</span>
                                {product.location && <span>📍 {product.location}</span>}
                                <span>👤 {product.author.name}</span>
                                <span>📅 {formatDate(product.created_at)}</span>
                            </div>

                            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                {product.description}
                            </p>

                            {product.tags && product.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {product.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center space-x-4">
                                <a
                                    href={product.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    🌐 Visit Product
                                </a>

                                <div className="flex items-center space-x-4 text-gray-600">
                                    <span>👍 {product.votes_count} votes</span>
                                    <span>💬 {product.comments_count} comments</span>
                                </div>
                            </div>
                        </div>

                        {/* Vote Button */}
                        <div className="ml-8 text-center">
                            <Button
                                onClick={handleVote}
                                variant={userVote ? "default" : "outline"}
                                className={`px-6 py-3 ${
                                    userVote 
                                        ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                                        : 'border-orange-600 text-orange-600 hover:bg-orange-50'
                                }`}
                            >
                                <div className="text-center">
                                    <div className="text-2xl mb-1">
                                        {userVote ? '👍' : '👆'}
                                    </div>
                                    <div className="font-bold text-lg">
                                        {product.votes_count}
                                    </div>
                                    <div className="text-xs">
                                        {userVote ? 'Voted' : 'Vote'}
                                    </div>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        💬 Discussion ({product.comments_count})
                    </h2>

                    {/* Comment Form */}
                    {auth?.user ? (
                        <form onSubmit={handleComment} className="mb-8">
                            <div className="mb-4">
                                <textarea
                                    name="content"
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Share your thoughts, feedback, or questions about this product..."
                                    required
                                />
                            </div>
                            <Button 
                                type="submit"
                                className="bg-orange-600 hover:bg-orange-700"
                            >
                                💬 Add Comment
                            </Button>
                        </form>
                    ) : (
                        <div className="mb-8 bg-gray-50 rounded-lg p-6 text-center">
                            <p className="text-gray-600 mb-4">
                                Join the discussion! Sign in to leave a comment.
                            </p>
                            <Button 
                                onClick={() => router.get('/login')}
                                variant="outline"
                                className="border-orange-600 text-orange-600 hover:bg-orange-50"
                            >
                                🔑 Sign In
                            </Button>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-6">
                        {product.comments && product.comments.length > 0 ? (
                            product.comments.map((comment) => (
                                <div key={comment.id} className="border-l-4 border-orange-200 pl-6 py-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                                                {comment.author.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {comment.author.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {formatTime(comment.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {auth?.user?.id === comment.author.id && (
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                    
                                    <p className="text-gray-700 leading-relaxed">
                                        {comment.content}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">💭</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No comments yet
                                </h3>
                                <p className="text-gray-600">
                                    Be the first to share your thoughts about this product!
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Back to Products */}
                <div className="mt-8 text-center">
                    <Button 
                        variant="outline"
                        onClick={() => router.get('/products')}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        ← Back to All Products
                    </Button>
                </div>
            </div>
        </AppShell>
    );
}