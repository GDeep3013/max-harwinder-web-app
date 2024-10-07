<?php

namespace App\Traits;

use Illuminate\Support\Facades\Http;

trait SearchProductTraits
{

    private function searchProductWithShopifyAPI($shop, $query, $resourceType)
    {
        // $shop = "verywhiskey.myshopify.com";
        $url = "https://{$shop}/search/suggest.json?q=" . urlencode($query) . "&resources[type]=" . $resourceType . "&resources[options][fields]=author,product_type,tag,title,variants.barcode,variants.sku,variants.title,vendor";
        $ch = curl_init();

        // Set cURL options
        curl_setopt($ch, CURLOPT_URL, $url);  // Set the URL
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  // Return the response as a string
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);  // Follow redirects if necessary
        curl_setopt($ch, CURLOPT_HTTPGET, true);  // Set request to GET
        $response = curl_exec($ch);

        // Check for cURL errors
        if (curl_errno($ch)) {
            echo 'cURL error: ' . curl_error($ch);
        } else {
            // Decode the JSON response
            $data = json_decode($response, true);

            // Output the result
            return $data['resources']['results']['products'];
        }

        // Close the cURL session
        curl_close($ch);
        // dd($url);
        // $response = Http::get($url);

        // if ($response->successful()) {
        //     $data =  $response->json();
        //     return $data['resources']['results']['products'];
        //     // $results = $data['resources']['results'] ?? null;
        //     // $finalResults = [];
        //     // foreach (['products', 'pages', 'articles', 'collections'] as $resourceType) {
        //     //     if (isset($results[$resourceType]) && !empty($results[$resourceType])) {
        //     //         foreach ($results[$resourceType] as $resource) {
        //     //             if (!empty($resource['title']) && !empty($resource['url'])) {
        //     //                 $finalResults[] = [
        //     //                     'type' => $resourceType,
        //     //                     'title' => $resource['title'],
        //     //                     'url' => $resource['url'],
        //     //                     'image' => $resource['image'] ?? null,
        //     //                     'description' => $resources_type === "page"? null : $resource['body'] ?? null
        //     //                 ];
        //     //             }
        //     //         }
        //     //     }
        //     // }

        //     // Return the final results as a JSON response
        //     // return response()->json($results);


        //     // return response()->json(
        //     //     $response->json()
        //     // );

        // } else {
        //     return response()->json(['error' => 'Failed to fetch search results'], $response->status());
        // }
    }
}
