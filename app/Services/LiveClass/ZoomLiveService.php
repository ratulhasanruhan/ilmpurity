<?php

namespace App\Services\LiveClass;

use App\Services\SettingsService;
use Illuminate\Support\Facades\Log;

class ZoomLiveService
{
    public $zoomConfig;

    public function __construct()
    {
        $settingsService = new SettingsService();

        $this->zoomConfig = $settingsService->getSetting(['type' => 'live_class'])['fields'];
    }

    public function createZoomLive($data)
    {
        $topic = $data['class_topic'];
        $token = $this->createZoomToken();
        $zoom_account_email = $this->zoomConfig['zoom_account_email'];

        // API Endpoint for creating a meeting
        $zoomEndpoint = 'https://api.zoom.us/v2/users/me/meetings';

        // Meeting data
        $meetingData = [
            'topic'        => $topic,
            'schedule_for' => $zoom_account_email,
            'type'         => 2, // Scheduled meeting
            'start_time'   => $data['class_date_and_time'], // Start time (in UTC)
            'duration'     => 60, // Duration in minutes
            'timezone'     => config('app.timezone'), // Timezone
            'settings'     => [
                'approval_type'    => 2,
                'join_before_host' => true,
                'jbh_time'         => 0,
            ],
        ];

        // Prepare headers
        $headers = [
            'Authorization: Bearer ' . $token,
            'Content-Type: application/json',
        ];

        // Make POST request to create meeting
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $zoomEndpoint);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($meetingData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);
        curl_close($ch);

        // JSON response
        return $response;
    }

    public function updateZoomLive($data, $meetingId)
    {
        $token = $this->createZoomToken();

        // API Endpoint for updating a meeting
        $zoomEndpoint = 'https://api.zoom.us/v2/meetings/' . $meetingId;

        // Meeting data with updated start time
        $meetingData = [
            'topic' => $data['class_topic'],
            'start_time' => $data['class_date_and_time'],
        ];

        // Prepare headers
        $headers = [
            'Authorization: Bearer ' . $token,
            'Content-Type: application/json',
        ];

        // Make PATCH request to update meeting
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $zoomEndpoint);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($meetingData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);
        curl_close($ch);

        return $response;
    }

    public function deleteZoomLive($meetingId)
    {
        $token = $this->createZoomToken();

        // API Endpoint for deleting a meeting
        $zoomEndpoint = 'https://api.zoom.us/v2/meetings/' . $meetingId;

        // Prepare headers
        $headers = [
            'Authorization: Bearer ' . $token,
            'Content-Type: application/json',
        ];

        // Make DELETE request to delete meeting
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $zoomEndpoint);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);
        curl_close($ch);

        return $response;
    }

    public function createZoomToken()
    {
        $clientId = $this->zoomConfig['zoom_client_id'];
        $accountId = $this->zoomConfig['zoom_account_id'];
        $clientSecret = $this->zoomConfig['zoom_client_secret'];
        $oauthUrl = 'https://zoom.us/oauth/token?grant_type=account_credentials&account_id=' . $accountId;

        try {
            $authHeader = 'Basic ' . base64_encode($clientId . ':' . $clientSecret);

            $ch = curl_init($oauthUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: ' . $authHeader));

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);

            if ($curlError) {
                curl_close($ch);
                throw new \Exception('cURL Error: ' . $curlError);
            }

            if ($httpCode == 200) {
                $oauthResponse = json_decode($response, true);
                $accessToken = $oauthResponse['access_token'];
                curl_close($ch);
                return $accessToken;
            } else {
                $errorResponse = json_decode($response, true);
                curl_close($ch);
                throw new \Exception('Zoom API Error - HTTP ' . $httpCode . ': ' . json_encode($errorResponse));
            }
        } catch (\Exception $e) {
            Log::error('Zoom Token Creation Failed: ' . $e->getMessage());
            throw $e; // Re-throw the exception instead of returning null
        }
    }

    public function generateSignature(string $meetingNumber, int $role = 0): string
    {
        $sdkKey = $this->zoomConfig['zoom_sdk_client_id'];
        $sdkSecret = $this->zoomConfig['zoom_sdk_client_secret'];

        if (!$sdkKey || !$sdkSecret) {
            throw new \Exception('Zoom SDK credentials not configured');
        }

        $iat = time();
        $exp = $iat + 7200; // 2 hours

        $payload = [
            'iss' => $sdkKey,
            'exp' => $exp,
            'iat' => $iat,
            'aud' => 'zoom',
            'appKey' => $sdkKey,
            'tokenExp' => $exp,
            'alg' => 'HS256',
            'mn' => $meetingNumber,
            'role' => $role
        ];

        // Create header
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);

        // Create payload
        $payloadJson = json_encode($payload);

        // Base64url encode
        $headerEncoded = $this->base64UrlEncode($header);
        $payloadEncoded = $this->base64UrlEncode($payloadJson);

        // Create signature
        $signature = hash_hmac('sha256', $headerEncoded . '.' . $payloadEncoded, $sdkSecret, true);
        $signatureEncoded = $this->base64UrlEncode($signature);

        return $headerEncoded . '.' . $payloadEncoded . '.' . $signatureEncoded;
    }

    /**
     * Base64url encode
     */
    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}
