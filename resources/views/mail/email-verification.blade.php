<!DOCTYPE
   html
   PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"
>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
   <title>{{ config('app.name') }}</title>
   <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
   />
   <meta
      http-equiv="Content-Type"
      content="text/html; charset=UTF-8"
   />
   <meta
      name="color-scheme"
      content="light"
   >
   <meta
      name="supported-color-schemes"
      content="light"
   >
   <style>
      @media only screen and (max-width: 600px) {
         .inner-body {
            width: 100% !important;
         }

         .footer {
            width: 100% !important;
         }
      }

      @media only screen and (max-width: 500px) {
         .button {
            width: 100% !important;
         }
      }
   </style>

   {{ $head ?? '' }}
</head>

<body>
   <h1 style="font-size: 1.5em; font-weight: 600; margin-bottom: 1em;">
      Hello, {{ $user->name }}!
   </h1>
   <p style="margin-bottom: 1.5em;">
      Thank you for registering with us. Please verify your email address by clicking the button below:
   </p>
   <a
      href="{{ $url }}"
      style="display: inline-block; padding: 0.75em 1.5em; background-color: #0969da; color: #fff; border-radius: 0.5em; text-decoration: none; font-weight: 600; margin-bottom: 1.5em;"
   >
      Verify Email Address
   </a>
   <p style="margin-bottom: 1em;">
      This verification link will expire in 5 minutes.
   </p>
   <p style="margin-bottom: 1em;">
      If you did not create an account, no further action is required.
   </p>

   <p style="margin: 2em 0 0;">
      Thanks,<br>
      {{ config('mail.from.name') }}
   </p>
</body>

</html>
