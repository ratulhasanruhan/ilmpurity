import { useAuth } from '@/hooks/use-auth';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface Props {
   live_class: CourseLiveClass;
   watchHistory: WatchHistory;
   zoom_sdk_client_id?: string;
   zoom_sdk_client_secret?: string;
}

interface MeetingConfig {
   role: number;
   password: string;
   signature: string;
   meetingNumber: string;
}

// Zoom Client View SDK type declarations
declare global {
   interface Window {
      ZoomMtg: {
         setZoomJSLib: (path: string, dir: string) => void;
         preLoadWasm: () => void;
         prepareWebSDK: () => void;
         checkSystemRequirements: () => any;
         i18n: {
            load: (lang: string) => void;
            onLoad: (callback: () => void) => void;
         };
         init: (config: { leaveUrl: string; disableCORP?: boolean; success: () => void; error: (error: any) => void }) => void;
         join: (config: {
            meetingNumber: string;
            userName: string;
            signature: string;
            userEmail?: string;
            passWord?: string;
            success: (res: any) => void;
            error: (res: any) => void;
         }) => void;
         leave: () => void;
         inMeetingServiceListener: (event: string, callback: (data: any) => void) => void;
         getAttendeeslist: (config: any) => void;
         getCurrentUser: (config: any) => void;
      };
   }
}

const ZoomLiveClass = ({ live_class, watchHistory, zoom_sdk_client_id }: Props) => {
   const { props } = usePage();
   const { auth, translate } = props as any;
   const { frontend } = translate;
   const { isAdmin } = useAuth();
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [sdkLoaded, setSdkLoaded] = useState(false);
   const initializationRef = useRef(false);

   const redirectUrl = isAdmin
      ? `/dashboard/courses`
      : `/play-course/${live_class.course.slug}/${watchHistory.id}/${watchHistory.current_watching_id}`;

   // Get meeting info
   const meetingInfo = (() => {
      if (!live_class.additional_info) return null;

      try {
         if (typeof live_class.additional_info === 'object') {
            return live_class.additional_info;
         }

         if (typeof live_class.additional_info === 'string') {
            return JSON.parse(live_class.additional_info);
         }

         return null;
      } catch (error) {
         // Error parsing meeting info
         return null;
      }
   })();

   // Load Zoom Client View SDK scripts
   const loadZoomSDK = async () => {
      // Zoom SDK already loaded
      if (window.ZoomMtg) {
         setSdkLoaded(true);
         return Promise.resolve();
      }

      // Loading Zoom Client View SDK scripts
      // Script loading order is important for Client View SDK
      const scripts = [
         'https://source.zoom.us/4.0.0/lib/vendor/react.min.js',
         'https://source.zoom.us/4.0.0/lib/vendor/react-dom.min.js',
         'https://source.zoom.us/4.0.0/lib/vendor/redux.min.js',
         'https://source.zoom.us/4.0.0/lib/vendor/redux-thunk.min.js',
         'https://source.zoom.us/4.0.0/zoom-meeting-4.0.0.min.js', // Client View SDK
      ];

      for (const scriptSrc of scripts) {
         await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = scriptSrc;
            script.async = false; // Load in order
            script.onload = () => {
               resolve();
            };
            script.onerror = () => {
               reject(new Error(`Failed to load script: ${scriptSrc}`));
            };
            document.head.appendChild(script);

            // Add timeout
            setTimeout(() => reject(new Error(`Script load timeout: ${scriptSrc}`)), 10000);
         });
      }

      // All Zoom Client View SDK scripts loaded successfully
      setSdkLoaded(true);
   };

   // Fetch signature and meeting config from backend
   const fetchMeetingConfig = async () => {
      try {
         setLoading(true);

         const response = await fetch(route('live-class.signature', live_class.id), {
            method: 'GET',
            headers: {
               Accept: 'application/json',
               'X-Requested-With': 'XMLHttpRequest',
            },
         });

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         const data = await response.json();

         if (data.error) {
            throw new Error(data.error);
         }

         return data;
      } catch (error) {
         setError(error instanceof Error ? error.message : frontend.failed_to_get_meeting_configuration);
         return null;
      }
   };

   // Initialize Zoom Client View SDK
   const initializeZoomSDK = async (config: MeetingConfig) => {
      try {
         if (!window.ZoomMtg) {
            throw new Error(frontend.zoom_sdk_not_loaded);
         }

         // Check system requirements
         window.ZoomMtg.checkSystemRequirements();

         // Clear the React root to avoid conflicts with Zoom's DOM manipulation
         const appElement = document.getElementById('app') || document.body;
         appElement.innerHTML = '';

         // Prepare body for Zoom to take over
         document.body.style.margin = '0';
         document.body.style.padding = '0';
         document.body.style.overflow = 'hidden';
         document.body.style.height = '100vh';
         document.body.style.width = '100vw';

         // Pre-load WASM and prepare SDK
         window.ZoomMtg.preLoadWasm();
         window.ZoomMtg.prepareWebSDK();

         // Load language (default to English)
         window.ZoomMtg.i18n.load('en-US');

         // Initialize SDK when language is loaded
         window.ZoomMtg.i18n.onLoad(() => {
            window.ZoomMtg.init({
               leaveUrl: window.location.origin + redirectUrl, // Redirect after leaving
               disableCORP: !window.crossOriginIsolated, // Required for security
               success: () => {
                  joinMeeting(config);
               },
               error: (error: any) => {
                  setError(frontend.failed_to_initialize_meeting + ': ' + (error.message || error));
                  setLoading(false);
               },
            });
         });

         // Set up meeting event listeners
         setupMeetingListeners();
      } catch (error) {
         setError(error instanceof Error ? error.message : frontend.failed_to_initialize_meeting);
         setLoading(false);
      }
   };

   // Join the meeting
   const joinMeeting = (config: MeetingConfig) => {
      window.ZoomMtg.join({
         meetingNumber: config.meetingNumber,
         userName: auth.user.name,
         signature: config.signature,
         userEmail: auth.user.email || '',
         passWord: config.password,
         success: (res: any) => {
            // At this point, Zoom has taken over the page completely
            // Our React component should step aside
            setLoading(false);

            // Get current user info
            window.ZoomMtg.getCurrentUser({
               success: (res: any) => {
                  // Current user info
               },
            });

            // Get attendees list
            window.ZoomMtg.getAttendeeslist({});
         },
         error: (error: any) => {
            setError(frontend.failed_to_join_meeting + ': ' + (error.message || error));
            setLoading(false);
         },
      });
   };

   // Setup meeting event listeners
   const setupMeetingListeners = () => {
      // User join event
      window.ZoomMtg.inMeetingServiceListener('onUserJoin', (data: any) => {
         // User joined
      });

      // User leave event
      window.ZoomMtg.inMeetingServiceListener('onUserLeave', (data: any) => {
         // User left
      });

      // Waiting room event
      window.ZoomMtg.inMeetingServiceListener('onUserIsInWaitingRoom', (data: any) => {
         // User in waiting room
      });

      // Meeting status change
      window.ZoomMtg.inMeetingServiceListener('onMeetingStatus', (data: any) => {
         // Meeting status changed
      });
   };

   // Cleanup function
   const cleanup = () => {
      if (window.ZoomMtg) {
         try {
            window.ZoomMtg.leave();
         } catch (error) {
            // Error leaving meeting during cleanup
         }
      }
   };

   // Main initialization useEffect
   useEffect(() => {
      if (initializationRef.current) return;
      initializationRef.current = true;

      const initializeMeeting = async () => {
         // Check if SDK credentials are available
         if (!zoom_sdk_client_id) {
            setError(frontend.zoom_sdk_not_configured);
            setLoading(false);
            return;
         }

         // Check if meeting info exists
         if (!meetingInfo) {
            setError(frontend.meeting_information_not_found);
            setLoading(false);
            return;
         }

         try {
            // Step 1: Load SDK scripts
            await loadZoomSDK();

            // Step 2: Fetch meeting config
            const config = await fetchMeetingConfig();
            if (!config) return;

            // Step 3: Initialize and join meeting
            await initializeZoomSDK(config);
         } catch (error) {
            setError(error instanceof Error ? error.message : frontend.failed_to_initialize_meeting);
            setLoading(false);
         }
      };

      initializeMeeting();

      // Cleanup on unmount
      return cleanup;
   }, []);

   // Render loading state
   if (loading) {
      return (
         <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <div className="text-center">
               <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
               <h1 className="text-xl font-semibold text-white">{live_class.class_topic}</h1>
               <p className="text-gray-300">{!sdkLoaded ? frontend.loading_zoom_sdk : frontend.joining_meeting}</p>
            </div>
         </div>
      );
   }

   // Render error state
   if (error) {
      return (
         <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
               <h1 className="mb-4 text-2xl font-bold text-red-600">{frontend.unable_to_join_meeting}</h1>
               <p className="text-muted-foreground mb-4">{error}</p>

               {/* Fallback: Show direct Zoom link if available */}
               {meetingInfo?.join_url && (
                  <div className="mt-4">
                     <p className="mb-2 text-sm text-gray-500">{frontend.you_can_join_directly}</p>
                     <a
                        href={meetingInfo.join_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                     >
                        {frontend.open_in_zoom_app}
                     </a>
                  </div>
               )}

               <button onClick={() => window.location.reload()} className="mt-4 rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
                  {frontend.try_again}
               </button>
            </div>
         </div>
      );
   }

   return null;
};

export default ZoomLiveClass;
