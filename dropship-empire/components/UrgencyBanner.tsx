'use client'

import { useState, useEffect } from 'react'
import { Clock, Flame } from 'lucide-react'

export default function UrgencyBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 34,
    seconds: 59
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else {
          // Reset timer when it reaches 0
          return { hours: 2, minutes: 34, seconds: 59 }
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 text-sm md:text-base">
          <Flame className="w-5 h-5 animate-pulse" />
          <span className="font-bold">FLASH SALE!</span>
          <span>Termina em:</span>
          <div className="flex items-center gap-1 font-mono font-bold">
            <Clock className="w-4 h-4" />
            <span className="bg-black/20 px-2 py-1 rounded">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="bg-black/20 px-2 py-1 rounded">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="bg-black/20 px-2 py-1 rounded">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
          <span className="hidden md:inline">Use código: <span className="font-bold">FLASH70</span></span>
        </div>
      </div>
    </div>
  )
}