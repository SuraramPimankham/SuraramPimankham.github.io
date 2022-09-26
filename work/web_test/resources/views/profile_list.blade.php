@extends('layouts.app')
<script src="http://code.jquery.com/jquery-1.10.2.js"></script>

<script src="http://code.jquery.com/ui/1.11.2/jquery-ui.js"></script>

<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
@section('content')
<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First Name</th>
      <th scope="col">Last Name</th>
      <th scope="col">Email</th>
      <th scope="col">Mobile</th>
      <th scope="col">Setting</th>
    </tr>
  </thead>
  <tbody>
    <?php $i = 0 ?><!--ตัวเลขลำดับ-->
    @foreach($profile as $pf)<!--การสร้างลุบโดยรับตัวแปร profile มาจาก return ProfileController.php function getProfile-->
    <?php $i = $i+1 ?>
    <tr>
      <th scope="row">{{$i}}</th>
      <td>{{$pf->first_name}}</td>
      <td>{{$pf->last_name}}</td>
      <td>{{$pf->email}}</td>
      <td>{{$pf->phone}}</td>
      <td><button class="btn btn-primary" onclick='getEdit("<?php echo $pf->id ?>")'>Edit</button>
      <button class="btn btn-danger" onclick='delProfile("<?php echo $pf->id ?>")'>Delete</button></td>
    </tr>
    @endforeach

  </tbody>
</table>
<a href="formProfile">Create</a>
@endsection


<script>
    function delProfile(id,first_name){
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.post('delProfile', {id:id}, function(response){
                    Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                ).then((result)=>{
                    location.reload();
                })
            });
        }
    })
}
    function getEdit(id){
        location.href = "edit_"+id
    }
</script>