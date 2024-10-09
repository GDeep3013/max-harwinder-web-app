<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Mail;
use App\Mail\CreatePassword;
use Auth;
use Illuminate\Support\Facades\Hash;
class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('users');
        if(Auth::check()) {
            $query = User::where('role', "!=", "Admin");
            $searchTerm = $request->search;
            if ($searchTerm !== "undefined") {
                $query->where(function ($query) use ($tableColumns, $searchTerm) {
                    foreach ($tableColumns as $column) {
                        $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                    }
                });
            }
            if (!empty($request->page)) {
                $requestData = $query->orderBy('id', 'DESC')->paginate(50);
                return response()->json(['status' => true, "users" => $requestData]);
            }
        } else {
            return response()->json(['status' => false, "message" => "User not logged in"]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'full_name' => 'required',
                'email' => 'required|email|max:255|unique:users,email',
            ]);

            // If validation is successful, proceed to store the data
            $user = new User;
            $user->name = $validatedData['full_name'] . " " . $request->last_name;
            $user->email = $validatedData['email'];
            $user->password = "";
            $user->role = 'Staff';
            $user->status = $request->status;
            if ($user->save()) {
                $mailData = [
                    'title' => 'Mail From Manage Product SKUs',
                    'body' => url('/create-password/' . encrypt($user->id)),
                    'name' => $user->name,
                    'email' => $user->email,
                    // 'logo_image' => base64_encode(file_get_contents(public_path('/assets/images/GOOD_DO_NOT_TOUCH_1.jpg')))
                ];
                Mail::to($user->email)->send(new CreatePassword($mailData));
                return response()->json(['status' => true, 'message' => 'The staff account created successfully.']);
            } else {
                return response()->json(['status' => false, 'message' => 'Faild to save staff']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => $e->validator->errors()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        if ($id) {
            $data = User::where('id', $id)->first();
            return response()->json(['status' => true, 'data' => $data]);
        } else {
            return response()->json(['status' => false, 'message' => 'User not found']);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $validatedData = $request->validate([
                'full_name' => 'required',
                'email' => 'required|email|max:255|unique:users,email,' . $id,
            ]);

            // If validation is successful, proceed to store the data
            $user = User::where('id', $id)->first();
            $user->name = $validatedData['full_name'] . " " . $request->last_name;
            $user->email = $validatedData['email'];
            $user->role = 'Staff';
            $user->status = $request->status;
            if ($user->save()) {
                // $mailData = [
                //     'title' => 'Mail From Manage Product SKUs',
                //     'body' => url('/create-password/' . encrypt($user->id)),
                //     'name' => $user->name,
                //     'email' => $user->email,
                //     // 'logo_image' => base64_encode(file_get_contents(public_path('/assets/images/GOOD_DO_NOT_TOUCH_1.jpg')))
                // ];
                // Mail::to($user->email)->send(new CreatePassword($mailData));
                return response()->json(['status' => true, 'message' => 'The staff account update successfully.']);
            } else {
                return response()->json(['status' => false, 'message' => 'Faild to update staff account']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => $e->validator->errors()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if(!empty($id)) {
            $user = User::find($id);
            if($user->delete()){
                return response()->json(['statue' => false, 'message' => "User delete successfully"]);
            } else {
                return response()->json(['statue' => false, 'message' => "Failed to delete"]);
            }
        } else {
            return response()->json(['statue' => false, 'message' => "User not found"]);
        }
    }

    public function getStaff($id)
    {
        $data['id'] = $id;
        return view('auth.passwords.createPassword', $data);
    }

    public function confirmPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
        if ($validator->fails()) {
            return redirect()
                ->back()
                ->withErrors($validator)
                ->withInput();
        }
        $id = decrypt($request->val);
        $user = User::where('id', $id)->first();
        $user->password = Hash::make($request->password);
        if ($user->save()) {
            return redirect('/login');
        }
    }
}
