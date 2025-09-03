import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface User {
    id: number;
    name: string;
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
    author: {
        name: string;
    };
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedProducts {
    data: Product[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Filters {
    type: string | null;
    location: string | null;
    tag: string | null;
    sort: string;
}

interface FilterOptions {
    projectTypes: string[];
    locations: string[];
    tags: string[];
}

interface Props {
    products: PaginatedProducts;
    filters: Filters;
    filterOptions: FilterOptions;
    [key: string]: unknown;
}

export default function ProductsIndex({ products, filters, filterOptions }: Props) {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(window.location.search);
        
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        router.get('/products', Object.fromEntries(params), {
            preserveState: true,
        });
    };

    const clearFilters = () => {
        router.get('/products');
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
        return new Date(dateString).toLocaleDateString();
    };

    const ProductCard = ({ product }: { product: Product }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="font-semibold text-xl text-gray-900 mb-2">
                        <Link 
                            href={`/products/${product.id}`}
                            className="hover:text-orange-600 transition-colors"
                        >
                            {product.title}
                        </Link>
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-3">{product.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span>{getProjectTypeEmoji(product.project_type)} {product.project_type}</span>
                        {product.location && <span>📍 {product.location}</span>}
                        <span>👤 {product.author.name}</span>
                        <span>📅 {formatDate(product.created_at)}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                        {product.tags?.map((tag, index) => (
                            <button
                                key={index}
                                onClick={() => handleFilterChange('tag', tag)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs transition-colors"
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>👍 {product.votes_count} votes</span>
                            <span>💬 {product.comments_count} comments</span>
                        </div>
                        <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                        >
                            Visit →
                        </a>
                    </div>
                </div>
                
                <div className="text-center ml-6">
                    <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-medium">
                        ▲ {product.votes_count}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AppShell>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            🇲🇾 Malaysian Products
                        </h1>
                        <p className="text-gray-600">
                            Discover amazing products made by Malaysians ({products.total} total)
                        </p>
                    </div>
                    
                    {auth?.user && (
                        <Button 
                            onClick={() => router.get('/products/create')}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            📝 Submit Product
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                    <div className="flex flex-wrap items-center gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mr-2">Sort:</label>
                            <select
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="border border-gray-300 rounded px-3 py-1 text-sm"
                            >
                                <option value="popular">🔥 Most Popular</option>
                                <option value="recent">⏰ Most Recent</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mr-2">Type:</label>
                            <select
                                value={filters.type || ''}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                className="border border-gray-300 rounded px-3 py-1 text-sm"
                            >
                                <option value="">All Types</option>
                                {filterOptions.projectTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {getProjectTypeEmoji(type)} {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mr-2">Location:</label>
                            <select
                                value={filters.location || ''}
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                                className="border border-gray-300 rounded px-3 py-1 text-sm"
                            >
                                <option value="">All Locations</option>
                                {filterOptions.locations.map((location) => (
                                    <option key={location} value={location}>
                                        📍 {location}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mr-2">Tag:</label>
                            <select
                                value={filters.tag || ''}
                                onChange={(e) => handleFilterChange('tag', e.target.value)}
                                className="border border-gray-300 rounded px-3 py-1 text-sm"
                            >
                                <option value="">All Tags</option>
                                {filterOptions.tags.map((tag) => (
                                    <option key={tag} value={tag}>
                                        #{tag}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {(filters.type || filters.location || filters.tag) && (
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>

                {/* Products Grid */}
                {products.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {products.last_page > 1 && (
                            <div className="flex items-center justify-center space-x-2">
                                {products.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (link.url) {
                                                const url = new URL(link.url);
                                                router.get(url.pathname + url.search);
                                            }
                                        }}
                                        disabled={!link.url}
                                        className={`px-3 py-2 text-sm rounded ${
                                            link.active
                                                ? 'bg-orange-600 text-white'
                                                : link.url
                                                ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Try adjusting your filters or check back later for new Malaysian innovations
                        </p>
                        {auth?.user && (
                            <Button 
                                onClick={() => router.get('/products/create')}
                                className="bg-orange-600 hover:bg-orange-700"
                            >
                                📝 Be the first to submit a product!
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </AppShell>
    );
}