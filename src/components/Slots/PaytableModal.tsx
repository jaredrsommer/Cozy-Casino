'use client'

import styled from 'styled-components'
import { motion } from 'framer-motion'

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`

const Modal = styled(motion.div)`
  background: linear-gradient(145deg, #1a1f2e, #0f1419);
  border-radius: 20px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  border: 2px solid #FFD700;
  max-height: 90vh;
  overflow-y: auto;
`

const Title = styled.h2`
  font-family: 'Bangers', cursive;
  font-size: 2.5rem;
  color: #FFD700;
  text-align: center;
  margin-bottom: 1.5rem;
`

const PaytableGrid = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const PaytableRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr auto;
  align-items: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 10px;
`

const SymbolDisplay = styled.div`
  font-size: 3rem;
  text-align: center;
`

const SymbolInfo = styled.div`
  .name {
    font-weight: bold;
    color: #fff;
    margin-bottom: 0.25rem;
  }

  .desc {
    font-size: 0.875rem;
    color: #888;
  }
`

const Payout = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #25D695;
  white-space: nowrap;
`

const CloseButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #FFD700;
  color: #000;
  font-weight: bold;
  font-size: 1.25rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Bangers', cursive;
  transition: all 0.3s;

  &:hover {
    background: #FFA500;
    transform: scale(1.05);
  }
`

const InfoSection = styled.div`
  background: rgba(37, 214, 149, 0.1);
  border: 1px solid rgba(37, 214, 149, 0.3);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;

  h3 {
    color: #25D695;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  p {
    color: #ccc;
    font-size: 0.875rem;
    line-height: 1.5;
  }
`

interface PaytableModalProps {
  onClose: () => void
}

const PAYTABLE = [
  { symbol: '💎', name: 'Diamond', desc: '5 of a kind', payout: '1000x' },
  { symbol: '💠', name: 'Gem', desc: '5 of a kind', payout: '100x' },
  { symbol: '7️⃣', name: 'Lucky Seven', desc: '5 of a kind', payout: '50x' },
  { symbol: '▰', name: 'Bar', desc: '5 of a kind', payout: '25x' },
  { symbol: '🍋', name: 'Lemon', desc: '5 of a kind', payout: '10x' },
  { symbol: '🍒', name: 'Cherry', desc: '5 of a kind', payout: '5x' },
  { symbol: '⭐', name: 'Scatter', desc: 'Bonus trigger', payout: 'BONUS' }
]

export default function PaytableModal({ onClose }: PaytableModalProps) {
  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Modal
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Title>Paytable 🎰</Title>

        <InfoSection>
          <h3>How to Win</h3>
          <p>
            Match 3 or more symbols on an active payline to win! Payouts are multiplied by your bet amount.
            Land 4 or 5 matching symbols for bigger wins!
          </p>
        </InfoSection>

        <PaytableGrid>
          {PAYTABLE.map((item, index) => (
            <PaytableRow key={index}>
              <SymbolDisplay>{item.symbol.repeat(3)}</SymbolDisplay>
              <SymbolInfo>
                <div className="name">{item.name}</div>
                <div className="desc">{item.desc}</div>
              </SymbolInfo>
              <Payout>{item.payout}</Payout>
            </PaytableRow>
          ))}
        </PaytableGrid>

        <InfoSection>
          <h3>Game Info</h3>
          <p>
            • 20 Paylines<br />
            • RTP: 96%<br />
            • Provably Fair<br />
            • 3 Scatter symbols trigger Free Spins!
          </p>
        </InfoSection>

        <CloseButton onClick={onClose}>
          CLOSE
        </CloseButton>
      </Modal>
    </Overlay>
  )
}
