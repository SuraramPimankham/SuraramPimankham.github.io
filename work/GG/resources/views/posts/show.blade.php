@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Manga Detail</div>

                <div class="card-body">
                    @if (session('status'))
                    <div class="alert alert-success" role="alert">
                        {{ session('status') }}
                    </div>
                    @endif

                    <div class="row mt-2">
                        <div class="col-md-12">
                            <a href="{{ route('adminhome') }}" class="btn btn-primary my-3">Back</a>
                        </div>
                    </div>

                    <img src="/manga_profile_image/{{ $post->img }}" class="rounded mx-auto d-block" width="450" height="600">

                    <div class="card">
                        <div class="card-body">

                            <strong>Name:</strong>
                            {{ $post->name }}
                            <br>
                            <strong>Description:</strong>
                            {{ $post->description }}

                        </div>
                    </div>

                    <div class="row mt-2">
                        <div class="col-md-12">
                            <a href="{{ route('mangas.create',$post->id) }}" class="btn btn-dark ">Add Chapter</a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>

@endsection