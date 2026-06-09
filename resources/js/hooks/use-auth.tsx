import { SharedData } from '@/types/global';
import { usePage } from '@inertiajs/react';

export function useAuth() {
   const { props } = usePage<SharedData>();
   const { auth } = props;

   const user = auth?.user;
   const isAdmin = auth?.user?.role === 'admin';
   const isStudent = auth?.user?.role === 'student';
   const isInstructor = auth?.user?.role === 'instructor';
   const isLoggedIn = auth?.user ? true : false;

   return { user, isAdmin, isStudent, isInstructor, isLoggedIn };
}
