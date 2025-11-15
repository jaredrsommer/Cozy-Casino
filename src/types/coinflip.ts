export interface CoinFlipState {
  isFlipping: boolean
  result: 'heads' | 'tails' | null
  betAmount: number
  selectedSide: 'heads' | 'tails'
  isAutoBetting: boolean
  autoBetCount: number
  currentStreak: number
}

export interface CoinFlipBetRequest {
  amount: number
  choice: 'heads' | 'tails'
  address: string
  publicSeed?: string
}

export interface CoinFlipBetResponse {
  result: 'heads' | 'tails'
  won: boolean
  payout: number
  balance: number
  privateSeed: string
  privateHash: string
}
