@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Manga') }}</div>

                <div class="card-body">
                    @if (session('status'))
                    <div class="alert alert-success" role="alert">
                        {{ session('status') }}
                    </div>
                    @endif

                    @if ($message = Session::get('success'))
                    <div class="alert alert-success">
                        {{ $message }}
                    </div>
                    @endif

                    @foreach ($data as $value)
                    <div class="card-group">
                        <div class="card">
                            <img src="/manga_profile_image/{{ $value->img }}" class="rounded mx-auto d-block" width="100px" height="100px" alt="Image">
                            <div class="card-body">
                                <h5 align="center" class="card-title">{{ $value->name }}</h5>
                            </div>
                        </div>
                    </div>
                    @endforeach


                    {{ $data->links() }}

                </div>
            </div>
        </div>
    </div>
</div>
@endsection