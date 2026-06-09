<?php
$payment_methods = [
    [
        'name' => 'Stripe',
        'sub_type' => 'stripe',
        'method' => 'POST',
        'route' => '/payments/stripe/payment',
        'logo' => asset('assets/payment/stripe.png'),
    ],
    [
        'name' => 'Paypal',
        'sub_type' => 'paypal',
        'method' => 'POST',
        'route' => '/payments/paypal/payment',
        'logo' => asset('assets/payment/paypal.png'),
    ],
    [
        'name' => 'Razorpay',
        'sub_type' => 'razorpay',
        'method' => 'POST',
        'route' => '/payments/razorpay/redirect',
        'logo' => asset('assets/payment/razorpay.png'),
    ],
    [
        'name' => 'Mollie',
        'sub_type' => 'mollie',
        'method' => 'POST',
        'route' => '/payments/mollie/payment',
        'logo' => asset('assets/payment/mollie.png'),
    ],
    [
        'name' => 'Paystack',
        'sub_type' => 'paystack',
        'method' => 'GET',
        'route' => '/payments/paystack/redirect',
        'logo' => asset('assets/payment/paystack.png'),
    ],
    [
        'name' => 'SSLCommerz',
        'sub_type' => 'sslcommerz',
        'method' => 'POST',
        'route' => '/payments/sslcommerz/payment',
        'logo' => asset('assets/payment/sslcommerz.png'),
    ],
];

foreach ($payments as $method) {
    foreach ($payment_methods as $item) {
        if ($item['sub_type'] == $method->sub_type) {
            $method['name'] = $item['name'];
            $method['route'] = $item['route'];
            $method['method'] = $item['method'];
            $method['logo'] = $item['logo'];
            break;
        }
    }
}
?>

<h6 class="mb-6 text-xl font-medium text-gray-600">
   {{ __('Available Payment methods') }}
</h6>

<div class="space-y-4">
   @foreach ($payments as $item)
      @if ($item->fields['active'])
         <div
            id="{{ $item['sub_type'] }}"
            data-info="{{ json_encode($item) }}"
            class="method payment_method cursor-pointer rounded-lg p-6 outline-1 hover:outline-2 hover:outline-blue-500 h-14"
         >
            <div class="flex h-full items-center justify-between">
               <p class="text-lg font-medium">{{ $item['name'] }}</p>
               <img
                  src="{{ $item['logo'] }}"
                  width="{{ 
                    $item['name'] == 'Paystack' || 
                    $item['name'] == 'SSLCommerz' || 
                    $item['name'] == 'Razorpay' ? '100' : '80' 
                  }}"
                  alt="{{ $item['name'] }}"
               />
            </div>
         </div>
      @endif
   @endforeach

</div>
