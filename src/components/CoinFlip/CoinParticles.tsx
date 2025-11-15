'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
  size: number
}

interface CoinParticlesProps {
  trigger: boolean
  won?: boolean
}

export default function CoinParticles({ trigger, won }: CoinParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!trigger || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles: Particle[] = []
    const colors = won
      ? ['#FFD700', '#FFA500', '#25D695', '#00e701']
      : ['#888', '#666', '#444']

    // Create particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12 - 3,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2
      })
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        p.x += p.vx
        p.y += p.vy
        p.vy += 0.3 // gravity
        p.vx *= 0.99 // air resistance
        p.life -= 0.015

        if (p.life <= 0) {
          particles.splice(i, 1)
        } else {
          ctx.globalAlpha = p.life
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [trigger, won])

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      className="absolute inset-0 pointer-events-none"
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
    />
  )
}
