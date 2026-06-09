<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Course\CourseLiveClass;
use App\Http\Requests\StoreLiveClassRequest;
use App\Http\Requests\UpdateLiveClassRequest;
use App\Services\LiveClass\ZoomLiveService;
use App\Services\Course\CoursePlayerService;
use Inertia\Inertia;

class LiveClassController extends Controller
{
    public function __construct(
        private ZoomLiveService $zoomLiveService,
        private CoursePlayerService $coursePlayerService
    ) {}

    public function index($id)
    {
        $user = Auth::user();
        $live_class = CourseLiveClass::with('course')->where('id', $id)->first();
        $watchHistory = $this->coursePlayerService->getWatchHistory($live_class->course_id, $user->id);

        if (!$live_class) {
            abort(404, 'Live class not found');
        }

        // Always use the embedded SDK approach
        return Inertia::render('course-player/live-class/zoom-live-class', [
            'live_class' => $live_class,
            'watchHistory' => $watchHistory,
            'zoom_sdk_client_id' => $this->zoomLiveService->zoomConfig['zoom_sdk_client_id'] ??  null,
        ]);
    }

    public function store(StoreLiveClassRequest $request)
    {
        $data = $request->validated();
        $data['provider'] = 'zoom';
        $data['class_date_and_time'] = date('Y-m-d\TH:i:s', strtotime($data['class_date_and_time']));

        if ($data['provider'] == 'zoom') {
            $meeting_info = $this->zoomLiveService->createZoomLive($data);
            $meeting_info_arr = json_decode($meeting_info, true);

            if (array_key_exists('code', $meeting_info_arr) && $meeting_info_arr['code']) {
                return back()->with('error', $meeting_info_arr['message'] ?? 'Failed to create Zoom meeting');
            }

            // Store the array, not the JSON string (model has array cast)
            $data['additional_info'] = $meeting_info_arr;
        }

        CourseLiveClass::create($data);

        return back()->with('success', 'Live class added successfully');
    }

    public function update(UpdateLiveClassRequest $request, $id)
    {
        $data = $request->validated();
        $data['class_date_and_time'] = date('Y-m-d\TH:i:s', strtotime($data['class_date_and_time']));
        $prevLive = CourseLiveClass::where('id', $id)->first();

        if ($prevLive->provider == 'zoom') {
            $previous_meeting_info = $prevLive->getAdditionalInfoArray();
            $this->zoomLiveService->updateZoomLive($data, $previous_meeting_info['id']);
            $previous_meeting_info["start_time"] = $data['class_date_and_time'];
            $previous_meeting_info["topic"] = $data['class_topic'];
            $data['additional_info'] = $previous_meeting_info;
        }

        CourseLiveClass::where('id', $id)->update($data);

        return back()->with('success', 'Live class updated successfully');
    }

    public function destroy($id)
    {
        $previous_meeting_data = CourseLiveClass::where('id', $id)->first();

        if ($previous_meeting_data->provider == 'zoom') {
            $meetingInfo = $previous_meeting_data->getAdditionalInfoArray();
            if (isset($meetingInfo['id'])) {
                $this->zoomLiveService->deleteZoomLive($meetingInfo['id']);
            }
        }

        CourseLiveClass::where('id', $id)->delete();

        return back()->with('success', 'Live class deleted successfully');
    }

    /**
     * Generate Zoom SDK signature for frontend
     */
    public function signature($meetingId)
    {
        try {
            $liveClass = CourseLiveClass::where('id', $meetingId)->first();

            if (!$liveClass) {
                return response()->json(['error' => 'Live class not found'], 404);
            }

            // Check if user is host (instructor)
            $isHost = $liveClass->course->instructor_id === Auth::id() ? 1 : 0;

            // Get meeting info using the helper method
            $meetingInfo = $liveClass->getAdditionalInfoArray();

            if (!$meetingInfo || !isset($meetingInfo['id'])) {
                return response()->json(['error' => 'Meeting info not found'], 404);
            }

            $signature = $this->zoomLiveService->generateSignature(
                (string)$meetingInfo['id'],
                $isHost
            );

            return response()->json([
                'signature' => $signature,
                'meetingNumber' => (string)$meetingInfo['id'], // Ensure string format
                'password' => $meetingInfo['password'] ?? '',
                'role' => $isHost,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
