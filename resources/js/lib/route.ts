export function getQueryParams(url: string) {
   const queryString = url.split('?')[1];
   if (!queryString) return {};

   return Object.fromEntries(
      queryString.split('&').map((param) => {
         const [key, value] = param.split('=');
         return [key, decodeURIComponent(value || '')];
      }),
   );
}

export function getRouteSegments(url: string): string[] {
   try {
      let pathname: string;

      // Check if the url is a relative path starting with '/'
      if (url.startsWith('/')) {
         // For relative paths, just use the path directly
         pathname = url.split('?')[0]; // Remove query parameters
      } else {
         // For complete URLs, parse with URL constructor
         try {
            const urlObj = new URL(url);
            pathname = urlObj.pathname;
         } catch (error) {
            // If URL parsing fails, try treating it as a relative path
            pathname = url.split('?')[0];
         }
      }

      // Split by '/' and filter out empty strings
      const segments = pathname.split('/').filter((segment) => segment.length > 0);

      return segments;
   } catch (error) {
      return [];
   }
}

export function routeLastSegment(route: string): string {
   return getRouteSegments(route).pop() || '';
}

export function routeSecondSegment(route: string): string {
   return getRouteSegments(route)[1] || '';
}
