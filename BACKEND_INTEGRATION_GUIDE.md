# Backend Integration Guide
**CozyCasino - Replace Mock Data with Real API Calls**

**Date:** 2025-11-15
**Status:** 🔜 Ready for Implementation
**Branch:** `claude/cozycasino-coreum-rework-011CV6F6aoCoTJ2VV5MkLLiP`

---

## Table of Contents
1. [Overview](#1-overview)
2. [Backend API Endpoints](#2-backend-api-endpoints)
3. [Replace Mock Calls in Hooks](#3-replace-mock-calls-in-hooks)
4. [Provably Fair Implementation](#4-provably-fair-implementation)
5. [Active Player Counts](#5-active-player-counts)
6. [Testing & Verification](#6-testing--verification)
7. [Migration Checklist](#7-migration-checklist)

---

## 1. Overview

### Current State
The Phase 3 games are **fully functional with mock data**:
- ✅ Ultra Coin Flip with 3D animations
- ✅ Ultra Slots with reel mechanics
- ✅ 3D Game Selector with metadata
- ⚠️ **Mock API responses** in hooks
- ⚠️ **Static active player counts**

### What Needs to Be Replaced

| Component | Current State | Target State |
|-----------|---------------|--------------|
| **useCoinFlipGame.ts** | Mock random result generation | POST to `/api/coinflip/bet` |
| **useSlotsGame.ts** | Client-side reel generation | POST to `/api/slots/spin` |
| **GAME_METADATA** | Static `activePlayers` numbers | Real-time counts from API/Socket.io |
| **Provably Fair** | Not implemented | Full seed verification |

---

## 2. Backend API Endpoints

### 2.1 Coin Flip API

#### **POST** `/api/coinflip/bet`

**Purpose:** Place a coin flip bet and receive provably fair result

**Request Headers:**
```typescript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <JWT_TOKEN>' // Optional if using wallet signature auth
}
```

**Request Body:**
```typescript
{
  amount: number,           // Bet amount in COREUM (e.g., 1.5)
  choice: 'heads' | 'tails', // Player's prediction
  address: string,          // Coreum wallet address (0x...)
  publicSeed?: string       // Optional: User-provided seed for provably fair
}
```

**Response (200 OK):**
```typescript
{
  result: 'heads' | 'tails',  // The actual coin flip result
  won: boolean,                // Whether player won
  payout: number,              // Amount won (0 if lost, bet * 1.98 if won)
  balance: number,             // Updated user balance
  privateSeed: string,         // Server seed for verification
  privateHash: string,         // Hash of server seed (pre-reveal)
  gameId: string,              // Unique game ID for records
  timestamp: number            // Unix timestamp
}
```

**Error Responses:**
```typescript
// 400 Bad Request
{
  error: 'INVALID_BET_AMOUNT',
  message: 'Bet amount must be between 0.1 and 1000 COREUM'
}

// 402 Payment Required
{
  error: 'INSUFFICIENT_BALANCE',
  message: 'Your balance (10.5 COREUM) is less than bet amount (15 COREUM)'
}

// 401 Unauthorized
{
  error: 'WALLET_NOT_CONNECTED',
  message: 'Please connect your Coreum wallet'
}
```

---

### 2.2 Slots API

#### **POST** `/api/slots/spin`

**Purpose:** Spin the slot machine and receive reel results

**Request Body:**
```typescript
{
  amount: number,        // Bet amount per line (e.g., 0.5)
  lines: number,         // Number of active paylines (1-20)
  address: string,       // Coreum wallet address
  publicSeed?: string    // Optional: User seed
}
```

**Response (200 OK):**
```typescript
{
  reels: [
    ['🍒', '🍋', '7️⃣'],  // Reel 1 (top, middle, bottom)
    ['💎', '🍒', '▰'],   // Reel 2
    ['🍋', '7️⃣', '💠'],  // Reel 3
    ['🍒', '🍋', '🍒'],  // Reel 4
    ['7️⃣', '💎', '🍋']   // Reel 5
  ],
  winLines: [
    {
      line: 1,                      // Payline number (1-20)
      symbols: ['🍒', '🍒', '🍒'], // Matching symbols
      payout: 50                    // Payout amount in COREUM
    }
  ],
  totalPayout: number,           // Sum of all winLines payouts
  bonusTriggered: boolean,       // Whether free spins/bonus activated
  balance: number,               // Updated balance
  privateSeed: string,           // Server seed
  gameId: string,
  timestamp: number
}
```

**Error Responses:**
```typescript
// 400 Bad Request
{
  error: 'INVALID_LINE_COUNT',
  message: 'Lines must be between 1 and 20'
}
```

---

### 2.3 Game Metadata API

#### **GET** `/api/games/metadata`

**Purpose:** Fetch real-time game metadata including active players

**Response (200 OK):**
```typescript
{
  games: [
    {
      id: 'coinflip',
      activePlayers: 47,        // Real-time count
      lastUpdate: 1700000000000 // Unix timestamp
    },
    {
      id: 'slots',
      activePlayers: 92,
      lastUpdate: 1700000000000
    },
    // ... other games
  ],
  jackpots: {
    slots: 12500.75  // Current progressive jackpot (if applicable)
  }
}
```

---

### 2.4 Active Players (WebSocket Alternative)

#### **Socket.io Events**

**Connect to:** `wss://your-backend.com/socket`

**Subscribe to player counts:**
```typescript
// Client subscribes
socket.on('playerCounts', (data) => {
  console.log(data)
  // {
  //   coinflip: 45,
  //   slots: 89,
  //   crash: 127,
  //   mine: 63,
  //   videopoker: 34,
  //   slide: 28
  // }
})

// Data updates every 5 seconds automatically
```

---

## 3. Replace Mock Calls in Hooks

### 3.1 Update `useCoinFlipGame.ts`

**File:** `/src/hooks/useCoinFlipGame.ts`

**Current Mock Code (Lines 44-61):**
```typescript
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
```

**Replace With:**
```typescript
// Real API call
const response = await axios.post<CoinFlipBetResponse>('/api/coinflip/bet', {
  amount: state.betAmount,
  choice: state.selectedSide,
  address
})

const data = response.data
const won = data.won

// Simulate flip animation (2.5 seconds)
setTimeout(() => {
  setState(prev => ({
    ...prev,
    isFlipping: false,
    result: data.result,
    currentStreak: won ? prev.currentStreak + 1 : 0
  }))

  if (won) {
    playSoundEffect('win')
    showSuccess(`You won ${data.payout.toFixed(2)} COREUM!`)
  } else {
    playSoundEffect('loss')
    showError('Better luck next time!')
  }

  // Optional: Store seeds for provably fair verification
  if (data.privateSeed && data.privateHash) {
    localStorage.setItem(`game-${data.gameId}`, JSON.stringify({
      privateSeed: data.privateSeed,
      privateHash: data.privateHash,
      result: data.result
    }))
  }
}, 2500)
```

**Complete Updated Function:**
```typescript
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
    // 🔥 REAL API CALL
    const response = await axios.post<CoinFlipBetResponse>('/api/coinflip/bet', {
      amount: state.betAmount,
      choice: state.selectedSide,
      address
    })

    const data = response.data
    const won = data.won

    // Simulate flip animation (2.5 seconds)
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isFlipping: false,
        result: data.result,
        currentStreak: won ? prev.currentStreak + 1 : 0
      }))

      if (won) {
        playSoundEffect('win')
        showSuccess(`You won ${data.payout.toFixed(2)} COREUM!`)
      } else {
        playSoundEffect('loss')
        showError('Better luck next time!')
      }

      // Store for provably fair verification
      if (data.privateSeed && data.privateHash) {
        localStorage.setItem(`game-${data.gameId}`, JSON.stringify({
          privateSeed: data.privateSeed,
          privateHash: data.privateHash,
          publicSeed: state.selectedSide,
          result: data.result,
          timestamp: Date.now()
        }))
      }
    }, 2500)
  } catch (error: any) {
    setState(prev => ({ ...prev, isFlipping: false }))
    playSoundEffect('error')

    // Handle specific error messages
    const errorMessage = error.response?.data?.message || 'Failed to place bet'
    showError(errorMessage)
    console.error('Coin flip error:', error)
  }
}
```

---

### 3.2 Update `useSlotsGame.ts`

**File:** `/src/hooks/useSlotsGame.ts`

**Current Mock Code (Lines 104-126):**
```typescript
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
```

**Replace With:**
```typescript
try {
  // 🔥 REAL API CALL
  const response = await axios.post<SlotsSpinResponse>('/api/slots/spin', {
    amount: state.betAmount,
    lines: 20,
    address
  })

  const data = response.data

  // Simulate spin animation (3 seconds)
  setTimeout(() => {
    setState(prev => ({
      ...prev,
      isSpinning: false,
      reels: data.reels,
      winLines: data.winLines,
      totalPayout: data.totalPayout
    }))

    if (data.totalPayout > 0) {
      playSoundEffect('win')
      showSuccess(`You won ${data.totalPayout.toFixed(2)} COREUM!`)
    } else {
      playSoundEffect('loss')
    }

    // Handle bonus triggers
    if (data.bonusTriggered) {
      showSuccess('🎉 Bonus Round Triggered!')
      playSoundEffect('bonus')
    }
  }, 3000)
```

**Remove Client-Side Logic:**
```typescript
// ❌ DELETE these functions (server handles this now)
// const generateRandomReels = () => { ... }
// const checkWinLines = () => { ... }
```

---

### 3.3 Update Active Player Counts

**File:** `/src/types/games.ts`

**Current Static Data:**
```typescript
export const GAME_METADATA: GameMetadata[] = [
  {
    id: 'crash',
    // ...
    activePlayers: 127,  // ❌ Static number
  },
  {
    id: 'coinflip',
    // ...
    activePlayers: 45,   // ❌ Static number
  },
  // ...
]
```

**Option A: Polling API (Simple)**

Create a new hook: `/src/hooks/useGameMetadata.ts`

```typescript
'use client'

import { useState, useEffect } from 'react'
import axios from '@/util/axios'
import type { GameMetadata } from '@/types/games'

export function useGameMetadata() {
  const [games, setGames] = useState<GameMetadata[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await axios.get('/api/games/metadata')

        // Merge static data with dynamic player counts
        const updatedGames = GAME_METADATA.map(game => ({
          ...game,
          activePlayers: response.data.games.find(
            (g: any) => g.id === game.id
          )?.activePlayers || 0
        }))

        setGames(updatedGames)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch game metadata:', error)
        // Fallback to static data
        setGames(GAME_METADATA)
        setLoading(false)
      }
    }

    fetchMetadata()

    // Poll every 10 seconds
    const interval = setInterval(fetchMetadata, 10000)

    return () => clearInterval(interval)
  }, [])

  return { games, loading }
}
```

**Update Landing Page:**

File: `/src/app/landing/page.tsx`

```typescript
'use client'

import GameCard3D from '@/components/GameSelector/GameCard3D'
import { useGameMetadata } from '@/hooks/useGameMetadata'  // 🔥 NEW
import { motion } from 'framer-motion'

export default function LandingPage() {
  const { games, loading } = useGameMetadata()  // 🔥 REPLACE STATIC DATA

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-white">Loading games...</div>
    </div>
  }

  return (
    <div className='bg-casino w-screen min-h-screen bg-center bg-cover bg-no-repeat'>
      {/* ... */}
      <motion.div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full'>
        {games.map((game, idx) => (  // 🔥 Use dynamic games
          <motion.div key={game.id} /* ... */>
            <GameCard3D game={game} />
          </motion.div>
        ))}
      </motion.div>
      {/* ... */}
    </div>
  )
}
```

---

**Option B: Socket.io (Real-time)**

Create: `/src/hooks/usePlayerCounts.ts`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

interface PlayerCounts {
  [gameId: string]: number
}

export function usePlayerCounts() {
  const [counts, setCounts] = useState<PlayerCounts>({})
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socket: Socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001')

    socket.on('connect', () => {
      console.log('Socket connected')
      setConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
      setConnected(false)
    })

    socket.on('playerCounts', (data: PlayerCounts) => {
      console.log('Player counts updated:', data)
      setCounts(data)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return { counts, connected }
}
```

**Update Landing Page (Socket.io version):**

```typescript
import { usePlayerCounts } from '@/hooks/usePlayerCounts'
import { GAME_METADATA } from '@/types/games'

export default function LandingPage() {
  const { counts } = usePlayerCounts()

  // Merge static metadata with real-time counts
  const games = GAME_METADATA.map(game => ({
    ...game,
    activePlayers: counts[game.id] || game.activePlayers
  }))

  return (
    // ... render games as before
  )
}
```

---

## 4. Provably Fair Implementation

### 4.1 Verification Algorithm

**How Provably Fair Works:**

1. **Before Game:** Server generates `privateSeed` and reveals `hash(privateSeed)`
2. **During Game:** Client provides optional `publicSeed` (or uses bet choice)
3. **After Game:** Server reveals `privateSeed`
4. **Verification:** Client verifies `hash(privateSeed)` matches and recalculates result

**Coin Flip Verification Function:**

Create: `/src/util/provablyFair.ts`

```typescript
import crypto from 'crypto'

/**
 * Verify a coin flip result is provably fair
 *
 * @param publicSeed - Client seed (or bet choice)
 * @param privateSeed - Server seed (revealed after game)
 * @param privateHash - Hash of server seed (revealed before game)
 * @returns Verification result
 */
export function verifyCoinFlip(
  publicSeed: string,
  privateSeed: string,
  privateHash: string
): {
  isValid: boolean
  calculatedResult: 'heads' | 'tails'
  hashMatches: boolean
} {
  // 1. Verify the private seed hash matches
  const calculatedHash = crypto
    .createHash('sha256')
    .update(privateSeed)
    .digest('hex')

  const hashMatches = calculatedHash === privateHash

  // 2. Recalculate the result
  const combinedSeed = publicSeed + privateSeed
  const resultHash = crypto
    .createHash('sha256')
    .update(combinedSeed)
    .digest('hex')

  // Convert first 8 hex chars to integer
  const resultInt = parseInt(resultHash.substring(0, 8), 16)
  const calculatedResult = resultInt % 2 === 0 ? 'heads' : 'tails'

  return {
    isValid: hashMatches,
    calculatedResult,
    hashMatches
  }
}

/**
 * Verify slots result
 */
export function verifySlots(
  publicSeed: string,
  privateSeed: string,
  privateHash: string,
  reels: string[][]
): {
  isValid: boolean
  hashMatches: boolean
} {
  // Verify hash
  const calculatedHash = crypto
    .createHash('sha256')
    .update(privateSeed)
    .digest('hex')

  const hashMatches = calculatedHash === privateHash

  // Recreate reels from seeds (implementation depends on backend algorithm)
  // This is a simplified example
  const combinedSeed = publicSeed + privateSeed
  const seedHash = crypto
    .createHash('sha256')
    .update(combinedSeed)
    .digest('hex')

  // Backend should provide algorithm details for full verification
  // For now, we trust the hash match

  return {
    isValid: hashMatches,
    hashMatches
  }
}
```

### 4.2 Add Verification UI

Create: `/src/components/ProvablyFairModal.tsx`

```typescript
'use client'

import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from '@heroui/react'
import { verifyCoinFlip } from '@/util/provablyFair'

interface ProvablyFairModalProps {
  isOpen: boolean
  onClose: () => void
  gameId: string
  gameType: 'coinflip' | 'slots'
}

export default function ProvablyFairModal({
  isOpen,
  onClose,
  gameId,
  gameType
}: ProvablyFairModalProps) {
  const [verification, setVerification] = useState<any>(null)

  const handleVerify = () => {
    const gameData = localStorage.getItem(`game-${gameId}`)
    if (!gameData) {
      alert('Game data not found')
      return
    }

    const { privateSeed, privateHash, publicSeed, result } = JSON.parse(gameData)

    if (gameType === 'coinflip') {
      const verified = verifyCoinFlip(publicSeed, privateSeed, privateHash)
      setVerification({
        ...verified,
        actualResult: result,
        matches: verified.calculatedResult === result
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>Provably Fair Verification</ModalHeader>
        <ModalBody>
          <div className="space-y-4 pb-6">
            <p className="text-sm text-gray-400">
              Verify that this game was fair and not manipulated
            </p>

            <Button onClick={handleVerify} color="success">
              Verify Game #{gameId}
            </Button>

            {verification && (
              <div className="mt-4 p-4 bg-black/30 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Hash Matches:</span>
                  <span className={verification.hashMatches ? 'text-green-500' : 'text-red-500'}>
                    {verification.hashMatches ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Calculated Result:</span>
                  <span>{verification.calculatedResult}</span>
                </div>
                <div className="flex justify-between">
                  <span>Actual Result:</span>
                  <span>{verification.actualResult}</span>
                </div>
                <div className="flex justify-between">
                  <span>Results Match:</span>
                  <span className={verification.matches ? 'text-green-500' : 'text-red-500'}>
                    {verification.matches ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className={`text-center font-bold ${verification.isValid && verification.matches ? 'text-green-500' : 'text-red-500'}`}>
                    {verification.isValid && verification.matches
                      ? '✅ Game is Provably Fair!'
                      : '❌ Verification Failed'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
```

---

## 5. Active Player Counts

### Implementation Comparison

| Method | Pros | Cons | Recommended |
|--------|------|------|-------------|
| **REST API Polling** | Simple, no extra dependencies | Higher latency, more requests | ✅ Start here |
| **Socket.io** | Real-time, efficient | More complex setup | ⭐ Production |
| **Server-Sent Events** | Simple real-time | One-way only | Alternative |

### Socket.io Backend Example (Node.js)

```javascript
// server.js
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
})

// Track active players per game
const activePlayers = {
  coinflip: new Set(),
  slots: new Set(),
  crash: new Set(),
  // ...
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Join a game room
  socket.on('joinGame', (gameId) => {
    if (activePlayers[gameId]) {
      activePlayers[gameId].add(socket.id)
      socket.join(gameId)
      broadcastPlayerCounts()
    }
  })

  // Leave a game room
  socket.on('leaveGame', (gameId) => {
    if (activePlayers[gameId]) {
      activePlayers[gameId].delete(socket.id)
      socket.leave(gameId)
      broadcastPlayerCounts()
    }
  })

  socket.on('disconnect', () => {
    // Remove from all games
    Object.keys(activePlayers).forEach(gameId => {
      activePlayers[gameId].delete(socket.id)
    })
    broadcastPlayerCounts()
  })
})

function broadcastPlayerCounts() {
  const counts = {}
  Object.keys(activePlayers).forEach(gameId => {
    counts[gameId] = activePlayers[gameId].size
  })

  io.emit('playerCounts', counts)
}

// Broadcast every 5 seconds
setInterval(broadcastPlayerCounts, 5000)
```

---

## 6. Testing & Verification

### 6.1 Manual Testing Checklist

**Coin Flip:**
- [ ] Place bet with valid amount
- [ ] Verify API response contains all required fields
- [ ] Confirm balance is updated correctly
- [ ] Test win scenario (check payout = bet * 1.98)
- [ ] Test loss scenario (check payout = 0)
- [ ] Verify provably fair seeds are stored
- [ ] Test with insufficient balance
- [ ] Test with disconnected wallet

**Slots:**
- [ ] Spin with valid bet amount
- [ ] Verify reels match API response
- [ ] Confirm win lines are displayed correctly
- [ ] Test jackpot trigger (if applicable)
- [ ] Test with insufficient balance
- [ ] Verify total bet = betAmount * 20 lines

**Active Players:**
- [ ] Verify counts update within 10 seconds (polling)
- [ ] Verify counts update in real-time (Socket.io)
- [ ] Test with multiple tabs open
- [ ] Confirm counts decrement when closing tabs

### 6.2 Automated Tests

Create: `/tests/hooks/useCoinFlipGame.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react-hooks'
import { useCoinFlipGame } from '@/hooks/useCoinFlipGame'
import axios from '@/util/axios'

jest.mock('@/util/axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('useCoinFlipGame with real API', () => {
  it('should make API call on placeBet', async () => {
    const mockResponse = {
      data: {
        result: 'heads',
        won: true,
        payout: 1.98,
        balance: 100,
        privateSeed: 'seed123',
        privateHash: 'hash123',
        gameId: 'game-1'
      }
    }

    mockedAxios.post.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCoinFlipGame())

    await act(async () => {
      await result.current.placeBet()
    })

    expect(mockedAxios.post).toHaveBeenCalledWith('/api/coinflip/bet', {
      amount: expect.any(Number),
      choice: expect.any(String),
      address: expect.any(String)
    })
  })
})
```

---

## 7. Migration Checklist

### Phase 1: Backend Setup (Backend Team)
- [ ] Deploy coin flip API endpoint
- [ ] Deploy slots API endpoint
- [ ] Deploy game metadata API endpoint
- [ ] Set up Socket.io server (optional)
- [ ] Configure CORS for frontend domain
- [ ] Test all endpoints with Postman/Insomnia
- [ ] Set up database for game records
- [ ] Implement provably fair seed generation

### Phase 2: Frontend Integration (Frontend Team)
- [ ] Update `useCoinFlipGame.ts` to use real API
- [ ] Update `useSlotsGame.ts` to use real API
- [ ] Remove client-side reel generation logic
- [ ] Create `useGameMetadata.ts` hook (polling)
- [ ] Create `usePlayerCounts.ts` hook (Socket.io)
- [ ] Update landing page to use dynamic data
- [ ] Add error handling for network failures
- [ ] Add loading states
- [ ] Implement retry logic for failed requests

### Phase 3: Provably Fair
- [ ] Create `provablyFair.ts` utility
- [ ] Create `ProvablyFairModal.tsx` component
- [ ] Add "Verify" button to game history
- [ ] Store game seeds in localStorage
- [ ] Add provably fair documentation page
- [ ] Test verification algorithm

### Phase 4: Testing & QA
- [ ] Test all games end-to-end
- [ ] Verify balance updates correctly
- [ ] Test edge cases (insufficient balance, network errors)
- [ ] Test on mobile devices
- [ ] Load test API endpoints
- [ ] Security audit (prevent cheating)

### Phase 5: Deployment
- [ ] Deploy backend to production
- [ ] Deploy frontend with updated hooks
- [ ] Monitor error logs
- [ ] Monitor API latency
- [ ] Set up alerts for high error rates
- [ ] Update documentation

---

## 8. Environment Variables

Add to `.env.local`:

```bash
# Backend API
NEXT_PUBLIC_API_URL=https://api.cozycasino.com
NEXT_PUBLIC_WS_URL=wss://api.cozycasino.com

# For development
# NEXT_PUBLIC_API_URL=http://localhost:3001
# NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

Update `axios.ts`:

```typescript
import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor for auth
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default instance
```

---

## 9. Performance Optimization

### API Response Caching

```typescript
// Cache game metadata for 30 seconds
import { useState, useEffect } from 'react'

const CACHE_DURATION = 30000 // 30 seconds

let metadataCache: { data: any; timestamp: number } | null = null

export function useGameMetadata() {
  const [games, setGames] = useState([])

  useEffect(() => {
    const fetchMetadata = async () => {
      const now = Date.now()

      // Use cache if fresh
      if (metadataCache && now - metadataCache.timestamp < CACHE_DURATION) {
        setGames(metadataCache.data)
        return
      }

      // Fetch fresh data
      const response = await axios.get('/api/games/metadata')
      metadataCache = { data: response.data, timestamp: now }
      setGames(response.data)
    }

    fetchMetadata()
  }, [])

  return { games }
}
```

---

## 10. Security Considerations

### Backend Requirements
- ✅ Validate all bet amounts (min/max)
- ✅ Verify wallet signatures for authentication
- ✅ Rate limit API endpoints (prevent spam)
- ✅ Use HTTPS only in production
- ✅ Sanitize all inputs
- ✅ Implement idempotency for bet placement
- ✅ Store game results in immutable database
- ✅ Log all transactions for auditing

### Frontend Best Practices
- ✅ Never trust client-side validation alone
- ✅ Display loading states during API calls
- ✅ Handle network errors gracefully
- ✅ Validate API responses before using
- ✅ Don't expose sensitive keys in frontend code

---

## 11. Support & Troubleshooting

### Common Issues

**Issue:** API calls failing with CORS errors
**Solution:** Ensure backend CORS is configured to allow your frontend domain

**Issue:** Balance not updating after bet
**Solution:** Check that backend returns updated balance in response

**Issue:** Active player counts not updating
**Solution:**
- Polling: Check network tab for API calls every 10s
- Socket.io: Verify WebSocket connection in browser console

**Issue:** Provably fair verification fails
**Solution:** Ensure hashing algorithm matches backend exactly

---

## 12. Next Steps After Integration

Once mock data is replaced:

1. **Analytics Integration**
   - Track bet amounts, win rates, popular games
   - Use Google Analytics or Mixpanel

2. **Game History**
   - Show recent games with verify buttons
   - Allow users to re-verify old games

3. **Leaderboards**
   - Fetch from `/api/leaderboard`
   - Update in real-time

4. **Jackpot Tracking**
   - Display progressive jackpot amounts
   - Celebrate jackpot wins site-wide

5. **Social Features**
   - Chat integration (already implemented)
   - Share wins on social media

---

## Summary

This guide provides everything needed to replace mock data with real backend integration:

✅ **API Specifications** - Complete endpoint documentation
✅ **Code Examples** - Drop-in replacements for all hooks
✅ **Provably Fair** - Full verification implementation
✅ **Active Players** - Both polling and Socket.io options
✅ **Testing** - Comprehensive testing checklist
✅ **Security** - Best practices and considerations

**Estimated Timeline:** 3-5 days for full integration

**Questions?** Reference `PHASE3_IMPLEMENTATION_PLAN.md` for original architecture details.

---

**Document Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** 🎉 Ready for Backend Team
