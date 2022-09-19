<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\models\Profile;

class ProfileController extends Controller
{
    public function saveprofile(Request $req){
        $profile = new profile;
        $profile->first_name = $req->first_name;
        $profile->last_name = $req->last_name;
        $profile->email = $req->email;
        $profile->phone = $req->phone;
        $profile->save();

        return view('postprofile');
    }
}
