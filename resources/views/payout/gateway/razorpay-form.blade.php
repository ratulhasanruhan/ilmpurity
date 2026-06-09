<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="UTF-8">
   <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
   >
   <meta
      http-equiv="X-UA-Compatible"
      content="ie=edge"
   >
   <title>Razorpay payment</title>

   <link
      rel="stylesheet"
      href="{{ asset('style/custom.css') }}"
   >
</head>

@php
   function convertINRtoUSD($inr_amount)
   {
       $usd_rate = 0.013; // exchange rate as of 2021-09-01, 1 INR = 0.013 USD
       $usd_amount = $inr_amount * $usd_rate;
       return round($usd_amount, 2); // round to 2 decimal places
   }
   function convertUSDtoINR($usd_amount)
   {
       $inr_rate = 74.21; // exchange rate as of 2021-09-01, 1 USD = 74.21 INR
       $inr_amount = $usd_amount * $inr_rate;
       return round($inr_amount, 2); // round to 2 decimal places
   }
@endphp

<body class="razorpay">
   <div class="razorpay-form">
      <h1> {{ $price }}{{ __(' RUPEE') }}</h1>
      <form
         method="POST"
         action="{{ route('payments.razorpay.payment', ['plan_id' => $plan->id, 'billing_type' => $billing_type]) }}"
      >
         @csrf

         <script
            src="https://checkout.razorpay.com/v1/checkout.js"
            data-key="{{ $razorpay->key }}"
            data-amount="{{ $price * 100 }}"
            data-buttontext="Pay With Razorpay"
            data-name="test payment"
            data-description="Payment User"
            data-prefill.name="user"
            data-prefill.email="user@gmail.com"
            data-theme.color="#ff7529"
         ></script>
      </form>
   </div>
</body>

</html>
