'use client'

import { motion } from 'framer-motion'
import styled from 'styled-components'
import SlotReel from './SlotReel'
import type { WinLine } from '@/types/slots'

const MachineContainer = styled.div`
  background: linear-gradient(145deg, #1a1f2e, #0f1419);
  border-radius: 30px;
  padding: 3rem;
  border: 3px solid #FFD700;
  box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3);
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

const JackpotDisplay = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(90deg, #FFD700, #FFA500);
  border-radius: 15px;

  .label {
    font-size: 1rem;
    color: #000;
    font-weight: bold;
  }

  .amount {
    font-size: 2.5rem;
    color: #000;
    font-family: 'Bangers', cursive;
    margin-top: 0.25rem;
  }

  @media (max-width: 768px) {
    .amount {
      font-size: 1.75rem;
    }
  }
`

const ReelContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  background: #000;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    gap: 5px;
    padding: 10px;
  }
`

const WinDisplay = styled(motion.div)`
  text-align: center;
  font-size: 3rem;
  font-weight: bold;
  color: #FFD700;
  margin-bottom: 1rem;
  font-family: 'Bangers', cursive;
  min-height: 4rem;

  @media (max-width: 768px) {
    font-size: 2rem;
    min-height: 3rem;
  }
`

interface SlotMachineProps {
  isSpinning: boolean
  reels: string[][]
  winLines: WinLine[]
  jackpotAmount: number
  onSpinComplete: () => void
}

export default function SlotMachine({ isSpinning, reels, winLines, jackpotAmount, onSpinComplete }: SlotMachineProps) {
  const totalWin = winLines.reduce((sum, line) => sum + line.payout, 0)

  return (
    <MachineContainer>
      <JackpotDisplay>
        <div className="label">💎 JACKPOT 💎</div>
        <div className="amount">{jackpotAmount.toLocaleString()} COREUM</div>
      </JackpotDisplay>

      <WinDisplay
        initial={{ scale: 0 }}
        animate={{ scale: winLines.length > 0 ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {winLines.length > 0 && `WIN! ${totalWin.toFixed(2)} COREUM 🎉`}
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

      {winLines.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-lg text-[#25D695] font-bold">
            {winLines.length} Win Line{winLines.length > 1 ? 's' : ''}!
          </div>
          {winLines.map((line, i) => (
            <div key={i} className="text-sm text-gray-400">
              {line.symbols.join(' ')} = {line.payout.toFixed(2)} COREUM
            </div>
          ))}
        </motion.div>
      )}
    </MachineContainer>
  )
}
