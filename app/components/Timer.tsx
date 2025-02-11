"use client"

import { useState, useEffect } from "react"

export default function Timer({ isTraining, startTime }) {
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    let interval

    if (isTraining && startTime) {
      interval = setInterval(() => {
        const now = new Date()
        const diff = now.getTime() - startTime.getTime()
        setDuration(Math.floor(diff / 1000))
      }, 1000)
    } else {
      setDuration(0)
    }

    return () => clearInterval(interval)
  }, [isTraining, startTime])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="text-center mb-4">
      <h2 className="text-xl font-semibold">{isTraining ? "Training in Progress" : "Ready to Start"}</h2>
      <p className="text-3xl font-bold">{formatTime(duration)}</p>
    </div>
  )
}

