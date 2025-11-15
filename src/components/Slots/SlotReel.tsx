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
  border: 2px solid rgba(255, 215, 0, 0.3);

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
    z-index: 1;
    pointer-events: none;
  }

  &::before { top: 0; }
  &::after {
    bottom: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  }

  @media (max-width: 768px) {
    height: 200px;
  }
`

const ReelStrip = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: relative;
`

const Symbol = styled.div`
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);

  @media (max-width: 768px) {
    height: 66.67px;
    font-size: 2.5rem;
  }
`

interface SlotReelProps {
  symbols: string[]
  isSpinning: boolean
  delay: number
  onComplete?: () => void
}

const ALL_SYMBOLS = ['💎', '💠', '7️⃣', '▰', '🍋', '🍒', '⭐']

export default function SlotReel({ symbols, isSpinning, delay, onComplete }: SlotReelProps) {
  const [displaySymbols, setDisplaySymbols] = useState<string[]>(symbols)

  useEffect(() => {
    if (isSpinning) {
      // Create spinning effect with many random symbols
      const spinSymbols: string[] = []
      for (let i = 0; i < 30; i++) {
        spinSymbols.push(ALL_SYMBOLS[Math.floor(Math.random() * ALL_SYMBOLS.length)])
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
          y: isSpinning ? -3000 : 0
        }}
        transition={{
          duration: isSpinning ? 2.5 + delay : 0.3,
          ease: isSpinning ? 'linear' : 'easeOut',
          delay: isSpinning ? delay : 0
        }}
        onAnimationComplete={onComplete}
      >
        {displaySymbols.map((symbol, i) => (
          <Symbol key={`${symbol}-${i}`}>{symbol}</Symbol>
        ))}
      </ReelStrip>
    </ReelColumn>
  )
}
