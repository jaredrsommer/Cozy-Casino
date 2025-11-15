'use client'

import { motion } from 'framer-motion'
import styled from 'styled-components'
import { useEffect, useState } from 'react'

interface CoinFlip3DProps {
  isFlipping: boolean
  result: 'heads' | 'tails' | null
  onAnimationComplete?: () => void
}

const Coin3DContainer = styled.div`
  perspective: 1000px;
  width: 250px;
  height: 250px;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`

const CoinInner = styled(motion.div)<{ $rotations: number }>`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: rotateY(${props => props.$rotations}deg);
`

const CoinFace = styled.div<{ $isHeads: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  font-weight: bold;
  background: linear-gradient(145deg, #FFD700, #FFA500);
  box-shadow: 0 10px 40px rgba(255, 215, 0, 0.5);
  border: 8px solid #B8860B;

  ${props => !props.$isHeads && `
    transform: rotateY(180deg);
    background: linear-gradient(145deg, #C0C0C0, #A8A8A8);
    border-color: #808080;
  `}

  @media (max-width: 768px) {
    font-size: 3.5rem;
    border-width: 6px;
  }
`

const CoinText = styled.span`
  font-family: 'Bangers', cursive;
  color: #000;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`

export default function CoinFlip3D({ isFlipping, result, onAnimationComplete }: CoinFlip3DProps) {
  const [rotations, setRotations] = useState(0)

  useEffect(() => {
    if (isFlipping && result) {
      // Calculate final rotation: 10 full spins + final position
      const baseRotation = 3600 // 10 full spins
      const finalPosition = result === 'heads' ? 0 : 180
      setRotations(baseRotation + finalPosition)

      // Call onAnimationComplete after animation finishes
      if (onAnimationComplete) {
        setTimeout(onAnimationComplete, 2500)
      }
    } else if (!isFlipping && !result) {
      // Reset to initial position
      setRotations(0)
    }
  }, [isFlipping, result, onAnimationComplete])

  return (
    <Coin3DContainer>
      <CoinInner $rotations={rotations}>
        <CoinFace $isHeads={true}>
          <CoinText>H</CoinText>
        </CoinFace>
        <CoinFace $isHeads={false}>
          <CoinText>T</CoinText>
        </CoinFace>
      </CoinInner>
    </Coin3DContainer>
  )
}
