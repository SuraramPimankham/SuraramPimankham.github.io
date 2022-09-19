@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Dashboard') }}</div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    {{ __('ยินดีต้อนรับเข้าสู่') }}
                    <br>
                    <button type="submit" onclick="document.location='form'" class="btn btn-primary"> 
                    proflie
                    </button>
                    <button type="submit" onclick="document.location='page'" class="btn btn-primary"> 
                    page
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
