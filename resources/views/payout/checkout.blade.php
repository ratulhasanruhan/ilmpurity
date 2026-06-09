<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
   <meta charset="utf-8">
   <meta
      name="viewport"
      content="width=device-width, initial-scale=1"
   >

   <!-- CSRF Token -->
   <meta
      name="csrf-token"
      content="{{ csrf_token() }}"
   >

   <title>{{ __('Payout Checkout') }}</title>

   {{-- vites --}}
   @routes
   @viteReactRefresh
   @vite(['resources/js/app.tsx'])
</head>

<body class="flex h-screen flex-col items-center justify-center">
   <div class="payment mx-auto w-full max-w-[1200px] p-6 md:p-7">
      <div class="grid grid-cols-12 items-start gap-7">
         <div class="shadow-card col-span-12 space-y-6 rounded-lg p-6 md:col-span-8">
            @include('payout.partials.PayoutMethod')

            @if (session('error'))
               <div class="rounded-lg border border-red-500 bg-red-50 p-4 text-red-500">
                  {{ session('error') }}
               </div>
            @endif
         </div>
         <div class="shadow-card col-span-12 overflow-hidden rounded-lg md:col-span-4">
            @include('payout.partials.OrderSummery')

            <form
               id="checkoutForm"
               class="p-6"
            >
               @csrf

               <input
                  type="hidden"
                  name="slug"
                  value="{{ $slug }}"
               >
               <input
                  type="hidden"
                  name="request_id"
                  value="{{ $request_id }}"
               >

               <button
                  id="checkout"
                  type="submit"
                  class="w-full rounded-lg bg-blue-500 p-3 text-white hover:bg-blue-600/95"
               >
                  {{ __('Checkout') }}
               </button>
            </form>
         </div>
      </div>
   </div>

   <script src="{{ asset('script/payout.js') }}"></script>
</body>

</html>
