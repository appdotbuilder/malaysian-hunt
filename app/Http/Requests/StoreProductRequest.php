<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'url' => 'required|url|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'project_type' => 'required|in:startup,company,personal,community',
            'location' => 'nullable|string|max:100',
            'is_made_in_my' => 'required|boolean',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Product title is required.',
            'description.required' => 'Product description is required.',
            'url.required' => 'Product URL is required.',
            'url.url' => 'Please provide a valid URL.',
            'project_type.required' => 'Please select a project type.',
            'project_type.in' => 'Invalid project type selected.',
            'is_made_in_my.required' => 'Please confirm if this product is made in Malaysia.',
        ];
    }
}