import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

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
    author: {
        name: string;
    };
    created_at: string;
}

interface Location {
    location: string;
    count: number;
}

interface Stats {
    totalProducts: number;
    totalVotes: number;
}

interface Props {
    trendingProducts: Product[];
    recentProducts: Product[];
    stats: Stats;
    topLocations: Location[];
    [key: string]: unknown;
}

export default function Welcome({ trendingProducts, recentProducts, stats, topLocations }: Props) {
    const handleGetStarted = () => {
        router.get('/products');
    };

    const handleSubmitProduct = () => {
        router.get('/products/create');
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString();
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

    const ProductCard = ({ product }: { product: Product }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        <Link 
                            href={`/products/${product.id}`}
                            className="hover:text-orange-600 transition-colors"
                        >
                            {product.title}
                        </Link>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                </div>
                <div className="text-center ml-4">
                    <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                        ▲ {product.votes_count}
                    </div>
                </div>
            </div>
            
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{getProjectTypeEmoji(product.project_type)} {product.project_type}</span>
                    {product.location && <span>📍 {product.location}</span>}
                    <span>👤 {product.author.name}</span>
                </div>
                <div className="flex space-x-2">
                    {product.tags?.slice(0, 2).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            🇲🇾 <span className="text-orange-600">Local Hunt</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
                            Discover amazing products, apps, and startups made by Malaysians, for Malaysians
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button 
                                onClick={handleGetStarted}
                                size="lg" 
                                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
                            >
                                🔍 Explore Products
                            </Button>
                            <Button 
                                onClick={handleSubmitProduct}
                                variant="outline" 
                                size="lg"
                                className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3 text-lg"
                            >
                                📝 Submit Your Product
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                            {formatNumber(stats.totalProducts)}
                        </div>
                        <div className="text-gray-600">Malaysian Products</div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                            {formatNumber(stats.totalVotes)}
                        </div>
                        <div className="text-gray-600">Community Votes</div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                            {topLocations.length}+
                        </div>
                        <div className="text-gray-600">States Represented</div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                            100%
                        </div>
                        <div className="text-gray-600">Made in Malaysia</div>
                    </div>
                </div>
            </div>

            {/* Trending Products */}
            {trendingProducts.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            🔥 Trending This Week
                        </h2>
                        <p className="text-lg text-gray-600">
                            Most upvoted Malaysian products from the past 7 days
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trendingProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Products */}
            {recentProducts.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            ✨ Recently Added
                        </h2>
                        <p className="text-lg text-gray-600">
                            Fresh Malaysian innovations just submitted to our platform
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}

            {/* Featured Locations */}
            {topLocations.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            🗺️ Innovation Across Malaysia
                        </h2>
                        <p className="text-lg text-gray-600">
                            Top states contributing to our local innovation ecosystem
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {topLocations.map((location, index) => (
                            <Link
                                key={index}
                                href={`/products?location=${encodeURIComponent(location.location)}`}
                                className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow border border-gray-200"
                            >
                                <div className="text-2xl mb-2">📍</div>
                                <div className="font-semibold text-gray-900">{location.location}</div>
                                <div className="text-sm text-gray-600">
                                    {location.count} product{location.count !== 1 ? 's' : ''}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* CTA Section */}
            <div className="bg-orange-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Share Your Malaysian Innovation? 🚀
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join hundreds of Malaysian makers showcasing their products to the local community
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            onClick={handleSubmitProduct}
                            size="lg" 
                            variant="secondary"
                            className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-3 text-lg"
                        >
                            📝 Submit Your Product
                        </Button>
                        <Button 
                            onClick={handleGetStarted}
                            size="lg" 
                            variant="outline"
                            className="border-white text-white hover:bg-orange-700 px-8 py-3 text-lg"
                        >
                            👀 Browse All Products
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <div className="text-2xl font-bold mb-4">🇲🇾 Local Hunt</div>
                    <p className="text-gray-400 mb-6">
                        Celebrating Malaysian innovation, one product at a time
                    </p>
                    <div className="text-gray-500 text-sm">
                        Made with ❤️ in Malaysia
                    </div>
                </div>
            </div>
        </div>
    );
}