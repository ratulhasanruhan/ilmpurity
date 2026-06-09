<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="UTF-8">
   <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
   >
   <title>Razorpay Payment</title>
   <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="flex min-h-screen items-center justify-center bg-gray-100">
   <div class="w-full max-w-[400px] overflow-hidden rounded-lg bg-white shadow-lg">
      <!-- Information List Section -->
      <div class="p-6">
         <h2 class="mb-4 text-lg font-bold text-gray-900">Payment Details</h2>

         <div class="space-y-3">
            <div class="flex items-center justify-between border-b border-gray-200 py-2">
               <span class="text-sm text-gray-600">Amount</span>
               <span class="text-sm font-medium text-gray-900">₹{{ $amount }}</span>
            </div>

            <div class="flex items-center justify-between border-b border-gray-200 py-2">
               <span class="text-sm text-gray-600">Customer Name</span>
               <span class="text-sm font-medium text-gray-900">{{ $user->name }}</span>
            </div>

            <div class="flex items-center justify-between py-2">
               <span class="text-sm text-gray-600">Customer Email</span>
               <span class="text-sm font-medium text-gray-900">{{ $user->email }}</span>
            </div>
         </div>
      </div>

      <!-- Payment Button Section -->
      <div class="p-6 pt-0">
         <form
            action="{{ route('razorpay.payment') }}"
            method="POST"
         >
            @csrf

            <script
               src="https://checkout.razorpay.com/v1/checkout.js"
               data-key="{{ $key }}"
               data-buttontext="Pay With Razorpay"
               data-amount="{{ round($amount * 100, 2) }}"
               data-currency="{{ $currency }}"
               data-name="online-course-payment"
               data-description="{{ $description }}"
               data-prefill.name="{{ $user->name }}"
               data-prefill.email="{{ $user->email }}"
               data-theme.color="#3b82f6"
            ></script>
         </form>
      </div>
   </div>

   <style>
      /* Style Razorpay button to match checkout button */
      .razorpay-payment-button {
         width: 100% !important;
         border-radius: 0.5rem !important;
         background-color: oklch(62.3% 0.214 259.815) !important;
         padding: 0.75rem !important;
         color: white !important;
         border: none !important;
         cursor: pointer !important;
         font-size: 1rem !important;
         font-weight: 500 !important;
         transition: background-color 0.2s ease !important;
      }

      .razorpay-payment-button:hover {
         background-color: oklch(54.6% 0.245 262.881) !important;
      }
   </style>
</body>

</html>
