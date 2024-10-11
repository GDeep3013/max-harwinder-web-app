@extends('layouts.app')

@section('content')
<div class="startOuter login-outer-page">
    <div class="loginOuter">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                <div class="dashboard-logo">
                        <img src="/assets/images/GOOD_DO_NOT_TOUCH_1.jpg" alt="Logo" />
                    </div>>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="verticalCenter">
                        <div class="p-5 textCenter">
                            <form method="POST" action="{{ route('password.email') }}">
                                @csrf
                                <h4>
                                    Forgot Your Password?
                                </h4>
                                <div class="form-group">
                                    <label for="">Your Email Id*</label>
                                    <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>

                                    @error('email')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                    @enderror
                                </div>
                                <div class="start_btn login">
                                    <button type="submit" class="custom_btn">
                                        {{ __('Send Password Reset Link') }}
                                    </button>

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