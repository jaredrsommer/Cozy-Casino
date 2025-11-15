'use client'

import { useState } from 'react'
import { useCoreumWallet } from '@/providers/coreum'
import { useAdvancedSound } from '@/hooks/useAdvancedSound'
import axios from '@/util/axios'
import { showSuccess, showError } from '@/util/toast'
import type { SlotsState, WinLine } from '@/types/slots'

const SYMBOLS = ['💎', '💠', '7️⃣', '▰', '🍋', '🍒', '⭐']

export function useSlotsGame() {
  const { address, balance } = useCoreumWallet()
  const { playSoundEffect } = useAdvancedSound()

  const [state, setState] = useState<SlotsState>({
    isSpinning: false,
    reels: [
      ['🍒', '🍋', '7️⃣'],
      ['💎', '🍒', '▰'],
      ['🍋', '7️⃣', '💠'],
      ['🍒', '🍋', '🍒'],
      ['7️⃣', '💎', '🍋']
    ],
    winLines: [],
    betAmount: 0.1,
    totalPayout: 0,
    jackpotAmount: 10000
  })

  const generateRandomReels = (): string[][] => {
    const reels: string[][] = []
    for (let i = 0; i < 5; i++) {
      const reel: string[] = []
      for (let j = 0; j < 3; j++) {
        reel.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
      }
      reels.push(reel)
    }
    return reels
  }

  const checkWinLines = (reels: string[][]): WinLine[] => {
    const winLines: WinLine[] = []

    // Check horizontal lines (simplified - middle row only for demo)
    const middleRow = [reels[0][1], reels[1][1], reels[2][1], reels[3][1], reels[4][1]]

    // Check for 3+ matching symbols
    if (middleRow[0] === middleRow[1] && middleRow[1] === middleRow[2]) {
      const symbol = middleRow[0]
      let payout = 0

      switch (symbol) {
        case '💎': payout = 100; break
        case '💠': payout = 50; break
        case '7️⃣': payout = 25; break
        case '▰': payout = 15; break
        case '🍋': payout = 10; break
        case '🍒': payout = 5; break
        default: payout = 0
      }

      // Check for 4 or 5 matching
      if (middleRow[3] === middleRow[0]) {
        payout *= 2
        if (middleRow[4] === middleRow[0]) {
          payout *= 3 // 5 of a kind
        }
      }

      if (payout > 0) {
        winLines.push({
          line: 1,
          symbols: middleRow.slice(0, 3),
          payout: payout * state.betAmount
        })
      }
    }

    return winLines
  }

  const spin = async () => {
    if (!address) {
      showError('Please connect your wallet')
      return
    }

    if (state.betAmount <= 0) {
      showError('Invalid bet amount')
      return
    }

    if (balance && parseFloat(balance) < state.betAmount * 20) {
      showError('Insufficient balance (Total bet: ' + (state.betAmount * 20).toFixed(2) + ' COREUM)')
      return
    }

    setState(prev => ({ ...prev, isSpinning: true, winLines: [], totalPayout: 0 }))
    playSoundEffect('slide')

    try {
      // Generate new reels
      const newReels = generateRandomReels()

      // Simulate spin duration
      setTimeout(() => {
        const winLines = checkWinLines(newReels)
        const totalPayout = winLines.reduce((sum, line) => sum + line.payout, 0)

        setState(prev => ({
          ...prev,
          isSpinning: false,
          reels: newReels,
          winLines,
          totalPayout
        }))

        if (totalPayout > 0) {
          playSoundEffect('win')
          showSuccess(`You won ${totalPayout.toFixed(2)} COREUM!`)
        } else {
          playSoundEffect('loss')
        }
      }, 3000)

      // Mock API call
      // const response = await axios.post('/slots/spin', {
      //   amount: state.betAmount,
      //   lines: 20,
      //   address
      // })
    } catch (error) {
      setState(prev => ({ ...prev, isSpinning: false }))
      playSoundEffect('error')
      showError('Failed to spin')
      console.error('Slots error:', error)
    }
  }

  const setBetAmount = (amount: number) => {
    setState(prev => ({ ...prev, betAmount: amount }))
  }

  return {
    ...state,
    spin,
    setBetAmount
  }
}
