<div class="order-summery">
   <div class="bg-card rounded-lg border shadow-sm">
      <div class="p-6">
         <h2 class="mb-4 text-lg font-semibold">{{ __('Payout Summery') }}</h2>

         <div class="space-y-4">
            <div class="space-y-2">
               <div class="space-y-1">
                  <div class="flex justify-between">
                     <span>{{ __('Requested Amount') }}:</span>
                     <span>{{ number_format($payout->amount, 2) }} $</span>
                  </div>
                  <div class="flex justify-between">
                     <span>{{ __('Status') }}:</span>
                     <span class="capitalize">{{ $payout->status }}</span>
                  </div>
                  <div class="flex justify-between">
                     <span>{{ __('Requested At') }}:</span>
                     <span>{{ $payout->created_at->format('M d, Y h:i A') }}</span>
                  </div>
                  @if ($payout->note)
                     <div class="flex justify-between">
                        <span>{{ __('Note') }}:</span>
                        <span class="text-right">{{ $payout->note }}</span>
                     </div>
                  @endif
               </div>
            </div>

            <div class="bg-border my-4 h-[1px] w-full"></div>

            <div class="summery-body">
               <div class="body-item mt-5 flex items-center justify-between font-semibold">
                  <p class="title">{{ __('Payout Method') }}</p>
                  <p id="payoutMethod">{{ $payout->payout_method ?? 'N/A' }}</p>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>
