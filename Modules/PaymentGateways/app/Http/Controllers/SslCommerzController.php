<?php

namespace Modules\PaymentGateways\Http\Controllers;

use App\Models\User;
use App\Models\TempStore;
use Illuminate\Http\Request;
use App\Services\SettingsService;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Modules\PaymentGateways\Services\PaymentService;
use Modules\PaymentGateways\Services\SslCommerz\SslCommerzNotification;

class SslCommerzController extends Controller
{
    private $sslcommerz;

    public function __construct(
        private PaymentService $payment,
        private SettingsService $settingsService,
    ) {
        $this->sslcommerz = $this->settingsService->getSetting(['type' => 'payment', 'sub_type' => 'sslcommerz']);
    }

    public function exampleEasyCheckout()
    {
        return view('sslcommerz::exampleEasycheckout');
    }

    public function exampleHostedCheckout(Request $request)
    {
        return view('sslcommerz::exampleHosted', [
            'slug' => $request->from,
            'coupon' => $request->coupon
        ]);
    }

    // SSLCommerz payment
    public function index(Request $request)
    {
        $request->validate(['phone' => 'required']);

        $user = Auth::user();
        $checkoutItem = $this->payment->getCheckoutItem(
            $request->item_type,
            $request->item_id,
            $request->coupon
        );

        // Get item details for product name and category
        $item = $checkoutItem['item'];
        $productName = $item->title ?? 'Course Purchase';
        $productCategory = 'Online Course';

        // If item has category, use it (support both course and exam)
        if (isset($item->course_category) && $item->course_category) {
            $productCategory = $item->course_category->title ?? 'Online Course';
        } elseif (isset($item->exam_category) && $item->exam_category) {
            $productCategory = $item->exam_category->title ?? 'Online Course';
        }

        $post_data = array();
        $post_data['total_amount'] = round($checkoutItem['finalPrice'], 2); # You cant not pay less than 10
        $post_data['currency'] = $this->sslcommerz->fields['currency']; # "BDT"
        $post_data['tran_id'] = uniqid(); // tran_id must be unique

        # CUSTOMER INFORMATION
        $post_data['cus_name'] = $user->name;
        $post_data['cus_email'] = $user->email;
        $post_data['cus_phone'] = $request->phone;

        $post_data['shipping_method'] = "NO";
        $post_data['product_name'] = $productName;
        $post_data['product_category'] = $productCategory;
        $post_data['product_profile'] = "online-course";

        $sslc = new SslCommerzNotification();
        # initiate(Transaction Data , false: Redirect to SSLCOMMERZ gateway/ true: Show all the Payement gateway here )
        setTempStore([
            'key' => $post_data['tran_id'],
            'user_id' => $user->id,
            'properties' => [
                'from' => $request->from,
                'item_type' => $request->item_type,
                'item_id' => $request->item_id,
                'tax_amount' => $checkoutItem['taxAmount'],
                'coupon_code' => $checkoutItem['coupon'] ? $checkoutItem['coupon']->code : null,
            ]
        ]);

        $payment_options = $sslc->makePayment($post_data, 'hosted');

        if (!is_array($payment_options)) {
            print_r($payment_options);
            $payment_options = array();
        }
    }

    // SSLCommerz payment success
    public function success(Request $request)
    {
        $tran_id = $request->input('tran_id');
        $amount = $request->input('amount');
        $currency = $request->input('currency');

        $sslc = new SslCommerzNotification();
        $validation = $sslc->orderValidate($request->all(), $tran_id, $amount, $currency);
        $temp = TempStore::where('key', $tran_id)->first();

        if (!$temp) {
            return redirect()
                ->route('payments.index')
                ->with('error', 'Transaction data not found.');
        }

        $user_id = $temp->user_id;
        $from = $temp->properties['from'];
        $item_type = $temp->properties['item_type'];
        $item_id = $temp->properties['item_id'];
        $tax_amount = $temp->properties['tax_amount'];
        $coupon_code = $temp->properties['coupon_code'];

        if ($validation) {
            // Login user before processing payment
            Auth::login(User::find($user_id));

            $this->payment->coursesBuy(
                'sslcommerz',
                $item_type,
                $item_id,
                $tran_id,
                $tax_amount,
                $amount,
                $coupon_code
            );

            $temp->delete();

            if ($from == 'api') {
                return redirect()->to(env('FRONTEND_URL') . '/student');
            } else {
                return redirect()
                    ->route('student.index', ['tab' => 'courses'])
                    ->with('success', 'Congratulation! Your payment have completed');
            }
        } else {
            return redirect()
                ->route('payments.index', ['from' => $from, 'item' => $item_type, 'id' => $item_id])
                ->with('error', 'Transaction was failed.');
        }
    }

    // SSLCommerz payment fail
    public function fail(Request $request)
    {
        $tran_id = $request->input('tran_id');

        $temp = TempStore::where('key', $tran_id)->first();
        if ($temp) {
            Auth::login(User::find($temp->user_id));

            $from = $temp->properties['from'] ?? 'web';
            $item_type = $temp->properties['item_type'] ?? 'course';
            $item_id = $temp->properties['item_id'] ?? null;

            $temp->delete();

            if ($item_id) {
                return redirect()
                    ->route('payments.index', ['from' => $from, 'item' => $item_type, 'id' => $item_id])
                    ->with('error', 'Payment failed. Please try again or contact support if the problem persists.');
            }
        }

        return redirect()
            ->route('payments.index')
            ->with('error', 'Payment failed. Please try again or contact support if the problem persists.');
    }

    // SSLCommerz payment cancel
    public function cancel(Request $request)
    {
        $tran_id = $request->input('tran_id');

        $temp = TempStore::where('key', $tran_id)->first();
        if ($temp) {
            Auth::login(User::find($temp->user_id));

            $from = $temp->properties['from'] ?? 'web';
            $item_type = $temp->properties['item_type'] ?? 'course';
            $item_id = $temp->properties['item_id'] ?? null;

            $temp->delete();

            if ($item_id) {
                return redirect()
                    ->route('payments.index', ['from' => $from, 'item' => $item_type, 'id' => $item_id])
                    ->with('error', 'Payment was cancelled. You can try again anytime.');
            }
        }

        return redirect()
            ->route('payments.index')
            ->with('error', 'Payment was cancelled. You can try again anytime.');
    }

    // SSLCommerz IPN (Instant Payment Notification)
    public function ipn(Request $request)
    {
        #Received all the payement information from the gateway
        if ($request->input('tran_id')) #Check transation id is posted or not.
        {
            $tran_id = $request->input('tran_id');

            $temp = TempStore::where('key', $tran_id)->first();
            if ($temp) {
                Auth::login(User::find($temp->user_id));

                $from = $temp->properties['from'] ?? 'web';
                $item_type = $temp->properties['item_type'] ?? 'course';
                $item_id = $temp->properties['item_id'] ?? null;

                $temp->delete();

                if ($item_id) {
                    return redirect()
                        ->route('payments.index', ['from' => $from, 'item' => $item_type, 'id' => $item_id])
                        ->with('error', 'Payment processing error. Please try again or contact support.');
                }
            }

            return redirect()
                ->route('payments.index')
                ->with('error', 'Payment processing error. Please try again or contact support.');
        } else {
            return redirect()
                ->route('payments.index')
                ->with('error', 'Invalid payment data received. Please try again.');
        }
    }
}
