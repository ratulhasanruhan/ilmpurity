<?php
$payout_methods = [
    [
        'name' => 'Stripe',
        'sub_type' => 'stripe',
        'method' => 'POST',
        'route' => '/payouts/stripe/payment',
        'logo' => asset('assets/payment/stripe.png'),
    ],
    [
        'name' => 'Paypal',
        'sub_type' => 'paypal',
        'method' => 'POST',
        'route' => '/payouts/paypal/payment',
        'logo' => asset('assets/payment/paypal.png'),
    ],
    [
        'name' => 'Razorpay',
        'sub_type' => 'razorpay',
        'method' => 'GET',
        'route' => '/payouts/razorpay/form',
        'logo' => asset('assets/payment/razorpay.png'),
    ],
    [
        'name' => 'Mollie',
        'sub_type' => 'mollie',
        'method' => 'POST',
        'route' => '/payouts/mollie/payment',
        'logo' => asset('assets/payment/mollie.png'),
    ],
    [
        'name' => 'Paystack',
        'sub_type' => 'paystack',
        'method' => 'GET',
        'route' => '/payouts/paystack/redirect',
        'logo' => asset('assets/payment/paystack.png'),
    ],
];

foreach ($payoutMethods as &$method) {
    // Added & before $method
    foreach ($payout_methods as $item) {
        if ($item['sub_type'] == $method['sub_type']) {
            $method['name'] = $item['name'];
            $method['route'] = $item['route'];
            $method['method'] = $item['method'];
            $method['logo'] = $item['logo'];
            break;
        }
    }
}
unset($method); // Good practice to unset the reference after the loop
?>

<h6 class="mb-6 text-xl font-medium text-gray-600">
   {{ __('Available Payout methods') }}
</h6>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
   @foreach ($payoutMethods as $item)
      @if ($item['fields']['active'])
         <div
            id="{{ $item['sub_type'] }}"
            data-info="{{ json_encode($item) }}"
            class="method payout_method cursor-pointer rounded-lg p-6 outline-1 hover:outline-2 hover:outline-blue-500"
         >
            <div class="flex h-full items-center justify-between">
               <p class="text-lg font-medium">{{ $item['name'] }}</p>
               <img
                  src="{{ $item['logo'] }}"
                  width="{{ $item['name'] == 'Paystack' ? '132' : '100' }}"
                  alt="{{ $item['name'] }}"
               >
            </div>
         </div>
      @endif
   @endforeach
</div>
