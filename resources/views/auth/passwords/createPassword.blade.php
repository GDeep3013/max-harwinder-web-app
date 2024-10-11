@extends('layouts.app')

@section('content')
<div class="startOuter login-outer-page">
    <div class="loginOuter">

        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <div class="dashboard-logo">
                        <img src="/assets/images/GOOD_DO_NOT_TOUCH_1.jpg" alt="Logo" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="verticalCenter">
                        <div class="p-5 textCenter">
                            <form method="POST" action="{{ route('create.password') }}">
                                @csrf
                                <h4>
                                    Create Password
                                </h4>
                                <p>{{ __('Please confirm your password before continuing.') }}</p>
                                <div class="form-group">
                                    <input type="hidden" name="val" value="{{$id}}">
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
                                        Create Password
                                    </button>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Nested Row within Card Body -->


    </div>

</div>
@endsection