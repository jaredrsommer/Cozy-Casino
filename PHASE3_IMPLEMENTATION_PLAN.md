# Phase 3 Games Implementation Plan
**CozyCasino - Enhanced Gaming Experience**

**Date:** 2025-11-15
**Branch:** `claude/cozycasino-coreum-rework-011CV6F6aoCoTJ2VV5MkLLiP`
**Status:** Ready for Implementation

---

## Executive Summary

This document provides a comprehensive, step-by-step implementation plan for Phase 3 Games:
1. **Ultra Coin Flip** - 3D coin flip with physics-based animations
2. **Ultra Slots** - 5-reel slot machine with jackpot mechanics
3. **3D Game Selector** - Enhanced landing page with 3D game cards

**Estimated Timeline:** 5-7 days
**Dependencies:** Phase 1 (Sound System ✅), Phase 2 (Dashboard/Leaderboard ✅)

---

## Table of Contents
1. [Technical Architecture](#1-technical-architecture)
2. [Game 1: Ultra Coin Flip](#2-ultra-coin-flip)
3. [Game 2: Ultra Slots](#3-ultra-slots)
4. [Game 3: 3D Game Selector](#4-3d-game-selector)
5. [Backend Integration](#5-backend-integration)
6. [Testing Strategy](#6-testing-strategy)
7. [Deployment Checklist](#7-deployment-checklist)

---

## 1. Technical Architecture

### 1.1 Tech Stack for Phase 3
```json
{
  "3D Animations": "Framer Motion 12.12.1 (already installed)",
  "Physics Engine": "Custom CSS3 + requestAnimationFrame",
  "Particle Effects": "Canvas API + Framer Motion",
  "State Management": "React useState + useReducer",
  "Styling": "Tailwind CSS + Styled Components",
  "Sound System": "useAdvancedSound hook (Phase 1 ✅)"
}
```

### 1.2 Folder Structure
```
/src/
├── app/
│   ├── coinflip/
│   │   └── page.tsx                 # Coin flip game page
│   ├── slots/
│   │   └── page.tsx                 # Slots game page
│   └── landing/
│       └── page.tsx                 # Enhanced with 3D selector
├── components/
│   ├── CoinFlip/
│   │   ├── CoinFlip3D.tsx          # Main coin component
│   │   ├── CoinPhysics.tsx         # Physics animation logic
│   │   ├── CoinParticles.tsx       # Particle effects on flip
│   │   └── BettingPanel.tsx        # Heads/Tails betting UI
│   ├── Slots/
│   │   ├── SlotMachine.tsx         # Main slot machine
│   │   ├── SlotReel.tsx            # Individual reel component
│   │   ├── SlotSymbol.tsx          # Symbol display
│   │   ├── WinLineAnimation.tsx    # Win line highlights
│   │   ├── JackpotDisplay.tsx      # Jackpot counter
│   │   └── PaytableModal.tsx       # Symbol payouts modal
│   └── GameSelector/
│       ├── GameSelector3D.tsx      # Enhanced game grid
│       ├── GameCard3D.tsx          # 3D flip card
│       └── GameMetadata.tsx        # Game stats overlay
├── hooks/
│   ├── useCoinFlipGame.ts          # Coin flip game logic
│   ├── useSlotsGame.ts             # Slots game logic
│   └── use3DCard.ts                # 3D card animations
└── types/
    ├── coinflip.ts                 # Coin flip types
    └── slots.ts                    # Slots types
```

### 1.3 Design Principles
- **Consistency:** Match existing Coreum branding (green #25D695, gold #FFD700)
- **Responsiveness:** Mobile-first design with desktop enhancements
- **Performance:** 60fps animations, lazy loading for heavy assets
- **Accessibility:** Keyboard navigation, screen reader support
- **Provably Fair:** Client seed + server seed verification

---

## 2. Ultra Coin Flip

### 2.1 Game Mechanics
```typescript
interface CoinFlipGame {
  // Game parameters
  minBet: 0.1 COREUM
  maxBet: 1000 COREUM
  multiplier: 1.98x (1% house edge)
  outcomes: ['heads', 'tails']
  fairnessMode: 'provably-fair'
}
```

### 2.2 User Flow
1. User connects Coreum wallet
2. User enters bet amount
3. User selects Heads or Tails
4. User clicks "Flip Coin"
5. 3D coin animation plays (2-3 seconds)
6. Result revealed with particle effects
7. Win/loss notification + balance update
8. Auto-bet option for multiple flips

### 2.3 Component Implementation

#### 2.3.1 CoinFlip3D.tsx
```typescript
'use client'

import { motion } from 'framer-motion'
import styled from 'styled-components'

interface CoinFlip3DProps {
  isFlipping: boolean
  result: 'heads' | 'tails' | null
  onAnimationComplete: () => void
}

const Coin3DContainer = styled.div`
  perspective: 1000px;
  width: 300px;
  height: 300px;
  margin: 0 auto;
`

const CoinInner = styled(motion.div)<{ result: string }>`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  ${props => props.result === 'heads' && `
    transform: rotateY(3600deg);
  `}

  ${props => props.result === 'tails' && `
    transform: rotateY(3780deg);
  `}
`

const CoinFace = styled.div<{ isHeads: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: bold;
  background: linear-gradient(145deg, #FFD700, #FFA500);
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);

  ${props => !props.isHeads && `
    transform: rotateY(180deg);
  `}
`

export default function CoinFlip3D({ isFlipping, result, onAnimationComplete }: CoinFlip3DProps) {
  return (
    <Coin3DContainer>
      <CoinInner result={result || ''} onAnimationComplete={onAnimationComplete}>
        <CoinFace isHeads={true}>
          <span>H</span>
        </CoinFace>
        <CoinFace isHeads={false}>
          <span>T</span>
        </CoinFace>
      </CoinInner>
    </Coin3DContainer>
  )
}
```

#### 2.3.2 CoinParticles.tsx
```typescript
'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}

export default function CoinParticles({ trigger }: { trigger: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!trigger || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const particles: Particle[] = []

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        color: `hsl(${Math.random() * 60 + 30}, 100%, 50%)`
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.2 // gravity
        p.life -= 0.02

        if (p.life <= 0) {
          particles.splice(i, 1)
        } else {
          ctx.globalAlpha = p.life
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      if (particles.length > 0) requestAnimationFrame(animate)
    }

    animate()
  }, [trigger])

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      className="absolute inset-0 pointer-events-none"
    />
  )
}
```

#### 2.3.3 useCoinFlipGame.ts
```typescript
'use client'

import { useState } from 'react'
import { useCoreumWallet } from '@/providers/coreum'
import { useAdvancedSound } from '@/hooks/useAdvancedSound'
import axios from '@/util/axios'
import { showSuccess, showError } from '@/util/toast'

interface CoinFlipState {
  isFlipping: boolean
  result: 'heads' | 'tails' | null
  betAmount: number
  selectedSide: 'heads' | 'tails'
  isAutoBetting: boolean
  autoBetCount: number
  currentStreak: number
}

export function useCoinFlipGame() {
  const { address, balance } = useCoreumWallet()
  const { playSoundEffect } = useAdvancedSound()

  const [state, setState] = useState<CoinFlipState>({
    isFlipping: false,
    result: null,
    betAmount: 1,
    selectedSide: 'heads',
    isAutoBetting: false,
    autoBetCount: 0,
    currentStreak: 0
  })

  const placeBet = async () => {
    if (!address) {
      showError('Please connect your wallet')
      return
    }

    if (state.betAmount <= 0) {
      showError('Invalid bet amount')
      return
    }

    setState(prev => ({ ...prev, isFlipping: true, result: null }))
    playSoundEffect('bet')

    try {
      const response = await axios.post('/coinflip/bet', {
        amount: state.betAmount,
        choice: state.selectedSide,
        address
      })

      const { result, won, payout } = response.data

      // Simulate flip animation (2 seconds)
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          isFlipping: false,
          result,
          currentStreak: won ? prev.currentStreak + 1 : 0
        }))

        if (won) {
          playSoundEffect('win')
          showSuccess(`You won ${payout} COREUM!`)
        } else {
          playSoundEffect('loss')
          showError('Better luck next time!')
        }
      }, 2000)
    } catch (error) {
      setState(prev => ({ ...prev, isFlipping: false }))
      playSoundEffect('error')
      showError('Failed to place bet')
    }
  }

  const setBetAmount = (amount: number) => {
    setState(prev => ({ ...prev, betAmount: amount }))
  }

  const setSelectedSide = (side: 'heads' | 'tails') => {
    setState(prev => ({ ...prev, selectedSide: side }))
  }

  const toggleAutoBet = () => {
    setState(prev => ({ ...prev, isAutoBetting: !prev.isAutoBetting }))
  }

  return {
    ...state,
    placeBet,
    setBetAmount,
    setSelectedSide,
    toggleAutoBet
  }
}
```

#### 2.3.4 /src/app/coinflip/page.tsx
```typescript
'use client'

import { useState } from 'react'
import styled from 'styled-components'
import CoinFlip3D from '@/components/CoinFlip/CoinFlip3D'
import CoinParticles from '@/components/CoinFlip/CoinParticles'
import { useCoinFlipGame } from '@/hooks/useCoinFlipGame'
import AmountInput from '@/components/AmountInput'
import { Button } from '@heroui/react'

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #030612 0%, #0e141d 100%);
  padding: 2rem;
`

const GameArea = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const CoinArea = styled.div`
  background: rgba(20, 25, 35, 0.5);
  border-radius: 20px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid rgba(37, 214, 149, 0.2);
`

const BettingPanel = styled.div`
  background: rgba(20, 25, 35, 0.8);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(37, 214, 149, 0.2);
`

const SideSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const SideButton = styled(Button)<{ selected: boolean }>`
  height: 80px;
  font-size: 1.5rem;
  background: ${props => props.selected ? '#25D695' : 'rgba(37, 214, 149, 0.1)'};
  border: 2px solid ${props => props.selected ? '#25D695' : 'rgba(37, 214, 149, 0.3)'};

  &:hover {
    background: ${props => props.selected ? '#25D695' : 'rgba(37, 214, 149, 0.2)'};
  }
`

export default function CoinFlipPage() {
  const {
    isFlipping,
    result,
    betAmount,
    selectedSide,
    placeBet,
    setBetAmount,
    setSelectedSide
  } = useCoinFlipGame()

  const [showParticles, setShowParticles] = useState(false)

  const handleFlipComplete = () => {
    setShowParticles(true)
    setTimeout(() => setShowParticles(false), 1000)
  }

  return (
    <Container>
      <h1 className="text-5xl font-bangers text-center mb-8 text-[#25D695]">
        Ultra Coin Flip 🪙
      </h1>

      <GameArea>
        <CoinArea>
          <CoinFlip3D
            isFlipping={isFlipping}
            result={result}
            onAnimationComplete={handleFlipComplete}
          />
          <CoinParticles trigger={showParticles} />

          <div className="mt-8 text-center">
            <p className="text-2xl text-gray-400">
              {isFlipping ? 'Flipping...' : result ? `Result: ${result.toUpperCase()}` : 'Place your bet!'}
            </p>
          </div>
        </CoinArea>

        <BettingPanel>
          <h2 className="text-2xl font-bold mb-4 text-[#25D695]">Place Your Bet</h2>

          <SideSelector>
            <SideButton
              selected={selectedSide === 'heads'}
              onClick={() => setSelectedSide('heads')}
              disabled={isFlipping}
            >
              Heads
            </SideButton>
            <SideButton
              selected={selectedSide === 'tails'}
              onClick={() => setSelectedSide('tails')}
              disabled={isFlipping}
            >
              Tails
            </SideButton>
          </SideSelector>

          <div className="mb-4">
            <label className="block mb-2 text-sm text-gray-400">Bet Amount</label>
            <AmountInput
              value={betAmount}
              onChange={setBetAmount}
              disabled={isFlipping}
            />
          </div>

          <div className="mb-4 p-4 bg-black/30 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Multiplier:</span>
              <span className="text-white font-bold">1.98x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Potential Win:</span>
              <span className="text-[#25D695] font-bold">
                {(betAmount * 1.98).toFixed(2)} COREUM
              </span>
            </div>
          </div>

          <Button
            className="w-full h-14 text-xl font-bold"
            color="success"
            onClick={placeBet}
            disabled={isFlipping}
          >
            {isFlipping ? 'Flipping...' : 'Flip Coin'}
          </Button>
        </BettingPanel>
      </GameArea>
    </Container>
  )
}
```

### 2.4 Backend Integration

**Endpoint:** `POST /api/coinflip/bet`

**Request:**
```typescript
{
  amount: number,        // Bet amount in COREUM
  choice: 'heads' | 'tails',
  address: string,       // User's wallet address
  publicSeed?: string    // Optional: user-provided seed
}
```

**Response:**
```typescript
{
  result: 'heads' | 'tails',
  won: boolean,
  payout: number,
  balance: number,       // Updated balance
  privateSeed: string,   // For provably fair verification
  privateHash: string
}
```

---

## 3. Ultra Slots

### 3.1 Game Mechanics
```typescript
interface SlotsGame {
  reels: 5
  rows: 3
  paylines: 20
  minBet: 0.1 COREUM (per line)
  maxBet: 100 COREUM (per line)
  maxWin: 1000x
  jackpot: Progressive or Fixed
  rtp: 96%
}

const symbols = {
  jackpot: { payout: 1000, probability: 0.001, icon: '💎' },
  diamond: { payout: 100, probability: 0.01, icon: '💠' },
  seven: { payout: 50, probability: 0.02, icon: '7️⃣' },
  bar: { payout: 25, probability: 0.05, icon: '▰' },
  lemon: { payout: 10, probability: 0.1, icon: '🍋' },
  cherry: { payout: 5, probability: 0.2, icon: '🍒' },
  scatter: { payout: 0, probability: 0.05, icon: '⭐', bonus: 'free_spins' }
}
```

### 3.2 Component Structure

#### 3.2.1 SlotMachine.tsx
```typescript
'use client'

import { motion } from 'framer-motion'
import styled from 'styled-components'
import SlotReel from './SlotReel'

const MachineContainer = styled.div`
  background: linear-gradient(145deg, #1a1f2e, #0f1419);
  border-radius: 30px;
  padding: 3rem;
  border: 3px solid #FFD700;
  box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3);
  max-width: 900px;
  margin: 0 auto;
`

const ReelContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  background: #000;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 2rem;
`

const WinDisplay = styled(motion.div)`
  text-align: center;
  font-size: 3rem;
  font-weight: bold;
  color: #FFD700;
  margin-bottom: 1rem;
`

interface SlotMachineProps {
  isSpinning: boolean
  reels: string[][]
  winLines: WinLine[]
  onSpinComplete: () => void
}

export default function SlotMachine({ isSpinning, reels, winLines, onSpinComplete }: SlotMachineProps) {
  return (
    <MachineContainer>
      <WinDisplay
        initial={{ scale: 0 }}
        animate={{ scale: winLines.length > 0 ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {winLines.length > 0 && `WIN! ${winLines.reduce((sum, line) => sum + line.payout, 0).toFixed(2)} COREUM`}
      </WinDisplay>

      <ReelContainer>
        {reels.map((reel, index) => (
          <SlotReel
            key={index}
            symbols={reel}
            isSpinning={isSpinning}
            delay={index * 0.2}
            onComplete={index === 4 ? onSpinComplete : undefined}
          />
        ))}
      </ReelContainer>
    </MachineContainer>
  )
}
```

#### 3.2.2 SlotReel.tsx
```typescript
'use client'

import { motion } from 'framer-motion'
import styled from 'styled-components'
import { useEffect, useState } from 'react'

const ReelColumn = styled.div`
  height: 300px;
  overflow: hidden;
  border-radius: 10px;
  background: linear-gradient(180deg, #1a1f2e 0%, #0f1419 100%);
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
    z-index: 1;
  }

  &::before { top: 0; }
  &::after {
    bottom: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  }
`

const ReelStrip = styled(motion.div)`
  display: flex;
  flex-direction: column;
`

const Symbol = styled.div`
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
`

interface SlotReelProps {
  symbols: string[]
  isSpinning: boolean
  delay: number
  onComplete?: () => void
}

export default function SlotReel({ symbols, isSpinning, delay, onComplete }: SlotReelProps) {
  const [displaySymbols, setDisplaySymbols] = useState(symbols)

  const allSymbols = ['💎', '💠', '7️⃣', '▰', '🍋', '🍒', '⭐']

  useEffect(() => {
    if (isSpinning) {
      // Create spinning effect with many symbols
      const spinSymbols = []
      for (let i = 0; i < 20; i++) {
        spinSymbols.push(allSymbols[Math.floor(Math.random() * allSymbols.length)])
      }
      setDisplaySymbols([...spinSymbols, ...symbols])
    } else {
      setDisplaySymbols(symbols)
    }
  }, [isSpinning, symbols])

  return (
    <ReelColumn>
      <ReelStrip
        animate={{
          y: isSpinning ? -2000 : 0
        }}
        transition={{
          duration: isSpinning ? 2 + delay : 0.3,
          ease: isSpinning ? 'linear' : 'easeOut',
          delay: isSpinning ? delay : 0
        }}
        onAnimationComplete={onComplete}
      >
        {displaySymbols.map((symbol, i) => (
          <Symbol key={i}>{symbol}</Symbol>
        ))}
      </ReelStrip>
    </ReelColumn>
  )
}
```

#### 3.2.3 /src/app/slots/page.tsx
```typescript
'use client'

import { useState } from 'react'
import styled from 'styled-components'
import SlotMachine from '@/components/Slots/SlotMachine'
import { useSlotsGame } from '@/hooks/useSlotsGame'
import AmountInput from '@/components/AmountInput'
import { Button } from '@heroui/react'
import PaytableModal from '@/components/Slots/PaytableModal'

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #030612 0%, #0e141d 100%);
  padding: 2rem;
`

const GameArea = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`

const ControlPanel = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  background: rgba(20, 25, 35, 0.8);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(37, 214, 149, 0.2);
  display: grid;
  grid-template-columns: 1fr 1fr 200px;
  gap: 1rem;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export default function SlotsPage() {
  const {
    isSpinning,
    reels,
    winLines,
    betAmount,
    totalPayout,
    spin,
    setBetAmount
  } = useSlotsGame()

  const [showPaytable, setShowPaytable] = useState(false)

  return (
    <Container>
      <h1 className="text-5xl font-bangers text-center mb-8 text-[#FFD700]">
        Ultra Slots 🎰
      </h1>

      <GameArea>
        <SlotMachine
          isSpinning={isSpinning}
          reels={reels}
          winLines={winLines}
          onSpinComplete={() => {}}
        />

        <ControlPanel>
          <div>
            <label className="block mb-2 text-sm text-gray-400">Bet per Line</label>
            <AmountInput
              value={betAmount}
              onChange={setBetAmount}
              disabled={isSpinning}
            />
            <p className="text-xs text-gray-500 mt-1">
              Total Bet: {(betAmount * 20).toFixed(2)} COREUM (20 lines)
            </p>
          </div>

          <div className="p-4 bg-black/30 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Max Win:</span>
              <span className="text-[#FFD700] font-bold">1000x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">RTP:</span>
              <span className="text-white font-bold">96%</span>
            </div>
          </div>

          <Button
            className="h-14 text-xl font-bold"
            color="warning"
            onClick={spin}
            disabled={isSpinning}
          >
            {isSpinning ? 'Spinning...' : 'SPIN'}
          </Button>
        </ControlPanel>

        <div className="text-center mt-4">
          <button
            className="text-[#25D695] underline"
            onClick={() => setShowPaytable(true)}
          >
            View Paytable
          </button>
        </div>
      </GameArea>

      {showPaytable && (
        <PaytableModal onClose={() => setShowPaytable(false)} />
      )}
    </Container>
  )
}
```

### 3.3 Backend Integration

**Endpoint:** `POST /api/slots/spin`

**Request:**
```typescript
{
  amount: number,        // Bet amount per line
  lines: number,         // Number of paylines (1-20)
  address: string
}
```

**Response:**
```typescript
{
  reels: [
    ['🍒', '🍋', '7️⃣'],  // Reel 1
    ['💎', '🍒', '▰'],   // Reel 2
    ['🍋', '7️⃣', '💠'],  // Reel 3
    ['🍒', '🍋', '🍒'],  // Reel 4
    ['7️⃣', '💎', '🍋']   // Reel 5
  ],
  winLines: [
    { line: 1, symbols: ['🍒', '🍒', '🍒'], payout: 50 }
  ],
  totalPayout: 50,
  bonusTriggered: false,
  balance: number
}
```

---

## 4. 3D Game Selector

### 4.1 Enhanced Landing Page Design

**Goal:** Transform the existing landing page game grid into an interactive 3D experience.

### 4.2 Component Implementation

#### 4.2.1 GameCard3D.tsx
```typescript
'use client'

import { motion } from 'framer-motion'
import styled from 'styled-components'
import { useState } from 'react'
import Link from 'next/link'

const CardContainer = styled(motion.div)`
  perspective: 1000px;
  height: 350px;
  cursor: pointer;
`

const CardInner = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: rotateY(10deg) rotateX(5deg) scale(1.05);
  }
`

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid rgba(37, 214, 149, 0.3);
  background: linear-gradient(145deg, #1a1f2e, #0f1419);
`

const CardFront = styled(CardFace)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
`

const CardBack = styled(CardFace)`
  transform: rotateY(180deg);
  padding: 1.5rem;
  background: linear-gradient(145deg, #25D695, #1a9d6f);
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const GameIcon = styled.div`
  font-size: 5rem;
  text-align: center;
  margin-bottom: 1rem;
`

const GameTitle = styled.h3`
  font-size: 2rem;
  font-family: 'Bangers', cursive;
  text-align: center;
  color: #25D695;
  margin-bottom: 1rem;
`

const GameStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  font-size: 0.875rem;
`

const StatItem = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem;
  border-radius: 8px;
  text-align: center;

  .label {
    color: #888;
    font-size: 0.75rem;
  }

  .value {
    color: #fff;
    font-weight: bold;
  }
`

const TagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`

const Tag = styled.span<{ variant: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;

  ${props => props.variant === 'new' && `
    background: #FFD700;
    color: #000;
  `}

  ${props => props.variant === 'hot' && `
    background: #FF4500;
    color: #fff;
  `}

  ${props => props.variant === 'live' && `
    background: #25D695;
    color: #000;
  `}
`

const PlayButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #25D695;
  color: #000;
  font-weight: bold;
  font-size: 1.25rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #1eb87a;
    transform: scale(1.05);
  }
`

interface GameCard3DProps {
  game: {
    id: string
    name: string
    path: string
    icon: string
    difficulty: 'easy' | 'medium' | 'hard'
    minBet: number
    maxPayout: number
    houseEdge: number
    tags: ('new' | 'hot' | 'live')[]
    activePlayers: number
  }
}

export default function GameCard3D({ game }: GameCard3DProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <Link href={game.path}>
      <CardContainer
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <CardInner style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)' }}>
          <CardFront>
            <div>
              <GameIcon>{game.icon}</GameIcon>
              <GameTitle>{game.name}</GameTitle>

              <TagsContainer>
                {game.tags.map(tag => (
                  <Tag key={tag} variant={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                ))}
              </TagsContainer>
            </div>

            <GameStats>
              <StatItem>
                <div className="label">Min Bet</div>
                <div className="value">{game.minBet} COREUM</div>
              </StatItem>
              <StatItem>
                <div className="label">Max Win</div>
                <div className="value">{game.maxPayout}x</div>
              </StatItem>
              <StatItem>
                <div className="label">House Edge</div>
                <div className="value">{game.houseEdge}%</div>
              </StatItem>
              <StatItem>
                <div className="label">Playing Now</div>
                <div className="value">{game.activePlayers}</div>
              </StatItem>
            </GameStats>
          </CardFront>

          <CardBack>
            <p className="text-center mb-4 text-white text-lg">
              Difficulty: <strong>{game.difficulty.toUpperCase()}</strong>
            </p>
            <PlayButton>
              PLAY NOW
            </PlayButton>
          </CardBack>
        </CardInner>
      </CardContainer>
    </Link>
  )
}
```

#### 4.2.2 Enhanced Landing Page
```typescript
// /src/app/landing/page.tsx - Add 3D game selector

const gameMetadata = [
  {
    id: 'crash',
    name: 'Crash Game',
    path: '/crash',
    icon: '🚀',
    difficulty: 'medium',
    minBet: 0.1,
    maxPayout: 1000,
    houseEdge: 1,
    tags: ['hot', 'live'],
    activePlayers: 127
  },
  {
    id: 'coinflip',
    name: 'Ultra Coin Flip',
    path: '/coinflip',
    icon: '🪙',
    difficulty: 'easy',
    minBet: 0.1,
    maxPayout: 1.98,
    houseEdge: 1,
    tags: ['new'],
    activePlayers: 45
  },
  {
    id: 'slots',
    name: 'Ultra Slots',
    path: '/slots',
    icon: '🎰',
    difficulty: 'easy',
    minBet: 0.1,
    maxPayout: 1000,
    houseEdge: 4,
    tags: ['new', 'hot'],
    activePlayers: 89
  },
  // ... other games
]

// In the component:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
  {gameMetadata.map(game => (
    <GameCard3D key={game.id} game={game} />
  ))}
</div>
```

---

## 5. Backend Integration

### 5.1 API Endpoints Summary

| Endpoint | Method | Purpose | Request Body |
|----------|--------|---------|-------------|
| `/api/coinflip/bet` | POST | Place coin flip bet | `{ amount, choice, address }` |
| `/api/slots/spin` | POST | Spin slot machine | `{ amount, lines, address }` |
| `/api/slots/jackpot` | GET | Get current jackpot | - |
| `/api/games/metadata` | GET | Get game metadata | - |
| `/api/games/active-players` | GET | Get active player counts | - |

### 5.2 Provably Fair Implementation

Each game will implement provably fair mechanics:

```typescript
// Client-side verification
function verifyCoinFlip(publicSeed: string, privateSeed: string, privateHash: string) {
  const combinedSeed = publicSeed + privateSeed
  const hash = sha256(combinedSeed)
  const result = parseInt(hash.substring(0, 8), 16) % 2 === 0 ? 'heads' : 'tails'

  return {
    result,
    isValid: sha256(privateSeed) === privateHash
  }
}
```

---

## 6. Testing Strategy

### 6.1 Unit Tests
```typescript
// __tests__/useCoinFlipGame.test.ts
describe('useCoinFlipGame', () => {
  it('should place bet correctly', async () => {
    // Test logic
  })

  it('should handle insufficient balance', async () => {
    // Test logic
  })

  it('should calculate winnings correctly', () => {
    // Test logic
  })
})
```

### 6.2 Component Tests
```typescript
// __tests__/CoinFlip3D.test.tsx
describe('CoinFlip3D', () => {
  it('should render coin faces', () => {
    // Test render
  })

  it('should animate on flip', () => {
    // Test animation
  })
})
```

### 6.3 E2E Tests
```typescript
// e2e/coinflip.spec.ts
test('complete coin flip game flow', async ({ page }) => {
  await page.goto('/coinflip')
  await page.click('button:has-text("Heads")')
  await page.fill('input[name="betAmount"]', '1')
  await page.click('button:has-text("Flip Coin")')
  await page.waitForSelector('.result')
  // Assert result
})
```

---

## 7. Deployment Checklist

### 7.1 Pre-deployment
- [ ] All components built and tested
- [ ] Backend endpoints deployed and tested
- [ ] 3D animations optimized (60fps)
- [ ] Mobile responsiveness verified
- [ ] Provably fair verification working
- [ ] Sound effects integrated
- [ ] Toast notifications working
- [ ] Wallet integration tested

### 7.2 Performance Targets
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Animations running at 60fps
- [ ] Bundle size < 150KB (per game page)

### 7.3 Post-deployment
- [ ] Monitor error logs
- [ ] Track game play metrics
- [ ] Verify bet/payout accuracy
- [ ] Check animation performance on mobile
- [ ] Monitor API response times

---

## 8. Implementation Timeline

### Day 1-2: Ultra Coin Flip
- ✅ Create folder structure
- ✅ Implement CoinFlip3D component
- ✅ Add particle effects
- ✅ Build betting panel
- ✅ Integrate with backend API
- ✅ Add sound effects
- ✅ Testing

### Day 3-5: Ultra Slots
- ✅ Create slot machine structure
- ✅ Implement reel spinning animation
- ✅ Add win line detection
- ✅ Build paytable modal
- ✅ Jackpot display
- ✅ Backend integration
- ✅ Testing

### Day 6-7: 3D Game Selector
- ✅ Create GameCard3D component
- ✅ Add flip animations
- ✅ Implement game metadata
- ✅ Update landing page
- ✅ Add live player counts
- ✅ Final polish

---

## 9. Success Metrics

### KPIs to Track
1. **Game Adoption Rate**
   - Coin Flip plays per day
   - Slots plays per day
   - Conversion from landing page

2. **User Engagement**
   - Average session duration
   - Games played per session
   - Return rate (7-day)

3. **Technical Performance**
   - Average load time
   - Animation frame rate
   - API response time

4. **Business Metrics**
   - Total bet volume
   - House edge verification
   - Payout accuracy

---

## 10. Risk Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| 3D animations lag on mobile | Medium | High | Implement fallback 2D mode |
| High bundle size | Medium | Medium | Code splitting, lazy loading |
| Backend API delays | High | Low | Client-side prediction, optimistic UI |
| Provably fair disputes | High | Low | Detailed verification UI + docs |

---

## Conclusion

This plan provides a comprehensive roadmap for implementing Phase 3 Games for CozyCasino. The implementation focuses on:
- **User Experience:** Smooth 3D animations, engaging gameplay
- **Performance:** Optimized for mobile and desktop
- **Fairness:** Provably fair mechanics with client verification
- **Integration:** Seamless integration with existing Coreum wallet system

**Next Steps:**
1. Review and approve this plan
2. Set up backend API endpoints
3. Begin Day 1 implementation (Ultra Coin Flip)
4. Iterate based on testing feedback

---

**Document Version:** 1.0
**Created:** 2025-11-15
**Status:** ✅ Ready for Implementation
