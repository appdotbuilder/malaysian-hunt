import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Props {
    projectTypes: string[];
    locations: string[];
    [key: string]: unknown;
}

export default function CreateProduct({ projectTypes, locations }: Props) {
    const [tagInput, setTagInput] = useState('');
    
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        url: '',
        tags: [] as string[],
        project_type: 'personal',
        location: '',
        is_made_in_my: true as boolean,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/products');
    };

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim().toLowerCase();
        if (trimmedTag && !data.tags.includes(trimmedTag)) {
            setData('tags', [...data.tags, trimmedTag]);
        }
    };

    const removeTag = (tagToRemove: string) => {
        setData('tags', data.tags.filter(tag => tag !== tagToRemove));
    };

    const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            if (tagInput.trim()) {
                addTag(tagInput);
                setTagInput('');
            }
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

    const suggestedTags = ['tech', 'finance', 'education', 'food', 'creative', 'health', 'travel', 'ecommerce', 'ai', 'mobile', 'web', 'saas'];

    return (
        <AppShell>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        📝 Submit Your Product
                    </h1>
                    <p className="text-gray-600">
                        Share your Malaysian-made product with the community and get feedback from fellow Malaysians
                    </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Title *
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="e.g. Malaysian Food Delivery App"
                                required
                            />
                            {errors.title && (
                                <div className="text-red-600 text-sm mt-1">{errors.title}</div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="Describe what your product does, who it's for, and what makes it special..."
                                required
                            />
                            {errors.description && (
                                <div className="text-red-600 text-sm mt-1">{errors.description}</div>
                            )}
                        </div>

                        {/* URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product URL *
                            </label>
                            <input
                                type="url"
                                value={data.url}
                                onChange={(e) => setData('url', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="https://yourproduct.com"
                                required
                            />
                            {errors.url && (
                                <div className="text-red-600 text-sm mt-1">{errors.url}</div>
                            )}
                        </div>

                        {/* Project Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project Type *
                            </label>
                            <select
                                value={data.project_type}
                                onChange={(e) => setData('project_type', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                required
                            >
                                {projectTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {getProjectTypeEmoji(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {errors.project_type && (
                                <div className="text-red-600 text-sm mt-1">{errors.project_type}</div>
                            )}
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <select
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="">Select your location</option>
                                {locations.map((location) => (
                                    <option key={location} value={location}>
                                        📍 {location}
                                    </option>
                                ))}
                            </select>
                            {errors.location && (
                                <div className="text-red-600 text-sm mt-1">{errors.location}</div>
                            )}
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagInput}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Type tags and press Enter or comma (e.g. tech, mobile, fintech)"
                                />
                                
                                {/* Current Tags */}
                                {data.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {data.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                            >
                                                #{tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="text-orange-600 hover:text-orange-800"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Suggested Tags */}
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Suggested tags:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {suggestedTags.filter(tag => !data.tags.includes(tag)).slice(0, 8).map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => addTag(tag)}
                                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                                            >
                                                +{tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {errors.tags && (
                                <div className="text-red-600 text-sm mt-1">{errors.tags}</div>
                            )}
                        </div>

                        {/* Made in Malaysia Confirmation */}
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="is_made_in_my"
                                    checked={data.is_made_in_my}
                                    onChange={(e) => setData('is_made_in_my', e.target.checked)}
                                    className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                    required
                                />
                                <div>
                                    <label htmlFor="is_made_in_my" className="font-medium text-orange-900">
                                        🇲🇾 Made in Malaysia Confirmation *
                                    </label>
                                    <p className="text-sm text-orange-700">
                                        I confirm that this product is created by Malaysians (individuals, startups, or companies based in Malaysia)
                                    </p>
                                </div>
                            </div>
                            {errors.is_made_in_my && (
                                <div className="text-red-600 text-sm mt-2">{errors.is_made_in_my}</div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg"
                            >
                                {processing ? (
                                    <>⏳ Submitting...</>
                                ) : (
                                    <>🚀 Submit Product</>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Guidelines */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">📋 Submission Guidelines</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                        <li>• Product must be created by Malaysians or Malaysian companies</li>
                        <li>• Provide a clear, descriptive title and detailed description</li>
                        <li>• Use relevant tags to help others discover your product</li>
                        <li>• Include a working URL to your product or landing page</li>
                        <li>• Be respectful and follow our community guidelines</li>
                    </ul>
                </div>
            </div>
        </AppShell>
    );
}