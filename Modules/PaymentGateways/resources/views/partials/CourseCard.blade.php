@php
   $isFree = ($item->pricing_type ?? null) === 'free';
   $hasDiscount = !empty($item->discount);
@endphp

<div class="border-border bg-background space-y-6 rounded-xl border p-6 shadow-sm">
   <div class="flex flex-col gap-4 md:flex-row">
      <div class="bg-muted relative h-48 w-full overflow-hidden rounded-lg md:h-40 md:w-56">
         <img
            alt="{{ $item->title }}"
            src="{{ $item->thumbnail ?? asset('assets/images/blank-image.jpg') }}"
            class="h-full w-full object-cover"
         >
      </div>

      <div class="flex-1">
         <h3 class="mb-2 text-xl font-semibold">{{ $item->title }}</h3>
         <p class="text-muted-foreground mb-4 line-clamp-3">
            {{ $item->short_description }}
         </p>
      </div>
   </div>

   @unless ($isFree)
      <div class="border-border bg-muted/50 space-y-3 rounded-lg border border-dashed p-4">
         <div class="flex items-center justify-between text-sm font-medium">
            <span>Course Price</span>
            <span class="text-base">
               @if ($hasDiscount)
                  <span class="text-muted-foreground line-through">
                     {{ $currency }} {{ $item->price }}
                  </span>
               @else
                  <span class="font-semibold">
                     {{ $currency }} {{ $item->price }}
                  </span>
               @endif
            </span>
         </div>

         @if ($hasDiscount)
            <div class="flex items-center justify-between text-sm font-medium">
               <span>Discounted Price</span>
               <span class="text-primary text-base font-semibold">
                  {{ $currency }} {{ $item->discount_price }}
               </span>
            </div>
         @endif

         @if ($coupon)
            <div class="flex items-center justify-between text-sm font-medium text-emerald-600">
               <span>Coupon Discount ({{ strtoupper($coupon->code) }})</span>
               <span>-{{ $currency }} {{ $couponDiscount }}</span>
            </div>
         @endif

         <div class="flex items-center justify-between text-base font-semibold">
            <span>Total Payment</span>
            <span>{{ $currency }} {{ $discountedPrice }}</span>
         </div>
      </div>
   @else
      <div class="rounded-lg border border-dashed border-emerald-500 bg-emerald-50 p-4 text-emerald-700">
         <p class="text-sm font-semibold uppercase tracking-wide">Free Course</p>
         <p class="text-2xl font-bold">Enjoy the course for free!</p>
      </div>
   @endunless

   @unless ($isFree)
      <div class="space-y-3">
         <p class="text-muted-foreground text-sm font-medium uppercase tracking-wide">
            Apply Coupon
         </p>

         @if ($coupon)
            <div
               class="flex items-center justify-between rounded-lg border border-emerald-500 bg-emerald-50 px-4 py-3 text-sm"
            >
               <div>
                  <p class="font-medium text-emerald-700">Coupon Applied</p>
                  <p class="text-lg font-semibold uppercase text-emerald-700">{{ $coupon->code }}</p>
               </div>
               <a
                  href="{{ route('payments.index', ['from' => 'web', 'item' => $item_type, 'id' => $item->id]) }}"
                  class="text-primary text-sm font-semibold underline underline-offset-4"
               >
                  Remove
               </a>
            </div>
         @else
            <form
               method="GET"
               action="{{ route('payments.index', ['from' => 'web', 'item' => $item_type, 'id' => $item->id]) }}"
               class="flex flex-col gap-3 sm:flex-row"
            >
               <div class="relative flex-1">
                  <input
                     id="coupon"
                     type="text"
                     name="coupon"
                     class="border-border bg-background focus:border-primary focus:ring-primary/40 h-10 w-full rounded-md border px-4 py-3 text-base focus:outline-none focus:ring-2"
                     placeholder="Enter coupon code"
                     value="{{ old('coupon') }}"
                  >
               </div>

               <button
                  type="submit"
                  class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md px-6 text-sm font-semibold uppercase tracking-wide transition"
               >
                  Apply
               </button>
            </form>

            {{-- Display Available Coupons --}}
            @if (isset($itemCoupons) && !empty($itemCoupons) && count($itemCoupons) > 0)
               <div class="mt-4 space-y-2">
                  <p class="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                     Available Coupons for this {{ ucfirst($item_type) }}
                  </p>
                  <div class="space-y-2">
                     @foreach ($itemCoupons as $availableCoupon)
                        <div
                           class="border-border bg-muted/30 hover:bg-muted/50 flex items-center justify-between rounded-lg border px-4 py-3 transition"
                        >
                           <div class="flex-1">
                              <div class="flex items-center gap-2">
                                 <span class="bg-primary/10 text-primary rounded px-2 py-1 text-sm font-bold uppercase">
                                    {{ $availableCoupon->code }}
                                 </span>
                                 <span class="text-xs font-semibold text-emerald-600">
                                    @if ($availableCoupon->discount_type === 'percentage')
                                       {{ $availableCoupon->discount }}% OFF
                                    @else
                                       {{ $currency }} {{ number_format($availableCoupon->discount, 2) }} OFF
                                    @endif
                                 </span>
                              </div>
                              @if ($availableCoupon->valid_to)
                                 <p class="text-muted-foreground mt-1 text-xs">
                                    Valid until {{ \Carbon\Carbon::parse($availableCoupon->valid_to)->format('M d, Y') }}
                                 </p>
                              @endif
                           </div>
                           <button
                              type="button"
                              onclick="applyCouponCode('{{ $availableCoupon->code }}')"
                              class="bg-primary text-primary-foreground hover:bg-primary/90 ml-3 rounded-md px-4 py-2 text-xs font-semibold uppercase transition"
                           >
                              Apply
                           </button>
                        </div>
                     @endforeach
                  </div>
               </div>
            @endif
         @endif
      </div>
   @endunless
</div>
