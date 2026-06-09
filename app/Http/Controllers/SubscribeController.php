<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubscribeRequest;
use App\Models\Subscribe;

class SubscribeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Subscribe::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSubscribeRequest $request)
    {
        Subscribe::create($request->validated());

        return back()->with('success', 'Subscribed successfully');
    }
}
