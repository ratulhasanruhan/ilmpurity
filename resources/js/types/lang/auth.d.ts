interface AuthLang {
   // Authentication Messages
   failed: string;
   password: string;
   throttle: string;
   password_updated: string;
   verification_link_sent: string;
   password_reset_sent: string;
   google_auth_settings: string;
   google_auth_description: string;

   // Login Page
   login_title: string;
   login_description: string;
   remember_me: string;
   forgot_password: string;
   continue_with: string;
   no_account: string;
   google_auth: string;

   // Register Page
   register_title: string;
   register_description: string;
   have_account: string;

   // Forgot Password
   forgot_description: string;
   return_to_login: string;

   // Reset Password
   reset_title: string;
   reset_description: string;

   // Confirm Password
   confirm_title: string;
   confirm_description: string;

   // Verify Email
   verify_title: string;
   verify_description: string;
   verification_sent: string;
   change_email: string;
}
