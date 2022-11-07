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

                    <div class="row mt-2">
                        <div class="col-md-12">
                            <h2>Edit Post</h2>
                            <a href="{{ route('posts.index') }}" class="btn btn-primary my-3">Back</a>
                        </div>
                    </div>

                    @if ($errors->any())
                    <div class="alert alert-danger">
                        <strong>Whoops!</strong>
                        There were some problems with your input. <br><br>
                        <ul>
                            @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                    @endif

                    <form action="{{ route('posts.update', $post->id) }}" method="post" enctype="multipart/form-data">
                        @csrf
                        @method('PUT')

                        <div class="row">

                            <div class="form-group mb-3">
                                <label for="">Image:</label>
                                <input type="file" name="img" class="form-control" placeholder="Enter Image">
                                <img src="/manga_profile_image/{{ $post->img }}" width="70px" height="70px" alt="Image">
                            </div>
                            <div class="form-group mb-3">
                                <label for="">Name:</label>
                                <input type="text" name="name" value="{{$post->name}}" class="form-control">
                            </div>
                            <div class="form-group mb-3">
                                <label for="">Description:</label>
                                <textarea class="form-control" style="height:150px" name="description">{{ $post->description }}"</textarea>
                            </div>

                            <div class="col-md-12">
                                <button type="submit" class="btn btn-success my-3">Update</button>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </div>
</div>


@endsection