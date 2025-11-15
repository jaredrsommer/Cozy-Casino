'use client'

import { useState } from 'react'
import { useCoreumWallet } from '@/providers/coreum'
import { useAdvancedSound } from '@/hooks/useAdvancedSound'
import axios from '@/util/axios'
import { showSuccess, showError } from '@/util/toast'
import type { CoinFlipState, CoinFlipBetResponse } from '@/types/coinflip'

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

    if (balance && parseFloat(balance) < state.betAmount) {
      showError('Insufficient balance')
      return
    }

    setState(prev => ({ ...prev, isFlipping: true, result: null }))
    playSoundEffect('bet')

    try {
      // Mock response for now - replace with actual API call
      const mockResult: CoinFlipBetResponse = {
        result: Math.random() > 0.5 ? 'heads' : 'tails',
        won: Math.random() > 0.5,
        payout: state.betAmount * 1.98,
        balance: parseFloat(balance || '0'),
        privateSeed: 'mock-seed',
        privateHash: 'mock-hash'
      }

      // Simulate API call
      // const response = await axios.post<CoinFlipBetResponse>('/coinflip/bet', {
      //   amount: state.betAmount,
      //   choice: state.selectedSide,
      //   address
      // })
      // const data = response.data

      // Simulate flip animation (2.5 seconds)
      setTimeout(() => {
        const won = mockResult.result === state.selectedSide

        setState(prev => ({
          ...prev,
          isFlipping: false,
          result: mockResult.result,
          currentStreak: won ? prev.currentStreak + 1 : 0
        }))

        if (won) {
          playSoundEffect('win')
          showSuccess(`You won ${(state.betAmount * 1.98).toFixed(2)} COREUM!`)
        } else {
          playSoundEffect('loss')
          showError('Better luck next time!')
        }
      }, 2500)
    } catch (error) {
      setState(prev => ({ ...prev, isFlipping: false }))
      playSoundEffect('error')
      showError('Failed to place bet')
      console.error('Coin flip error:', error)
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
