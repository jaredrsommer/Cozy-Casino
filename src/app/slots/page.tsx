'use client'

import { useState } from 'react'
import styled from 'styled-components'
import SlotMachine from '@/components/Slots/SlotMachine'
import PaytableModal from '@/components/Slots/PaytableModal'
import { useSlotsGame } from '@/hooks/useSlotsGame'
import AmountInput from '@/components/AmountInput'
import { Button } from '@heroui/react'
import { useCoreumWallet } from '@/providers/coreum'

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
  border: 1px solid rgba(255, 215, 0, 0.3);
  display: grid;
  grid-template-columns: 1fr 1fr 200px;
  gap: 1rem;
  align-items: end;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`

const StatsBox = styled.div`
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .label {
    color: #888;
    font-size: 0.875rem;
  }

  .value {
    color: #FFD700;
    font-weight: bold;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`

const PaytableButton = styled.button`
  background: transparent;
  color: #25D695;
  text-decoration: underline;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.5rem;

  &:hover {
    color: #1eb87a;
  }
`

export default function SlotsPage() {
  const {
    isSpinning,
    reels,
    winLines,
    betAmount,
    totalPayout,
    jackpotAmount,
    spin,
    setBetAmount
  } = useSlotsGame()

  const { address, balance } = useCoreumWallet()
  const [showPaytable, setShowPaytable] = useState(false)

  const totalBet = betAmount * 20 // 20 paylines

  return (
    <Container>
      <h1 className="text-5xl font-bangers text-center mb-2" style={{ color: '#FFD700' }}>
        Ultra Slots 🎰
      </h1>
      <p className="text-center text-gray-400 mb-8">
        5 Reels • 20 Paylines • 96% RTP • Provably Fair
      </p>

      <GameArea>
        <SlotMachine
          isSpinning={isSpinning}
          reels={reels}
          winLines={winLines}
          jackpotAmount={jackpotAmount}
          onSpinComplete={() => {}}
        />

        <ControlPanel>
          <div>
            <label className="block mb-2 text-sm text-gray-400">Bet per Line (COREUM)</label>
            <AmountInput
              value={betAmount}
              onChange={setBetAmount}
              disabled={isSpinning}
            />
            <p className="text-xs text-gray-500 mt-1">
              Total Bet: <span className="text-white font-bold">{totalBet.toFixed(2)} COREUM</span> (20 lines)
            </p>
          </div>

          <StatsBox>
            <div className="row">
              <span className="label">Max Win:</span>
              <span className="value">1000x</span>
            </div>
            <div className="row">
              <span className="label">RTP:</span>
              <span className="value">96%</span>
            </div>
            <div className="row">
              <span className="label">Your Balance:</span>
              <span className="value">{balance ? parseFloat(balance).toFixed(2) : '0.00'}</span>
            </div>
          </StatsBox>

          <div>
            <Button
              className="w-full h-14 text-xl font-bold font-bangers mb-2"
              style={{
                background: isSpinning ? '#666' : '#FFD700',
                color: '#000'
              }}
              onClick={spin}
              disabled={isSpinning || !address}
            >
              {!address ? 'Connect Wallet' : isSpinning ? 'SPINNING...' : 'SPIN'}
            </Button>
            <PaytableButton onClick={() => setShowPaytable(true)}>
              📖 View Paytable
            </PaytableButton>
          </div>
        </ControlPanel>

        <div className="text-center mt-4 p-4 bg-black/20 rounded-lg max-w-900px mx-auto" style={{ maxWidth: '900px' }}>
          <p className="text-xs text-gray-400">
            🔒 Provably Fair • Instant Payouts • Jackpot Mode Available
          </p>
        </div>
      </GameArea>

      {showPaytable && (
        <PaytableModal onClose={() => setShowPaytable(false)} />
      )}
    </Container>
  )
}
