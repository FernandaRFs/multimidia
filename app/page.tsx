'use client'

import './globals.css'
import { useRef, useState, useEffect } from 'react'

type VideoData = {
  id: number
  title: string
  artist: string
  src: string
  thumbnail: string
}

const videos: VideoData[] = [
  {
    id: 1,
    title: 'Sk8er Boi',
    artist: 'Avril Lavigne',
    src: 'video.mp4',
    thumbnail: 'image.jpg',
  },
  {
    id: 2,
    title: 'Young & Dumb',
    artist: 'Avril Lavigne',
    src: 'video1.mp4',
    thumbnail: 'Avril_Lavigne_-_Bite_Me.png',
  },
  {
    id: 3,
    title: 'Bite Me',
    artist: 'Avril Lavigne',
    src: 'video2.mp4',
    thumbnail: 'image1.jpg',
  },
]

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)

  const [selectedVideo, setSelectedVideo] = useState<VideoData>(videos[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [muted, setMuted] = useState(false) 
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.pause()
    video.load() 
    video.currentTime = 0
    setCurrentTime(0)
    setDuration(0)
    setIsPlaying(false)

    const onLoadedMetadata = () => {
      setDuration(video.duration)
      video.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false)
      })
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [selectedVideo])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)

    const onEnded = () => {
      setIsPlaying(false)
      const currentIndex = videos.findIndex((v) => v.id === selectedVideo.id)
      const nextIndex = (currentIndex + 1) % videos.length
      setSelectedVideo(videos[nextIndex])
    }

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('ended', onEnded)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('ended', onEnded)
    }
  }, [selectedVideo])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused || video.ended) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const skip = (seconds: number) => {
    const video = videoRef.current
    if (video) video.currentTime += seconds
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (video) {
      video.muted = !video.muted
      setMuted(video.muted)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    const video = videoRef.current
    if (video) {
      video.volume = newVolume
      video.muted = newVolume === 0
    }
    setVolume(newVolume)
    setMuted(newVolume === 0)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    const newTime = parseFloat(e.target.value)
    if (video) {
      video.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="music-player">
      {/* Lista de vídeos */}
      <div className="video-list" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {videos.map((video) => (
          <div
            key={video.id}
            style={{
              cursor: 'pointer',
              border: video.id === selectedVideo.id ? '2px solid blue' : '1px solid gray',
              padding: '5px',
              borderRadius: '5px',
              width: '120px',
              textAlign: 'center',
            }}
            onClick={() => setSelectedVideo(video)}
          >
            <img
              src={video.thumbnail}
              alt={`Thumbnail ${video.title}`}
              style={{ width: '100%', borderRadius: '5px' }}
            />
            <div>{video.title}</div>
            <small>{video.artist}</small>
          </div>
        ))}
      </div>

      <video
        ref={videoRef}
        src={selectedVideo.src}
        className="cover"
        width="100%"
        muted={muted}
      />

      <div className="title">{selectedVideo.title}</div>
      <div className="artist">{selectedVideo.artist}</div>

      <div
        className="progress-bar"
        style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}
      >
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={currentTime}
          onChange={handleTimeChange}
          style={{ flexGrow: 1 }}
        />
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controles */}
      <div className="controls" style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={() => skip(-10)}>&laquo;</button>

        <button onClick={togglePlay} className="play-button">
          {isPlaying ? '❚❚' : '▶️'}
        </button>

        <button onClick={() => skip(10)}>&raquo;</button>

        <button onClick={toggleMute}>
          {muted ? '🔇' : '🔊'}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          style={{ width: '100px', marginLeft: '10px' }}
        />
        <span>{Math.round(volume * 100)}%</span>
      </div>
    </div>
  )
}
