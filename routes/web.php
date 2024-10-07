<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('auth.login');
});

Route::get('/logout', function () {
    Auth::logout();
    return redirect('/login');
});

Route::get('/create-password/{id}', [UserController::class ,'getStaff']);
Route::post('/create-password', [UserController::class ,'confirmPassword'])->name('create.password');
// Auth::routes();
Auth::routes(['register' => false]);
Route::middleware(['auth'])->group(function () {
    Route::get('/pages/', [HomeController::class, 'index']);
    Route::resource('staff', UserController::class);
    Route::get('/product', [ProductController::class, 'getShopifyProducts']);
    Route::get('/pages/{page}', [HomeController::class, 'index']);
    Route::get('/pages/{page}/{id}', [HomeController::class, 'index']);
});
// Route::group(['middleware' => ['auth']], function () {
//     Route::get('/login', [UserController::class, 'store']);
// });


// Route::get('/', function (Request $request) {
//     $host = $request->query('host');
//     return view('react', [
//             'shop' => $request->query('shop'),
//             'host' => $host,
//             'appUrl' =>env('APP_URL'),
//             'apiKey' => env('SHOPIFY_API_KEY')
//         ]);
// })->middleware(['verify.shopify'])->name('home');
// Route::get('/pages/{danny}', function (Request $request) {
//     $host = $request->query('host');
//     $api_key = $request->query('api_key');
//     return view('react', [
//             'shop' => $request->query('shop'),
//             'host' => $host,
//             'appUrl' =>env('APP_URL'),
//             'apiKey' => env('SHOPIFY_API_KEY')
//         ]);
// });
// Route::get('/get-orders', [OrdersController::class, 'index']);
// Route::post('/upload-orders', [OrdersController::class, 'UploadOrderThroughAPI']);
// Route::get('/get-product', [ProductController::class, 'getProductThroughAPI']);
// Route::get('/product', [ProductController::class, 'index']);
// Route::post('/product-sync', [ProductController::class, 'store']);
// Route::get('/brands', [ProductController::class, 'getProductBrands']);
// Route::get('/inventory', [ProductController::class, 'despatchProductDetails']);




