@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Manga Management</div>

                <div class="card-body">
                    @if (session('status'))
                    <div class="alert alert-success" role="alert">
                        {{ session('status') }}
                    </div>
                    @endif

                    <div class="row mt-2">
                        <div class="col-md-12">
                            <a href="{{ route('posts.create') }}" class="btn btn-primary my-3">Add new Manga</a>
                        </div>
                    </div>

                    @if ($message = Session::get('success'))
                    <div class="alert alert-success">
                        {{ $message }}
                    </div>
                    @endif

                    <table class="table table-bordered">
                        <tr align="center">
                            <th width="50px">No.</th>
                            <th width="70px">Img</th>
                            <th width="120px">Name</th>
                            <th>Description</th>
                            <th width="220px">Action</th>
                        </tr>

                        @foreach ($data as $key => $value)
                        <tr align="center">
                            <td>{{ ++$i }}</td>
                            <td><img src="/manga_profile_image/{{ $value->img }}" class="rounded mx-auto d-block" width="100px" height="100px" alt="Image"></td>
                            <td>{{ $value->name }}</td>
                            <td>{{ Str::limit($value->description, 50) }}</td>
                            <td>
                                <form action="{{ route('posts.destroy', $value->id) }}" method="post">
                                    <a href="{{ route('posts.show', $value->id) }}" class="btn btn-primary">Show</a>
                                    <a href="{{ route('posts.edit', $value->id) }}" class="btn btn-secondary">Edit</a>
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-danger">Delete</button>
                                </form>
                            </td>
                        </tr>

                        @endforeach

                    </table>

                    {{ $data->links() }}
                </div>
            </div>
        </div>
    </div>
</div>
@endsection