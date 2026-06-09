import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

interface Props {
   source: {
      type: 'video' | 'audio';
      sources: Array<{
         src: string;
         type?: string;
         provider?: 'youtube' | 'vimeo' | 'html5';
      }>;
   };
   translate?: any;
}

const VideoPlayer = ({ source, translate }: Props) => {
   // Common Plyr options for all video types
   const plyrOptions = {
      controls: ['play-large', 'play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'settings', 'fullscreen'],
      settings: ['quality', 'speed'],
      speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
      resetOnEnd: true,
      keyboard: { focused: true, global: true },
      displayDuration: true,
      tooltips: { controls: true, seek: true },
      i18n: {
         restart: 'Restart',
         rewind: 'Rewind {seektime}s',
         play: 'Play',
         pause: 'Pause',
         forward: 'Forward {seektime}s',
         played: 'Played',
         buffered: 'Buffered',
         currentTime: 'Current time',
         duration: 'Duration',
         volume: 'Volume',
         toggleMute: 'Toggle Mute',
         toggleCaptions: 'Toggle Captions',
         toggleFullscreen: 'Toggle Fullscreen',
      },
   };

   // Process the source for YouTube URLs
   const processedSource = (() => {
      const src = source.sources[0]?.src;
      if (!src) return null;

      // Check if it's a YouTube URL
      const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
      if (!isYouTube) return source;

      // Extract video ID from YouTube URL
      const getYouTubeId = (url: string) => {
         const regExp = /^.*(youtu.be\/|v\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
         const match = url.match(regExp);
         return match && match[2].length === 11 ? match[2] : null;
      };

      const videoId = getYouTubeId(src);
      if (!videoId) return null;

      return {
         type: 'video' as const,
         sources: [
            {
               src: videoId,
               provider: 'youtube' as const,
            },
         ],
      };
   })();

   if (!processedSource) {
      return (
         <div className="flex h-full items-center justify-center">
            <p>{translate?.frontend?.no_video_available || "No video available"}</p>
         </div>
      );
   }

   return <Plyr options={plyrOptions} source={processedSource} />;
};

export default VideoPlayer;
