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

      :root {
         --rte-bg: #fff;
         --rte-fg: #1f2328;
         --rte-border: #d1d9e0;
         --rte-primary: #0969da;
         --rte-primary-fg: #fff;
         --rte-secondary: #f0f1f3;
         --rte-secondary-fg: #59636e;
         --rte-muted: #f6f8fa;
         --rte-muted-fg: #59636e;
         --rte-accent: #818b981f;
         --rte-accent-fg: #59636e;
         --rte-tooltip: #25292e;
         --rte-tooltip-fg: #f0f0f0;
         --rte-overlay: #32324d33;
         --rte-hljs-comment: #6a737d;
         --rte-hljs-keyword: #d73a49;
         --rte-hljs-entity: #6f42c1;
         --rte-hljs-function: #6f42c1;
         --rte-hljs-variable: #005cc5;
         --rte-hljs-constant: #005cc5;
         --rte-hljs-string: #032f62;
         --rte-hljs-regexp: #032f62;
         --rte-hljs-markup: #22863a;
         --rte-hljs-builtin: #e36209;
         --rte-hljs-inserted: #34d058;
         --rte-hljs-deleted: #b31d28;
         --rte-hljs-changed: #e36209;
         --rte-hljs-ignored: #f6f8fa;
         --rte-editor-font-size: 15px;
         --rte-editor-line-height: 1.5;
         --rte-editor-font: var(--font-sans);
         --rte-editor-code-font: var(--font-mono);
         --rte-editor-code-bg: #f6f8fa;
         --rte-editor-scrollbar: #00000040;
         --rte-editor-selection: #2383e247;
         --rte-radius: 0.5rem;
      }

      .dark {
         --rte-bg: #0d1017;
         --rte-fg: #f0f6fc;
         --rte-border: #3d444d;
         --rte-primary: #4493f8;
         --rte-tooltip: #3d444d;
         --rte-bubble: #151b23;
         --rte-overlay: #ffffff30;
         --rte-secondary: #2e373e;
         --rte-secondary-fg: #b1b8c0;
         --rte-muted: #1a2029;
         --rte-muted-fg: #b1b8c0;
         --rte-accent: #2d3440;
         --rte-accent-fg: #b1b8c0;
         --rte-hljs-comment: #8b949e;
         --rte-hljs-keyword: #ff7b72;
         --rte-hljs-entity: #d2a8ff;
         --rte-hljs-function: #d2a8ff;
         --rte-hljs-variable: #79c0ff;
         --rte-hljs-constant: #79c0ff;
         --rte-hljs-string: #a5d6ff;
         --rte-hljs-regexp: #a5d6ff;
         --rte-hljs-markup: #7ee787;
         --rte-hljs-builtin: #ffa657;
         --rte-hljs-inserted: #3fb950;
         --rte-hljs-deleted: #f85149;
         --rte-hljs-changed: #ffa657;
         --rte-hljs-ignored: #161b22;
         /* Editor settings */
         --rte-editor-code-bg: #1a2029;
         --rte-editor-scrollbar: #ffffff40;
         --rte-shadow-1: 0px 0px 0px 1px #3d444d, 0px 6px 12px -3px #01040966, 0px 6px 18px 0px #01040966;
         --rte-shadow-2:
            0px 0px 0px 1px #3d444d, 0px 8px 16px -4px #01040966, 0px 4px 32px -4px #01040966, 0px 24px 48px -12px #01040966,
            0px 48px 96px -24px #01040966;
         --rte-shadow-3: 0px 0px 0px 1px #3d444d, 0px 24px 48px 0px #010409;
      }

      .rte-button {
         all: unset;
         box-sizing: border-box;
         display: inline-flex;
         align-items: center;
         justify-content: center;
         font-weight: 500;
         border-radius: calc(var(--rte-radius, 0.5rem) * 0.75);
         user-select: none;
         cursor: pointer;
         transition: all 0.15s ease-in;
         white-space: nowrap;
         width: auto;
         height: 2rem;
         padding-inline: 0.75rem;
         border: 1px solid transparent;
         font-size: 0.875rem;
         line-height: 1.25rem;
      }

      .rte-button:disabled {
         opacity: 0.5;
         pointer-events: none;
         cursor: not-allowed;
      }

      .rte-button__text {
         display: inline-flex;
         align-items: center;
         text-align: inherit;
         flex: 1 auto;
      }

      *+.rte-button__text {
         margin-left: 0.5rem;
      }

      .rte-button.rte-button--icon-only {
         padding: 0;
         aspect-ratio: 1/1;
      }

      .rte-button--primary {
         color: var(--rte-primary-fg);
         background-color: var(--rte-primary);
         border-color: var(--rte-primary);
      }

      .rte-button--primary:not(:disabled):hover {
         background-color: color-mix(in srgb, var(--rte-primary), #fff 15%);
      }
   </style>

   {{ $head ?? '' }}
</head>

<body>
   <h1 style="font-size: 1.5em; font-weight: 600; margin-bottom: 1em;">
      Exam Approval Status Update
   </h1>

   @if ($status === 'approved')
      <h2 style="font-size: 1.25em; font-weight: 600; margin: 1.5em 0 1em;">
         🎉 Congratulations, {{ $user->name }}!
      </h2>

      <p style="margin-bottom: 1.5em;">
         Your exam "{{ $exam->title }}" has been approved and is now live on our
         platform.
      </p>

      @if (!empty($feedback))
         <div style="margin: 1.5em 0; padding: 1em; background-color: #f9fafb; border-radius: 0.5em;">
            <h3 style="font-weight: 600; margin-bottom: 0.5em;">Reviewer Feedback:</h3>
            <div class="prose dark:prose-invert max-w-none py-6">
               <div class="tiptap ProseMirror !py-0">
                  {!! $feedback !!}
               </div>
            </div>
         </div>
      @endif

      <a
         href="{{ route('exams.details', ['slug' => $exam->slug, 'id' => $exam->id]) }}"
         style="display: inline-block; padding: 0.75em 1.5em; background-color: #0969da; color: #fff; border-radius: 0.5em; text-decoration: none; font-weight: 600;"
      >
         View Exam
      </a>
   @else
      <h2 style="font-size: 1.25em; font-weight: 600; margin: 1.5em 0 1em;">
         Exam Approval Request Update: {{ ucfirst($status) }}
      </h2>

      <p style="margin-bottom: 1em;">
         Your exam "{{ $exam->title }}" status has been updated to:
         <strong>{{ ucfirst($status) }}</strong>.
      </p>

      @if (!empty($feedback))
         <div style="margin: 1.5em 0; padding: 1em; background-color: #f9fafb; border-radius: 0.5em;">
            <h3 style="font-weight: 600; margin-bottom: 0.5em;">Reviewer Feedback:</h3>
            <div class="prose dark:prose-invert max-w-none py-6">
               <div class="tiptap ProseMirror !py-0">
                  {!! $feedback !!}
               </div>
            </div>
         </div>
      @endif

      <a
         href="{{ route('exams.edit', $exam->id) }}"
         style="display: inline-block; padding: 0.75em 1.5em; background-color: #ef4444; color: #fff; border-radius: 0.5em; text-decoration: none; font-weight: 600;"
      >
         Update Exam
      </a>
   @endif

   @if ($status === 'approved')
      <p style="margin: 1.5em 0;">
         Students can now enroll in your exam. Promote it to reach more learners!
      </p>
   @endif

   <p style="margin: 1.5em 0; font-size: 0.875em; color: #4b5563;">
      If you have any questions, please don't hesitate to contact our support team.
   </p>

   <p style="margin: 2em 0 0;">
      Best regards,<br>
      {{ config('mail.from.name') }} Team
   </p>
</body>

</html>

