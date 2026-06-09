<?php

namespace App\Services;

use App\Models\Newsletter;
use App\Models\User;
use App\Notifications\NewsletterNotification;
use App\Services\MediaService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class NewsletterService extends MediaService
{
   function getNewsletters(array $data, bool $paginate = false): LengthAwarePaginator|Collection
   {
      $page = array_key_exists('per_page', $data) ? intval($data['per_page']) : 10;

      $newsletters = Newsletter::when(array_key_exists('search', $data), function ($query) use ($data) {
         return $query->where('subject', 'LIKE', '%' . $data['search'] . '%');
      })
         ->orderBy('created_at', 'desc');

      if ($paginate) {
         return $newsletters->paginate($page);
      }

      return $newsletters->get();
   }

   function createNewsletter(array $data): Newsletter
   {
      return Newsletter::create($data);
   }

   function updateNewsletter(string $id, array $data): Newsletter
   {
      $newsletter = Newsletter::find($id);
      $newsletter->update($data);

      return $newsletter;
   }

   function deleteNewsletter(string $id): bool
   {
      return Newsletter::find($id)->delete();
   }

   function NewsletterNotification(array $data)
   {
      $newsletter = Newsletter::find($data['newsletter_id']);
      $users = User::when($data['user_type'] === 'all', function ($query) {
         return $query->where('role', '!=', 'admin');
      })->when($data['user_type'] !== 'all', function ($query) use ($data) {
         return $query->where('role', $data['user_type']);
      })->get();

      foreach ($users as $user) {
         $user->notify(new NewsletterNotification($newsletter));
      }
   }
}
