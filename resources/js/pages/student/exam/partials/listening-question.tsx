import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Pause, Play, Volume2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props {
   question: ExamQuestion;
   answer: any;
   onAnswerChange: (answer: any) => void;
}

const ListeningQuestion = ({ question, answer, onAnswerChange }: Props) => {
   const audioRef = useRef<HTMLAudioElement>(null);
   const [isPlaying, setIsPlaying] = useState(false);
   const [currentTime, setCurrentTime] = useState(0);
   const [duration, setDuration] = useState(0);
   const [volume, setVolume] = useState(0.8);
   const selectedOption = answer?.option_id || '';

   const audioUrl = question.options?.audio_url || '';
   const options = question.question_options || [];

   useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleEnded);

      return () => {
         audio.removeEventListener('timeupdate', updateTime);
         audio.removeEventListener('loadedmetadata', updateDuration);
         audio.removeEventListener('ended', handleEnded);
      };
   }, []);

   useEffect(() => {
      if (audioRef.current) {
         audioRef.current.volume = volume;
      }
   }, [volume]);

   const togglePlay = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (isPlaying) {
         audio.pause();
      } else {
         audio.play();
      }
      setIsPlaying(!isPlaying);
   };

   const handleSeek = (value: number[]) => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = value[0];
      setCurrentTime(value[0]);
   };

   const handleChange = (value: string) => {
      onAnswerChange({
         question_id: question.id,
         option_id: parseInt(value),
      });
   };

   const handleClear = () => {
      onAnswerChange(null);
   };

   const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
   };

   return (
      <div className="space-y-4">
         <p className="text-sm text-gray-600">Listen to the audio carefully and select the correct answer:</p>

         {/* Audio Player */}
         <div className="from-primary/10 to-primary/5 rounded-lg border bg-gradient-to-br p-6">
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            {/* Play/Pause Button */}
            <div className="mb-4 flex justify-center">
               <Button onClick={togglePlay} size="lg" className="h-16 w-16 rounded-full" disabled={!audioUrl}>
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="ml-1 h-6 w-6" />}
               </Button>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
               <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleSeek}
                  disabled={!audioUrl || !duration}
                  className="cursor-pointer"
               />
            </div>

            {/* Time Display */}
            <div className="mb-4 flex justify-between text-sm text-gray-600">
               <span>{formatTime(currentTime)}</span>
               <span>{formatTime(duration)}</span>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
               <Volume2 className="h-4 w-4 text-gray-600" />
               <Slider value={[volume]} max={1} step={0.1} onValueChange={(values) => setVolume(values[0])} className="w-24" />
            </div>
         </div>

         {/* Question Options */}
         <div>
            <div className="mb-3 flex items-start justify-between">
               <p className="text-sm font-semibold text-gray-700">Select your answer:</p>
               {selectedOption && (
                  <Button variant="ghost" size="sm" onClick={handleClear}>
                     <X className="mr-2 h-4 w-4" />
                     Clear Selection
                  </Button>
               )}
            </div>

            <RadioGroup value={selectedOption.toString()} onValueChange={handleChange}>
               <div className="space-y-3">
                  {options.map((option) => (
                     <div
                        key={option.id}
                        className={`flex items-start space-x-3 rounded-lg border-2 p-4 transition-colors ${
                           selectedOption === option.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                        }`}
                     >
                        <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} className="mt-0.5" />
                        <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer font-normal">
                           {option.option_text}
                        </Label>
                     </div>
                  ))}
               </div>
            </RadioGroup>
         </div>

         {!audioUrl && (
            <div className="rounded-lg bg-yellow-50 p-3">
               <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Note:</span> Audio file is not available for this question.
               </p>
            </div>
         )}
      </div>
   );
};

export default ListeningQuestion;
