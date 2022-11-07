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
                            <h2>Add new post</h2>
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

                    <form action="{{ route('posts.store') }}" method="post" enctype="multipart/form-data">
                        @csrf

                        <div class="row">

                            <div class="col-md-12">
                                <div class="form-group mb-3">
                                    <strong>Image:</strong>
                                    <input type="file" name="img" class="form-control" placeholder="Enter Image">
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="form-group">
                                    <strong>Name:</strong>
                                    <input type="text" name="name" class="form-control" placeholder="Enter Name">
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="form-group">
                                    <strong>Description:</strong>
                                    <textarea class="form-control" style="height:150px" name="description" placeholder="Enter description"></textarea>
                                </div>
                            </div>


                            <div class="col-md-12">
                                <button type="submit" class="btn btn-success my-3">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection