export interface SlotsState {
  isSpinning: boolean
  reels: string[][]
  winLines: WinLine[]
  betAmount: number
  totalPayout: number
  jackpotAmount: number
}

export interface WinLine {
  line: number
  symbols: string[]
  payout: number
}

export interface SlotSymbol {
  icon: string
  payout: number
  probability: number
  bonus?: 'free_spins' | 'jackpot'
}

export interface SlotsSpinRequest {
  amount: number
  lines: number
  address: string
  publicSeed?: string
}

export interface SlotsSpinResponse {
  reels: string[][]
  winLines: WinLine[]
  totalPayout: number
  bonusTriggered: boolean
  balance: number
  privateSeed: string
}

export const SLOT_SYMBOLS: Record<string, SlotSymbol> = {
  jackpot: { icon: '💎', payout: 1000, probability: 0.001, bonus: 'jackpot' },
  diamond: { icon: '💠', payout: 100, probability: 0.01 },
  seven: { icon: '7️⃣', payout: 50, probability: 0.02 },
  bar: { icon: '▰', payout: 25, probability: 0.05 },
  lemon: { icon: '🍋', payout: 10, probability: 0.1 },
  cherry: { icon: '🍒', payout: 5, probability: 0.2 },
  scatter: { icon: '⭐', payout: 0, probability: 0.05, bonus: 'free_spins' }
}
