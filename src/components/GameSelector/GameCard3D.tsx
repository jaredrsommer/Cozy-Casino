'use client'

import { motion } from 'framer-motion'
import styled from 'styled-components'
import { useState } from 'react'
import Link from 'next/link'
import type { GameMetadata } from '@/types/games'

const CardContainer = styled(motion.div)`
  perspective: 1000px;
  height: 400px;
  cursor: pointer;

  @media (max-width: 768px) {
    height: 350px;
  }
`

const CardInner = styled(motion.div)<{ $isFlipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: ${props => props.$isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};

  &:hover {
    transform: ${props => props.$isFlipped ? 'rotateY(180deg)' : 'rotateY(10deg) rotateX(5deg)'} scale(1.02);
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
  transition: border-color 0.3s;

  &:hover {
    border-color: rgba(37, 214, 149, 0.6);
  }
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
  align-items: center;
  text-align: center;
`

const GameIcon = styled.div`
  font-size: 5rem;
  text-align: center;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 4rem;
  }
`

const GameTitle = styled.h3`
  font-size: 2rem;
  font-family: 'Bangers', cursive;
  text-align: center;
  color: #25D695;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

const GameDescription = styled.p`
  font-size: 0.875rem;
  color: #888;
  text-align: center;
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
    margin-top: 0.25rem;
  }
`

const TagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  justify-content: center;
`

const Tag = styled.span<{ $variant: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;

  ${props => props.$variant === 'new' && `
    background: #FFD700;
    color: #000;
  `}

  ${props => props.$variant === 'hot' && `
    background: #FF4500;
    color: #fff;
  `}

  ${props => props.$variant === 'live' && `
    background: #25D695;
    color: #000;
  `}

  ${props => props.$variant === 'jackpot' && `
    background: linear-gradient(90deg, #FFD700, #FFA500);
    color: #000;
    animation: pulse 2s infinite;
  `}

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`

const PlayButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: #000;
  color: #fff;
  font-weight: bold;
  font-size: 1.25rem;
  border: 2px solid #fff;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Bangers', cursive;
  margin-top: auto;

  &:hover {
    background: #fff;
    color: #000;
  }
`

const DifficultyBadge = styled.div<{ $difficulty: string }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;

  ${props => props.$difficulty === 'easy' && `
    background: #25D695;
    color: #000;
  `}

  ${props => props.$difficulty === 'medium' && `
    background: #FFA500;
    color: #000;
  `}

  ${props => props.$difficulty === 'hard' && `
    background: #FF4500;
    color: #fff;
  `}
`

interface GameCard3DProps {
  game: GameMetadata
}

export default function GameCard3D({ game }: GameCard3DProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <Link href={game.path} style={{ textDecoration: 'none' }}>
      <CardContainer
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <CardInner $isFlipped={isFlipped}>
          <CardFront>
            <DifficultyBadge $difficulty={game.difficulty}>
              {game.difficulty.toUpperCase()}
            </DifficultyBadge>

            <div>
              <GameIcon>{game.icon}</GameIcon>
              <GameTitle>{game.name}</GameTitle>
              <GameDescription>{game.description}</GameDescription>

              <TagsContainer>
                {game.tags.map(tag => (
                  <Tag key={tag} $variant={tag}>
                    {tag === 'new' && '🆕 '}
                    {tag === 'hot' && '🔥 '}
                    {tag === 'live' && '🟢 '}
                    {tag === 'jackpot' && '💰 '}
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
            <GameIcon>{game.icon}</GameIcon>
            <GameTitle style={{ color: '#000', fontSize: '2.5rem' }}>
              {game.name}
            </GameTitle>
            <p className="text-black mb-4 text-lg font-semibold">
              Difficulty: {game.difficulty.toUpperCase()}
            </p>
            <p className="text-black/80 mb-6 text-sm">
              {game.description}
            </p>
            <PlayButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              PLAY NOW
            </PlayButton>
          </CardBack>
        </CardInner>
      </CardContainer>
    </Link>
  )
}
