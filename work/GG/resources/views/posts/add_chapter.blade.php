@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Add Chapter</div>

                <div class="card-body">
                    @if (session('status'))
                    <div class="alert alert-success" role="alert">
                        {{ session('status') }}
                    </div>
                    @endif

                    <div class="row mt-2">  
                        <div class="col-md-12">
                            <a href="{{ url()->previous() }}" class="btn btn-primary my-3">Back</a>
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

                    <form action="{{ route('mangas.store') }}" method="post" enctype="multipart/form-data">
                        @csrf

                        <div class="row">

                            <div class="col-md-12">
                                <div class="form-group mb-3">
                                    <strong>Image:</strong>
                                    <input type="file" name="img[]" class="form-control" multiple placeholder="Enter Image">
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="form-group">
                                    <strong>Chapter:</strong>
                                    <input type="text" name="chapter" class="form-control" placeholder="Enter Chapter">
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="form-group">
                                    <strong>Manga:</strong>
                                    <input type="text" name="manga" class="form-control" placeholder="Enter Manga">
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