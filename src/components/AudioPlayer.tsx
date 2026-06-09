import { useState, useRef, useEffect, useCallback, type MouseEvent } from 'react';
import { Play, Pause, Download } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  title?: string;
  downloadName?: string;
  preacher?: string;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function AudioPlayer({ src, downloadName }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  /* ── Handlers ── */

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }, [isPlaying]);

  const handleSeek = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  }, [duration]);

  const skip = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
  }, [duration]);

  /* ── Audio events ── */

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      if (!isDragging) setCurrentTime(audio.currentTime);
    };
    const onLoaded = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('durationchange', onLoaded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('durationchange', onLoaded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
    };
  }, [isDragging]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  /* ── Atajo de teclado: Espacio para play/pausa ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' && document.activeElement?.closest('[data-audioplayer]')) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [togglePlay]);

  return (
    <div
      data-audioplayer
      className="tw-scope bg-slate-100 rounded-lg overflow-hidden px-4 flex items-center gap-3 sm:gap-4 h-[60px]"
    >
      {/* Audio nativo oculto */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        disabled={isLoading}
        className="shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-brand hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 disabled:opacity-50 disabled:cursor-wait"
        aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
      >
        {isLoading ? (
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : isPlaying ? (
          <Pause size={16} fill="currentColor" />
        ) : (
          <Play size={16} fill="currentColor" className="ml-0.5" />
        )}
      </button>

      {/* Tiempo actual */}
      <span className="text-xs font-mono text-neutral-600 tabular-nums shrink-0">
        {formatTime(currentTime)}
      </span>

      {/* Barra de progreso */}
      <div
        ref={progressRef}
        className="relative flex-1 h-1.5 bg-neutral-200 rounded-full cursor-pointer group flex items-center"
        onClick={handleSeek}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        role="slider"
        aria-label="Progreso del audio"
        aria-valuenow={Math.round(currentTime)}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') skip(5);
          if (e.key === 'ArrowLeft') skip(-5);
        }}
      >
        {/* Track relleno */}
        <div
          className="absolute inset-y-0 left-0 bg-brand rounded-full transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
        {/* Thumb */}
        <div
          className="absolute h-3 w-3 rounded-full bg-brand shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      {/* Tiempo total */}
      <span className="hidden sm:block text-xs font-mono text-neutral-600 tabular-nums shrink-0">
        {formatTime(duration)}
      </span>

      {/* Descargar */}
      {src && (
        <a
          href={src}
          download={downloadName ?? 'sermon.mp3'}
          className="shrink-0 text-slate-400 hover:text-slate-800 transition-colors outline-none focus-visible:text-brand"
          title="Descargar MP3"
        >
          <Download size={18} />
        </a>
      )}
    </div>
  );
}
