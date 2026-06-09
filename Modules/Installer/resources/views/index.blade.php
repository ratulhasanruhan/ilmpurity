@extends('installer::layouts.master')

@section('content')
    <h1>Hello World</h1>

    <p>Module: {!! config('installer.name') !!}</p>
@endsection
