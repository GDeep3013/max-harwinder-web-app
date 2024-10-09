@extends('layouts.app')

@section('content')
<div class="startOuter login-outer-page">
    <div class="loginOuter">


        <!-- Nested Row within Card Body -->
        <div class="row">
            <div class="col-lg-6 d-lg-block bg-login-image">
                <div class="form-img">
                    <div class="form-logo">
                        <a href="javascript:;"> <img src="/assets/img/logo.png" alt="logo"> </a>
                    </div>

                    <!-- <div class="verticalCenter">
                    <div class="fortruck">
                        <img src="/assets/img/form-truck.png" alt="form-truck">
                    </div>
                </div> -->
                </div>

            </div>
            <div class="col-lg-6">
                <div class="verticalCenter">
                    <div class="p-5 textCenter">
                        <form method="POST" action="{{ route('password.update') }}">
                            @csrf
                            <input type="hidden" name="token" value="{{ $token }}">
                            <h4>
                                {{ __('Reset Password') }}
                            </h4>
                            <p>Sign into your pages account</p>
                            <div class="form-group">
                                <label for="">{{ __('Email Address') }}</label>
                                <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ $email ?? old('email') }}" required autocomplete="email" autofocus>

                                @error('email')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                            </div>

                            <div class="form-group">
                                <label for="">{{ __('Password') }}</label>
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">

                                @error('password')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                            </div>
                            <div class="form-group">
                                <label for="">{{ __('Confirm Password') }}</label>
                                <input id="password-confirm" type="password" class="form-control" name="password_confirmation" required autocomplete="new-password">
                            </div>
                            <div class="start_btn login">
                                <button type="submit" class="custom_btn">
                                    {{ __('Reset Password') }}
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
@endsection
