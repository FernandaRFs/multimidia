'use client'

import './globals.css'
import { useRef, useState, useEffect } from 'react'

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

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

  
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const setVideoDuration = () => setDuration(video.duration)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', setVideoDuration)
    video.addEventListener('ended', () => setIsPlaying(false))

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', setVideoDuration)
    }
  }, [])

  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="music-player">
      <video
        ref={videoRef}
        src="/video.mp4"
        className="cover"
        width="100%"
      />

      <div className="title">sk8er boi</div>
      <div className="artist">Avril Lavigne</div>

      {/* Barra de tempo */}
      <div className="progress-bar" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

      <div className="controls">
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
