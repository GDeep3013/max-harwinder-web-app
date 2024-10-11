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
                <div class="col-lg-12">
                    <div class="verticalCenter">
                        <div class="p-3 p-md-5 textCenter vertical-login">
                            <form method="POST" action="{{ route('login') }}">
                                @csrf
                                <h4>
                                    Login
                                </h4>
                               
                                <div class="form-group">
                                    <label for="">Email</label>
                                    <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>

                                    @error('email')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                    @enderror


                                </div>

                                <div class="form-group">
                                    <label for="">Password</label>
                                    @if (Route::has('password.request'))
                                    <div class="forgot-pass">

                                        <a class="btn btn-link" href="{{ route('password.request') }}">
                                            {{ __('Forgot Your Password?') }}
                                        </a>
                                    </div>

                                    @endif
                                    <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">

                                    @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                    @enderror


                                </div>
                                <div class="start_btn login">
                                    <button type="submit" class="custom_btn">
                                        <!-- {{ __('Login') }} -->
                                        Sign In
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