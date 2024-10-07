<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\SearchProductTraits;

class ProductController extends Controller
{
    use SearchProductTraits;
    public function getShopifyProducts(Request $request)
    {
        if (!empty($request->search)) {
            $shop = env('SHOPIFY_STORE_NAME');
            $resourceType = "product";
            $query = $request->search;
            $product = $this->searchProductWithShopifyAPI($shop, $query, $resourceType);
           if(count($product) > 0) {
                return response()->json(['status' => true, "data" => $product]);
           } else {
                return response()->json(['status' => false, 'message' => "Product not found"]);
           }
        }
    }
}
