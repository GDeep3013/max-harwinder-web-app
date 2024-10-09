<?php

namespace App\Traits;

use Illuminate\Support\Facades\Http;
use GuzzleHttp\Client;
use Log;

trait SearchProductTraits
{

    private function searchProductWithShopifyAPI($searchTerm)
    {

        // $searchTerm = "134567890";

        if (ctype_digit($searchTerm)) {
            $variables = "variants.barcode:$searchTerm";
        } else {
            $variables = "title:$searchTerm";
        }
        
        $shopifyApiUrl = 'https://' . env('SHOPIFY_STORE_NAME') . '/admin/api/' . env('SHOPIFY_API_VERSION') . '/graphql.json';
        $client = new Client();
        $query = <<<GRAPHQL
                query {
                    products(first: 1, query: "$variables") {
                        edges {
                            node {
                                id
                                title
                                handle
                                images(first:5) {
                                    edges {
                                        node {
                                            id
                                            url
                                        }
                                    }
                                }
                                variants(first:100) {
                                    edges {
                                        node {
                                            id
                                            barcode
                                            sku
                                            title
                                        }
                                    }
                                }
                            }
                            cursor
                        }
                        pageInfo {
                            hasNextPage
                        }
                    }
                }
            GRAPHQL;

        try {

            $response = $client->post($shopifyApiUrl, [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-Shopify-Access-Token' => env('SHOPIFY_ACCESS_TOKEN'),
                ],
                'json' => [
                    'query' => $query,
                ]
            ]);

            $responseBody = json_decode($response->getBody(), true);

            ///Log::info("Get Product Details with Variants", ['data' => $responseBody]);
         

            if (isset($responseBody['data']['products'])) {
                return [
                    'status' => true,
                    'product' => $responseBody['data']['products']
                ];
            } else {
                return [
                    'status' => false,
                    'errors' => $responseBody['errors']
                ];
            }

        }catch (Exception $e) {
            // Log the message locally OR use a tool like Bugsnag/Flare to log the error
            
            Log::info("Errors", ['error' => $e->getMessage()]);
            // Either form a friendlier message to display to the user OR redirect them to a failure page
        }







        // $shop = "verywhiskey.myshopify.com";
        // $url = "https://{$shop}/search/suggest.json?q=" . urlencode($query) . "&resources[type]=" . $resourceType . "&resources[options][fields]=author,product_type,tag,title,variants.barcode,variants.sku,variants.title,vendor";

        // $ch = curl_init();
        // Log::info("Predictive Search", ['data' => $url]);
        // // Set cURL options
        // curl_setopt($ch, CURLOPT_URL, $url);  // Set the URL
        // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  // Return the response as a string
        // curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);  // Follow redirects if necessary
        // curl_setopt($ch, CURLOPT_HTTPGET, true);  // Set request to GET
        // $response = curl_exec($ch);

        // // Check for cURL errors
        // if (curl_errno($ch)) {
        //     echo 'cURL error: ' . curl_error($ch);
        // } else {
        //     // Decode the JSON response
        //     $data = json_decode($response, true);

        //     // Output the result
        //     return $data['resources']['results']['products'];
        // }

        // // Close the cURL session
        // curl_close($ch);
        // // dd($url);
        // // $response = Http::get($url);

        // // if ($response->successful()) {
        // //     $data =  $response->json();
        // //     return $data['resources']['results']['products'];
        // //     // $results = $data['resources']['results'] ?? null;
        // //     // $finalResults = [];
        // //     // foreach (['products', 'pages', 'articles', 'collections'] as $resourceType) {
        // //     //     if (isset($results[$resourceType]) && !empty($results[$resourceType])) {
        // //     //         foreach ($results[$resourceType] as $resource) {
        // //     //             if (!empty($resource['title']) && !empty($resource['url'])) {
        // //     //                 $finalResults[] = [
        // //     //                     'type' => $resourceType,
        // //     //                     'title' => $resource['title'],
        // //     //                     'url' => $resource['url'],
        // //     //                     'image' => $resource['image'] ?? null,
        // //     //                     'description' => $resources_type === "page"? null : $resource['body'] ?? null
        // //     //                 ];
        // //     //             }
        // //     //         }
        // //     //     }
        // //     // }

        // //     // Return the final results as a JSON response
        // //     // return response()->json($results);


        // //     // return response()->json(
        // //     //     $response->json()
        // //     // );

        // // } else {
        // //     return response()->json(['error' => 'Failed to fetch search results'], $response->status());
        // // }
    }
}
