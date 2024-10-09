<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\SearchProductTraits;
use Http;
use Log;

class ProductController extends Controller
{
    use SearchProductTraits;
    public function getShopifyProducts(Request $request)
    {
        if (!empty($request->search)) {
            $searchTerm = $request->query('search');
            $query = "";

            // if (ctype_digit($searchTerm)) {
            //     $query = "variants.barcode: $searchTerm";
            // } else {
            //     $query = "title: $searchTerm";
            // }

            $productData = $this->searchProductWithShopifyAPI($searchTerm);
            if($productData['status']) {

                $products = $productData['product']['edges'];
                $mappedProducts = array_map(function ($product) {
                    // Extract product details
                    $productNode = $product['node'];
                    $productTitle = $productNode['title'];
                    $productHandle = $productNode['handle'];
                    $productId = $productNode['id'];
    
                    // Map the images
                    $images = array_map(function ($imageEdge) {
                        return $imageEdge['node']['url'];
                    }, $productNode['images']['edges']);
    
                    // Map the variants
                    $variants = array_map(function ($variantEdge) {
                        return [
                            'id' => $variantEdge['node']['id'],
                            'barcode' => $variantEdge['node']['barcode'],
                            'sku' => $variantEdge['node']['sku'],
                            'title' => $variantEdge['node']['title']
                        ];
                    }, $productNode['variants']['edges']);
    
                    // Return the mapped product
                    return [
                        'id' => $productId,
                        'handle' => $productHandle,
                        'title' => $productTitle,
                        'images' => $images,
                        'variants' => $variants
                    ];
                }, $products);
                if (count($mappedProducts) > 0) {
                    return response()->json(['status' => true, "data" => $mappedProducts]);
                } else {
                    return response()->json(['status' => false, 'message' => "Product not found"]);
                }
            }
        }
    }
    public function getShopifyProductsVariants(Request $request)
    {
        if (!empty($request->productId)) {
            $response = Http::withHeaders([
                'X-Shopify-Access-Token' => env('SHOPIFY_ACCESS_TOKEN')
            ])->get("https://" . env('SHOPIFY_STORE_NAME') . "/admin/api/" . env('SHOPIFY_API_VERSION') . "/products/" . $request->productId . ".json");
            $product = $response->json();
            return response()->json([
                'status' => $product['product'] ? true : false,
                'data' => $product['product'] ?? [],
                'error' => $product['errors'] ?? false,
            ]);
        } else {
            return response()->json(['status' => false, 'message' => "Product not found"]);
        }
    }
    public function updateShopifyProductsVariantSKU(Request $request) {
        $validatedData = $request->validate([
            'variantId' => 'required|string',
            'sku' => 'required|string',
            // Add any other fields you want to update
        ]);
        Log::info("validatedData", ['data' => $validatedData]);
        // Prepare the data to send in the PUT request
        $data = [
            'variant' => [
                'id' => $validatedData['variantId'],
                'sku' => $validatedData['sku']
            ]
        ];
        Log::info("datawqww", ['data' => $data, 'url' => "https://610-weblab.myshopify.com/admin/api/".env('SHOPIFY_API_VERSION')."/variants/".$validatedData['variantId'].".json"]);
            $response = Http::withHeaders([
                'X-Shopify-Access-Token' => env('SHOPIFY_ACCESS_TOKEN')
            ])->put("https://610-weblab.myshopify.com/admin/api/".env('SHOPIFY_API_VERSION')."/variants/".$validatedData['variantId'].".json", $data);
            $product = $response->json();
            Log::info("product211221", ['product' => $data]);
         return response()->json(['status' => true, 'message' => $product]);
            if(isset($product['variant'])) {
                return response()->json(['status' => true, 'message' => 'Location can be update successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to update location']);
            }
        
    }
}
