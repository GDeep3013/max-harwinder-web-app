@extends('layouts.app')

@section('content')
<div class="startOuter login-outer-page">
    <div class="loginOuter">


        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <!-- <div class="logo py-4">
                    <a href="javascript:;"> <img src="/assets/images/GOOD_DO_NOT_TOUCH_1.jpg" alt="logo"> </a>
                </div> -->
                    <div class="dashboard-logo">
                        <img src="/assets/images/GOOD_DO_NOT_TOUCH_1.jpg" alt="Logo" />
                    </div>
                </div>
            </div>
            <div class="row">
                >
                <div class="col-lg-12">
                    <div class="verticalCenter">
                        <div class="p-5 textCenter">
                            <form method="POST" action="{{ route('register') }}">
                                @csrf
                                <h4>
                                    {{ __('Register') }}
                                </h4>
                               
                                <div class="form-group">
                                    <label for="">Name</label>
                                    <input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="name" value="{{ old('name') }}" required autocomplete="name" autofocus>

                                    @error('name')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                    @enderror
                                </div>

                                <div class="form-group">
                                    <label for="">Email</label>
                                    <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email">

                                    @error('email')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                    @enderror
                                </div>

                                <div class="form-group">
                                    <label for="">Password</label>
                                    <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">

                                    @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                    @enderror
                                </div>

                                <div class="form-group">
                                    <label for="">Confirm Password</label>
                                    <input id="password-confirm" type="password" class="form-control" name="password_confirmation" required autocomplete="new-password">
                                </div>
                                <div class="start_btn login">
                                    <button type="submit" class="custom_btn">
                                        <!-- {{ __('Login') }} -->
                                        Sign Up
                                    </button>


                                    <!-- <h5>Don't have an account? <a href="#">Create Account</a> -->

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </div>

</div>
@endsection