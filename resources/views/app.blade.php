<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
   <meta charset="utf-8">
   <meta
      name="viewport"
      content="width=device-width, initial-scale=1"
   >
   <meta
      name="csrf-token"
      content="{{ csrf_token() }}"
   >

   {{-- Inline style to set the HTML background color based on our theme in app.css --}}
   <style>
      html {
         background-color: oklch(1 0 0);
      }

      html.dark {
         background-color: oklch(0.145 0 0);
      }
   </style>

   @if (app('system_settings'))
      <title inertia>
         {{ $metaTitle ?? app('system_settings')->fields['name'] }}
      </title>
      <meta
         name="description"
         content="{{ $metaDescription ?? app('system_settings')->fields['description'] }}"
      >
      <meta
         name="keywords"
         content="{{ $metaKeywords ?? app('system_settings')->fields['keywords'] }}"
      >
      <meta
         name="author"
         content="{{ app('system_settings')->fields['author'] }}"
      >

      @if (!empty(app('system_settings')->fields['favicon']))
         <link
            rel="icon"
            href="{{ app('system_settings')->fields['favicon'] }}"
            type="image/png"
         >
      @elseif (!empty(app('system_settings')->fields['logo_light']))
         <link
            rel="icon"
            href="{{ app('system_settings')->fields['logo_light'] }}"
            type="image/png"
         >
      @endif

      <meta
         property="og:type"
         content="{{ $ogType ?? 'website' }}"
      >
      <meta
         property="og:url"
         content="{{ $ogUrl ?? env('APP_URL', config('app.url')) }}"
      >
      <meta
         property="og:title"
         content="{{ $ogTitle ?? (app('system_settings')->fields['title'] ?? app('system_settings')->fields['name']) }}"
      >
      <meta
         property="og:description"
         content="{{ $ogDescription ?? app('system_settings')->fields['description'] }}"
      >
      <meta
         property="og:site_name"
         content="{{ app('system_settings')->fields['name'] }}"
      >

      @if (!empty($ogImage))
         <meta
            property="og:image"
            content="{{ $ogImage }}"
         >
         <meta
            property="og:image:width"
            content="1200"
         >
         <meta
            property="og:image:height"
            content="630"
         >
         <meta
            property="og:image:alt"
            content="{{ $ogTitle ?? app('system_settings')->fields['name'] }}"
         >
      @elseif (!empty(app('system_settings')->fields['banner']))
         <meta
            property="og:image"
            content="{{ app('system_settings')->fields['banner'] }}"
         >
         <meta
            property="og:image:width"
            content="1000"
         >
         <meta
            property="og:image:height"
            content="600"
         >
         <meta
            property="og:image:alt"
            content="{{ app('system_settings')->fields['name'] }}"
         >
      @endif

      <meta
         name="twitter:card"
         content="{{ $twitterCard ?? 'summary_large_image' }}"
      >
      <meta
         name="twitter:title"
         content="{{ $twitterTitle ?? (app('system_settings')->fields['title'] ?? app('system_settings')->fields['name']) }}"
      >
      <meta
         name="twitter:description"
         content="{{ $twitterDescription ?? app('system_settings')->fields['description'] }}"
      >
      @if (!empty($twitterImage))
         <meta
            name="twitter:image"
            content="{{ $twitterImage }}"
         >
      @elseif (!empty(app('system_settings')->fields['banner']))
         <meta
            name="twitter:image"
            content="{{ app('system_settings')->fields['banner'] }}"
         >
      @endif
   @endif

   <link
      rel="preconnect"
      href="https://fonts.bunny.net"
   >
   <link
      href="https://fonts.bunny.net/css?family=inter:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i"
      rel="stylesheet"
   />

   @routes
   @viteReactRefresh
   @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
   @inertiaHead
</head>

<body class="font-sans antialiased">
   @inertia

   {{-- Inject Global Style AFTER app styles so it wins in the cascade --}}
   @php($globalStyle = app('system_settings')->fields['global_style'] ?? '')
   @if ($globalStyle)
      <style
         data-global-style
         type="text/css"
      >
         {!! $globalStyle !!}
      </style>
   @endif
</body>

</html>
