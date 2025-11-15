'use client'

import { useState } from 'react'
import styled from 'styled-components'
import CoinFlip3D from '@/components/CoinFlip/CoinFlip3D'
import CoinParticles from '@/components/CoinFlip/CoinParticles'
import { useCoinFlipGame } from '@/hooks/useCoinFlipGame'
import AmountInput from '@/components/AmountInput'
import { Button } from '@heroui/react'
import { useCoreumWallet } from '@/providers/coreum'

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

  @media (max-width: 968px) {
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
  min-height: 500px;
`

const BettingPanel = styled.div`
  background: rgba(20, 25, 35, 0.8);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(37, 214, 149, 0.2);
  height: fit-content;
`

const SideSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const SideButton = styled(Button)<{ $selected: boolean }>`
  height: 80px;
  font-size: 1.5rem;
  background: ${props => props.$selected ? '#FFD700' : 'rgba(255, 215, 0, 0.1)'};
  color: ${props => props.$selected ? '#000' : '#FFD700'};
  border: 2px solid ${props => props.$selected ? '#FFD700' : 'rgba(255, 215, 0, 0.3)'};
  font-family: 'Bangers', cursive;

  &:hover:not(:disabled) {
    background: ${props => props.$selected ? '#FFA500' : 'rgba(255, 215, 0, 0.2)'};
    border-color: #FFD700;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`

const StatBox = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 10px;
  text-align: center;

  .label {
    font-size: 0.75rem;
    color: #888;
    margin-bottom: 0.25rem;
  }

  .value {
    font-size: 1.25rem;
    font-weight: bold;
    color: #25D695;
  }
`

export default function CoinFlipPage() {
  const {
    isFlipping,
    result,
    betAmount,
    selectedSide,
    currentStreak,
    placeBet,
    setBetAmount,
    setSelectedSide
  } = useCoinFlipGame()

  const { address, balance } = useCoreumWallet()
  const [showParticles, setShowParticles] = useState(false)
  const [lastWon, setLastWon] = useState(false)

  const handleFlipComplete = () => {
    const won = result === selectedSide
    setLastWon(won)
    setShowParticles(true)
    setTimeout(() => setShowParticles(false), 2000)
  }

  const handleFlipClick = () => {
    placeBet()
  }

  return (
    <Container>
      <h1 className="text-5xl font-bangers text-center mb-2" style={{ color: '#FFD700' }}>
        Ultra Coin Flip 🪙
      </h1>
      <p className="text-center text-gray-400 mb-8">
        50/50 Odds • 1.98x Multiplier • Provably Fair
      </p>

      <GameArea>
        <CoinArea>
          <CoinFlip3D
            isFlipping={isFlipping}
            result={result}
            onAnimationComplete={handleFlipComplete}
          />
          <CoinParticles trigger={showParticles} won={lastWon} />

          <div className="mt-8 text-center">
            {isFlipping ? (
              <p className="text-2xl text-[#FFD700] font-bold animate-pulse">
                Flipping...
              </p>
            ) : result ? (
              <div>
                <p className="text-3xl font-bangers mb-2" style={{ color: result === selectedSide ? '#25D695' : '#FF4444' }}>
                  {result.toUpperCase()}
                </p>
                <p className="text-xl" style={{ color: result === selectedSide ? '#25D695' : '#FF4444' }}>
                  {result === selectedSide ? '🎉 You Won!' : '😔 You Lost'}
                </p>
              </div>
            ) : (
              <p className="text-xl text-gray-400">
                Select a side and place your bet!
              </p>
            )}
          </div>

          {currentStreak > 1 && (
            <div className="mt-4 px-4 py-2 bg-[#25D695] rounded-full">
              <span className="text-black font-bold">
                🔥 {currentStreak} Win Streak!
              </span>
            </div>
          )}
        </CoinArea>

        <BettingPanel>
          <h2 className="text-2xl font-bold mb-4 text-[#25D695]">Place Your Bet</h2>

          <SideSelector>
            <SideButton
              $selected={selectedSide === 'heads'}
              onClick={() => setSelectedSide('heads')}
              disabled={isFlipping}
            >
              HEADS
            </SideButton>
            <SideButton
              $selected={selectedSide === 'tails'}
              onClick={() => setSelectedSide('tails')}
              disabled={isFlipping}
            >
              TAILS
            </SideButton>
          </SideSelector>

          <div className="mb-4">
            <label className="block mb-2 text-sm text-gray-400">Bet Amount (COREUM)</label>
            <AmountInput
              value={betAmount}
              onChange={setBetAmount}
              disabled={isFlipping}
            />
          </div>

          <StatsGrid>
            <StatBox>
              <div className="label">Multiplier</div>
              <div className="value">1.98x</div>
            </StatBox>
            <StatBox>
              <div className="label">House Edge</div>
              <div className="value">1%</div>
            </StatBox>
            <StatBox>
              <div className="label">Potential Win</div>
              <div className="value">{(betAmount * 1.98).toFixed(2)}</div>
            </StatBox>
            <StatBox>
              <div className="label">Your Balance</div>
              <div className="value">{balance ? parseFloat(balance).toFixed(2) : '0.00'}</div>
            </StatBox>
          </StatsGrid>

          <Button
            className="w-full h-14 text-xl font-bold font-bangers"
            style={{
              background: isFlipping ? '#666' : '#FFD700',
              color: '#000'
            }}
            onClick={handleFlipClick}
            disabled={isFlipping || !address}
          >
            {!address ? 'Connect Wallet' : isFlipping ? 'FLIPPING...' : 'FLIP COIN'}
          </Button>

          <div className="mt-4 p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              🔒 Provably Fair • Instant Payouts
            </p>
          </div>
        </BettingPanel>
      </GameArea>
    </Container>
  )
}
