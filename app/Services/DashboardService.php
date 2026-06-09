<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Course\Course;
use App\Models\Course\CourseEnrollment;
use App\Models\Course\SectionLesson;
use App\Models\PaymentHistory;
use App\Models\PayoutHistory;


class DashboardService extends MediaService
{
    public function getDashboard(User $user, $currentYear)
    {
        $isInstructor = $user->role === 'instructor' ? true : false;

        $courses_ids = Course::query()
            ->when($isInstructor && $user->instructor_id, function ($query) use ($user) {
                return $query->where('instructor_id', $user->instructor_id);
            })
            ->get()
            ->pluck('id')
            ->toArray();

        // Basic statistics
        $statistics = [
            'courses' => Course::whereIn('id', $courses_ids)->count(),
            'lessons' =>  SectionLesson::whereIn('course_id', $courses_ids)->count(),
            'enrollments' =>  CourseEnrollment::whereIn('course_id', $courses_ids)->count(),
            'students' =>  CourseEnrollment::whereIn('course_id', $courses_ids)->distinct('user_id')->count('user_id'),
            'instructors' => User::where('role', 'instructor')->count(),
        ];

        // Revenue for current year (monthly breakdown)
        $yearlyRevenue = PaymentHistory::query()
            ->selectRaw('MONTH(created_at) as month, SUM(' . $user->role . '_revenue) as revenue')
            ->whereYear('created_at', $currentYear)
            ->where('purchase_type', Course::class)
            ->whereIn('purchase_id', $courses_ids)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month')
            ->map(function ($item) {
                return $item->revenue;
            })
            ->toArray();

        // Fill in missing months with zero revenue
        $revenueData = [];
        for ($month = 1; $month <= 12; $month++) {
            $monthName = Carbon::create($currentYear, $month, 1)->format('F');
            $revenueData[$monthName] = $yearlyRevenue[$month] ?? 0;
        }

        // Course status distribution
        $courseStatusDistribution = $this->getCourseStatusDistribution($courses_ids);

        // Pending withdrawal requests
        $pendingWithdrawals = PayoutHistory::with('user')
            ->when($isInstructor, function ($query) use ($user) {
                return $query->where('user_id', $user->id);
            })
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return [
            'statistics' => $statistics,
            'revenueData' => $revenueData,
            'courseStatusDistribution' => $courseStatusDistribution,
            'pendingWithdrawals' => $pendingWithdrawals,
        ];
    }

    public function getCourseStatusDistribution($courses_ids)
    {
        $distribution = Course::select('status', DB::raw('count(*) as count'))
            ->whereIn('id', $courses_ids)
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                // Map string status values to standardized display names
                $statusLabels = [
                    'approved' => 'Approved',
                    'upcoming' => 'Upcoming',
                    'pending' => 'Pending',
                    'private' => 'Private',
                    'draft' => 'Draft',
                ];

                // For backward compatibility, also handle numeric status if present
                if (is_numeric($item->status)) {
                    $numericLabels = [
                        1 => 'Active',
                        2 => 'Upcoming',
                        3 => 'Pending',
                        4 => 'Private',
                        5 => 'Draft',
                    ];
                    $status = $numericLabels[$item->status] ?? 'Unknown';
                } else {
                    // Handle string status values
                    $status = $statusLabels[$item->status] ?? ucfirst($item->status);
                }

                return [$status => $item->count];
            })
            ->toArray();

        // Ensure all status types are included
        $allStatuses = ['Approved', 'Upcoming', 'Pending', 'Private', 'Draft'];
        foreach ($allStatuses as $status) {
            if (!isset($distribution[$status])) {
                $distribution[$status] = 0;
            }
        }

        return $distribution;
    }
}
