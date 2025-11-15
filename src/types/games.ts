export interface GameMetadata {
  id: string
  name: string
  path: string
  icon: string
  difficulty: 'easy' | 'medium' | 'hard'
  minBet: number
  maxPayout: number
  houseEdge: number
  tags: ('new' | 'hot' | 'live' | 'jackpot')[]
  activePlayers: number
  description: string
}

export const GAME_METADATA: GameMetadata[] = [
  {
    id: 'crash',
    name: 'Crash Game',
    path: '/crash',
    icon: '🚀',
    difficulty: 'medium',
    minBet: 0.1,
    maxPayout: 1000,
    houseEdge: 1,
    tags: ['hot', 'live'],
    activePlayers: 127,
    description: 'Watch the multiplier soar and cash out before it crashes!'
  },
  {
    id: 'coinflip',
    name: 'Coin Flip',
    path: '/coinflip',
    icon: '🪙',
    difficulty: 'easy',
    minBet: 0.1,
    maxPayout: 1.98,
    houseEdge: 1,
    tags: ['new'],
    activePlayers: 45,
    description: 'Classic 50/50 odds with instant payouts'
  },
  {
    id: 'slots',
    name: 'Ultra Slots',
    path: '/slots',
    icon: '🎰',
    difficulty: 'easy',
    minBet: 0.1,
    maxPayout: 1000,
    houseEdge: 4,
    tags: ['new', 'hot', 'jackpot'],
    activePlayers: 89,
    description: '5-reel slots with massive jackpot potential!'
  },
  {
    id: 'mine',
    name: 'Mines',
    path: '/mine',
    icon: '💣',
    difficulty: 'hard',
    minBet: 0.1,
    maxPayout: 100,
    houseEdge: 1,
    tags: ['live'],
    activePlayers: 63,
    description: 'Navigate the minefield and cash out big wins'
  },
  {
    id: 'videopoker',
    name: 'Video Poker',
    path: '/videopoker',
    icon: '🃏',
    difficulty: 'medium',
    minBet: 0.1,
    maxPayout: 250,
    houseEdge: 2,
    tags: [],
    activePlayers: 34,
    description: 'Classic video poker with skill-based gameplay'
  },
  {
    id: 'slide',
    name: 'Slide',
    path: '/slide',
    icon: '🎯',
    difficulty: 'medium',
    minBet: 0.1,
    maxPayout: 50,
    houseEdge: 1.5,
    tags: [],
    activePlayers: 28,
    description: 'Pick your target and watch the slider!'
  }
]
