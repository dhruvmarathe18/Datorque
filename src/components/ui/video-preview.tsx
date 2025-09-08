"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";

interface VideoPreviewProps {
  src: string;
  poster?: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  playOnView?: boolean;
}

export function VideoPreview({
  src,
  poster,
  title,
  className = "",
  autoPlay = true,
  muted = true,
  loop = true,
  playOnView = false,
}: VideoPreviewProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const playPromiseRef = React.useRef<Promise<void> | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(muted);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [loadTimeout, setLoadTimeout] = React.useState<NodeJS.Timeout | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;
  
  // Use intersection observer to detect when video comes into view
  const isInView = useInView(containerRef, { 
    once: false, 
    margin: "-10% 0px -10% 0px"
  });

  const safePlay = React.useCallback(async () => {
    if (!videoRef.current) {
      console.log('Video ref not available');
      return;
    }
    
    console.log('Attempting to play video:', { src, title, readyState: videoRef.current.readyState });
    
    // Cancel any existing play promise
    if (playPromiseRef.current) {
      try {
        await playPromiseRef.current;
      } catch {
        // Ignore errors from cancelled promises
      }
    }
    
    try {
      playPromiseRef.current = videoRef.current.play();
      await playPromiseRef.current;
      console.log('Video play successful:', { src, title });
      setIsPlaying(true);
    } catch (error) {
      console.log('Video play failed:', { error, src, title });
      // Handle autoplay policy restrictions gracefully
    } finally {
      playPromiseRef.current = null;
    }
  }, [src, title]);

  const togglePlay = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        await safePlay();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoLoad = async () => {
    console.log('Video loaded:', { src, title });
    if (loadTimeout) {
      clearTimeout(loadTimeout);
      setLoadTimeout(null);
    }
    setIsLoaded(true);
    // Don't auto-play here, let the intersection observer handle it
  };

  const handleMouseEnter = async () => {
    setIsHovered(true);
    if (autoPlay && !isPlaying) {
      await safePlay();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (autoPlay && videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Set up load timeout
  React.useEffect(() => {
    if (!isLoaded && !hasError && retryCount === 0) {
      const timeout = setTimeout(() => {
        console.log('Video load timeout:', { src, title, retryCount });
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
          // Retry loading
          if (videoRef.current) {
            const currentSrc = videoRef.current.src;
            videoRef.current.src = '';
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.src = currentSrc;
              }
            }, 500);
          }
        } else {
          setHasError(true);
          setIsLoaded(true);
        }
      }, 8000); // 8 second timeout
      
      setLoadTimeout(timeout);
      
      return () => {
        clearTimeout(timeout);
        setLoadTimeout(null);
      };
    }
  }, [isLoaded, hasError, src, title, retryCount, maxRetries]);

  // Auto-play when in view with performance optimization
  React.useEffect(() => {
    if (playOnView && isInView && isLoaded && !isPlaying && !hasError) {
      // Add a small delay to prevent all videos from starting at once
      const timeoutId = setTimeout(() => {
        console.log('Attempting auto-play on view:', { src, title, isInView, isLoaded });
        safePlay();
      }, Math.random() * 300 + 200); // Random delay between 200-500ms
      
      return () => clearTimeout(timeoutId);
    } else if (playOnView && !isInView && isPlaying) {
      console.log('Pausing video out of view:', { src, title });
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isInView, isLoaded, playOnView, isPlaying, hasError, src, title]);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      
      // Clean up any pending play promise
      if (playPromiseRef.current) {
        playPromiseRef.current.catch(() => {
          // Ignore errors from cancelled promises
        });
        playPromiseRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative group overflow-hidden rounded-lg ${className}`}
      onMouseEnter={!playOnView ? handleMouseEnter : undefined}
      onMouseLeave={!playOnView ? handleMouseLeave : undefined}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={isMuted}
        loop={loop}
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        onLoadedData={handleVideoLoad}
        onCanPlay={() => {
          console.log('Video can play:', { src, title });
          if (loadTimeout) {
            clearTimeout(loadTimeout);
            setLoadTimeout(null);
          }
          setIsLoaded(true);
        }}
        onLoadStart={() => {
          console.log('Video load started:', { src, title });
        }}
        onLoadedMetadata={() => {
          console.log('Video metadata loaded:', { src, title });
        }}
        onCanPlayThrough={() => {
          console.log('Video can play through:', { src, title });
          if (loadTimeout) {
            clearTimeout(loadTimeout);
            setLoadTimeout(null);
          }
          setIsLoaded(true);
        }}
        onError={(e) => {
          const target = e.target as HTMLVideoElement;
          const error = target.error;
          console.error('Video error details:', {
            error: error?.code,
            message: error?.message,
            networkState: target.networkState,
            readyState: target.readyState,
            src: target.src,
            currentSrc: target.currentSrc,
            retryCount
          });
          
          if (retryCount < maxRetries) {
            console.log(`Retrying video load (${retryCount + 1}/${maxRetries}):`, { src, title });
            setRetryCount(prev => prev + 1);
            // Reset video source to trigger reload
            if (videoRef.current) {
              const currentSrc = videoRef.current.src;
              videoRef.current.src = '';
              setTimeout(() => {
                if (videoRef.current) {
                  videoRef.current.src = currentSrc;
                }
              }, 1000 * (retryCount + 1)); // Exponential backoff
            }
          } else {
            console.log('Max retries reached, showing error state:', { src, title });
            setHasError(true);
            setIsLoaded(true);
          }
        }}
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "scale(1)" : "scale(1.1)",
        }}
      />

      {/* Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3 mx-auto"></div>
            <p className="text-sm text-primary font-medium">
              {retryCount > 0 ? `Retrying... (${retryCount}/${maxRetries})` : 'Loading video...'}
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Play className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-sm text-red-400 font-medium mb-2">Video unavailable</p>
            <p className="text-xs text-gray-400">Click to view live site</p>
          </div>
        </div>
      )}

      {/* Fallback Image */}
      {poster && (
        <Image
          src={poster}
          alt={title}
          fill
          className="object-cover transition-opacity duration-500"
          style={{
            opacity: (isLoaded && !hasError) ? 0 : 1,
          }}
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}

      {/* Overlay Controls - Only show when not in playOnView mode */}
      {!playOnView && (
        <motion.div
          className="absolute inset-0 bg-black/20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered || !isPlaying ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Play Indicator - Only show when not in playOnView mode */}
      {!playOnView && !isPlaying && (
        <motion.div
          className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Play className="w-4 h-4 text-white" />
        </motion.div>
      )}

      {/* Playing Indicator - Show when video is playing in playOnView mode */}
      {playOnView && isPlaying && (
        <motion.div
          className="absolute top-4 right-4 bg-green-500/80 backdrop-blur-sm rounded-full p-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
