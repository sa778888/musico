// app/components/PlayerContent.tsx
'use client'
import { BsPauseFill, BsPlayFill } from 'react-icons/bs'
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2'
import { AiFillStepBackward, AiFillStepForward } from 'react-icons/ai'
import useSound from 'use-sound'
import usePlayer from '@/hooks/usePlayer'
import MediaItem from './MediaItem'
import LikeButton from './LikeButton'
import Slider from './Slider'

export default function PlayerContent() {
  const player = usePlayer()
  const song = player.activeId ? player.songMap[player.activeId] : null
  const songUrl = song ? `/api/songs/${song.id}/stream` : ''
  const [volume, setVolume] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [play, { pause, sound }] = useSound(songUrl, {
    volume,
    format: ['mp3'],
    onplay: () => setIsPlaying(true),
    onpause: () => setIsPlaying(false),
    onend: () => {
      setIsPlaying(false)
      const i = player.ids.indexOf(player.activeId!)
      player.setId(player.ids[(i + 1) % player.ids.length])
    },
  })

  useEffect(() => {
    sound?.play()
    return () => sound?.unload()
  }, [sound])

  if (!song) return null
  const Icon = isPlaying ? BsPauseFill : BsPlayFill
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 items-center w-full h-full">
      {/* Left: Artwork + Like */}
      <div className="flex items-center gap-x-4">
        <MediaItem data={song} />
        <LikeButton songId={song.id} />
      </div>

      {/* Center: Controls */}
      <div className="flex flex-col items-center gap-y-1">
        <div className="flex items-center gap-x-6">
          <AiFillStepBackward
            onClick={() => {/* prev logic */}}
            size={24}
            className="text-neutral-400 hover:text-white cursor-pointer"
          />
          <button
            onClick={() => (isPlaying ? pause() : play())}
            className="bg-spotify-green hover:bg-green-600 p-2 rounded-full"
          >
            <Icon size={24} className="text-black" />
          </button>
          <AiFillStepForward
            onClick={() => {/* next logic */}}
            size={24}
            className="text-neutral-400 hover:text-white cursor-pointer"
          />
        </div>
        <Slider
          value={volume}
          onChange={setVolume}
          trackClassName="bg-spotify-green"
          thumbClassName="bg-white"
          className="w-48"
        />
      </div>

      {/* Right: Volume */}
      <div className="hidden md:flex items-center justify-end gap-x-4">
        <VolumeIcon
          onClick={() => setVolume(v => (v === 0 ? 1 : 0))}
          size={20}
          className="text-neutral-400 hover:text-white cursor-pointer"
        />
        <Slider
          value={volume}
          onChange={setVolume}
          trackClassName="bg-spotify-green"
          thumbClassName="bg-white"
          className="w-24"
        />
      </div>
    </div>
  )
}
