'use client'

import { useState, useEffect } from 'react'
import ReactPlayer from 'react-player/youtube'
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Heart,
  Volume2,
  VolumeX,
  Maximize2,
} from 'lucide-react'
import Image from 'next/image'

// Define Track type explicitly
interface Track {
  title: string
  artist: string
  thumbnail: string
}

interface PlayTrackEventDetail {
  track: Track
  videoId: string
}

export default function Player() {
  const [track, setTrack] = useState<Track | null>(null)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const onPlay = (e: Event) => {
      const customEvent = e as CustomEvent<PlayTrackEventDetail>
      setTrack(customEvent.detail.track)
      setVideoId(customEvent.detail.videoId)
      setPlaying(true)
      setPlayed(0)
    }
    window.addEventListener('playTrack', onPlay)
    return () => window.removeEventListener('playTrack', onPlay)
  }, [])

  if (!track || !videoId) return null

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className="fixed bottom-0 left-0 w-90 bg-[#181818] border-t border-[#282828] z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Track info */}
        <div className="flex items-center gap-3 w-1/4">
          {/* Consider using next/image here */}
          <Image
            src={track.thumbnail}
            alt={track.title}
            className="h-14 w-14 object-cover rounded"
          />
          <div className="truncate">
            <p className="text-white text-sm truncate">{track.title}</p>
            <p className="text-neutral-400 text-xs truncate">{track.artist}</p>
          </div>
          <button className="text-neutral-400 hover:text-white">
            <Heart className="h-5 w-5" />
          </button>
        </div>

        {/* Center: Controls + Progress */}
        <div className="flex flex-col items-center w-2/4">
          <div className="flex items-center gap-6 mb-2">
            <Shuffle className="h-5 w-5 text-neutral-400 hover:text-white" />
            <SkipBack className="h-6 w-6 text-neutral-400 hover:text-white" />
            <button
              onClick={() => setPlaying(!playing)}
              className="bg-white text-black rounded-full p-2 flex items-center justify-center"
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <SkipForward className="h-6 w-6 text-neutral-400 hover:text-white" />
            <Repeat className="h-5 w-5 text-neutral-400 hover:text-white" />
          </div>
          <div className="flex items-center gap-2 w-full text-xs text-neutral-400">
            <span>{formatTime(played * duration)}</span>
            <input
              type="range"
              min={0}
              max={1}
              step="any"
              value={played}
              onChange={e => setPlayed(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-neutral-600 rounded-lg accent-white"
              style={{
                background: `linear-gradient(to right, white ${
                  played * 100
                }%, #5e5e5e ${played * 100}%)`,
              }}
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume & Expand */}
        <div className="flex items-center gap-4 w-1/4 justify-end">
          <button
            onClick={() => setVolume(v => (v === 0 ? 0.7 : 0))}
            className="text-neutral-400 hover:text-white"
          >
            {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-24 h-1 bg-neutral-600 rounded-lg accent-white"
            style={{
              background: `linear-gradient(to right, white ${
                volume * 100
              }%, #5e5e5e ${volume * 100}%)`,
            }}
          />
          <button className="text-neutral-400 hover:text-white">
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Hidden YouTube Player */}
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${videoId}`}
        playing={playing}
        volume={volume}
        onProgress={state => setPlayed(state.played)}
        onDuration={d => setDuration(d)}
        width="0"
        height="0"
        config={{ youtube: { playerVars: { controls: 0, disablekb: 1 } } }}
      />
    </div>
  )
}
