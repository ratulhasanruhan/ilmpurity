<?php

namespace App\Services;

use App\Services\MediaService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class NotificationService extends MediaService
{
   function notifications(array $data): LengthAwarePaginator|Collection
   {
      $user = Auth::user();
      $page = array_key_exists('per_page', $data) ? intval($data['per_page']) : 10;

      if (array_key_exists('unread', $data) && $data['unread']) {
         $notifications = $user->unreadNotifications;
      } else {
         $notifications = $user->notifications()->paginate($page);
      }

      return $notifications;
   }

   function markAllAsRead(): void
   {
      Auth::user()->unreadNotifications->markAsRead();
   }

   // I want to return the read notification
   function markAsRead(string $id)
   {
      $notification = Auth::user()->notifications->find($id);

      if ($notification) {
         $notification->markAsRead();
      }

      return $notification;
   }
}
