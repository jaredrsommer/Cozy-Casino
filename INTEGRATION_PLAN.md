# CozyCasino Feature Integration Plan
## Comprehensive Migration from Solana Casino Platform

**Project:** CozyCasino (Coreum Blockchain)
**Source:** solana-casino-platform analysis
**Target Branch:** `claude/cozycasino-coreum-rework-011CV6F6aoCoTJ2VV5MkLLiP`
**Date:** 2025-11-15

---

## Executive Summary

This document outlines the comprehensive integration plan for migrating high-value features from the Solana casino platform into CozyCasino (Coreum). The integration focuses on enhancing user experience, engagement, and platform functionality while maintaining compatibility with the Coreum blockchain infrastructure.

### Key Objectives
1. ✅ **Immediate Value:** Add chat, toast notifications, and sound system
2. 📊 **Analytics & Engagement:** Implement leaderboard and advanced dashboard
3. 🎮 **Enhanced Gaming:** Port Ultra Coin Flip and Ultra Slots
4. 🎨 **UX Improvements:** 3D game selector and enhanced UI components

---

## Phase 1: Foundation & Quick Wins (Priority: HIGH)
**Timeline:** 1-2 days
**Impact:** Immediate UX improvement
**Dependencies:** None

### 1.1 Real-time Chat System 💬
**Status:** NEW FEATURE
**Priority:** CRITICAL (User requested)

**Implementation:**
- Create chat context provider (`/src/context/chatcontext.tsx`)
- Socket.io namespace: `/chat` on existing backend
- Features:
  - Global casino chat room
  - User presence indicators
  - Message history (last 100 messages)
  - Emoji support
  - Admin moderation capabilities
  - Rate limiting (prevent spam)

**Components:**
```
/src/components/Chat/
├── ChatWidget.tsx        # Main chat container
├── ChatMessage.tsx       # Individual message component
├── ChatInput.tsx         # Message input with emoji picker
├── UserList.tsx          # Online users sidebar
└── ChatProvider.tsx      # Context provider
```

**Socket Events:**
```typescript
// Client → Server
'chat:message'        // Send message
'chat:join'           // Join chat room
'chat:leave'          // Leave chat room
'chat:typing'         // Typing indicator

// Server → Client
'chat:message'        // New message broadcast
'chat:history'        // Load message history
'chat:user-joined'    // User joined notification
'chat:user-left'      // User left notification
'chat:typing'         // Another user typing
```

**Backend Requirements:**
- New API endpoint: `POST /api/chat/history`
- Socket.io namespace setup
- Message persistence (MongoDB/PostgreSQL)
- Profanity filter integration
- Rate limiting middleware

**UI Integration:**
- Fixed position chat widget (bottom-right corner)
- Collapsible/expandable interface
- Notification badge for new messages
- Sound notification option
- Mobile-responsive design

---

### 1.2 Toast Notification System 🔔
**Status:** NEW FEATURE
**Priority:** HIGH

**Implementation:**
- Install: `react-hot-toast`
- Create toast utility wrapper
- Standardized notification types:
  - Success (green) - Wins, successful bets
  - Error (red) - Failed transactions, errors
  - Info (blue) - Game events, tips
  - Warning (yellow) - Low balance alerts

**Usage Example:**
```typescript
import { toast } from '@/util/toast'

toast.success('Bet placed successfully!')
toast.error('Insufficient balance')
toast.info('Game starting in 5 seconds...')
```

**Files:**
```
/src/util/toast.ts           # Toast utility wrapper
/src/providers/ToastProvider.tsx  # Provider component
```

---

### 1.3 Enhanced Sound System 🔊
**Status:** ENHANCEMENT (extends existing audio)
**Priority:** HIGH

**Current State:**
- Basic audio files in `/public/assets/audio/`
- No centralized sound management
- No volume controls

**Enhancements:**
```
/src/hooks/useAdvancedSound.ts
/src/components/SoundSettings.tsx
/src/context/soundcontext.tsx
```

**Features:**
- Zustand store for sound state management
- Separate volume controls:
  - Master volume
  - SFX (sound effects)
  - Music (background music)
  - Ambient (casino ambience)
- Persistent settings (localStorage)
- Sound preloading for better performance
- Mute/unmute shortcuts

**Sound Categories:**
```typescript
const soundEffects = {
  bet: '/assets/audio/placebet.wav',
  win: '/assets/audio/success.wav',
  loss: '/assets/audio/error.wav',
  crash: '/assets/audio/crash.wav',
  coin: '/assets/audio/bet.mp3',
  slide: '/assets/audio/sliding.mp3'
}

const music = {
  main: '/assets/audio/main.mp3',
  lobby: '/assets/audio/lobby.mp3'  // NEW
}
```

---

## Phase 2: Analytics & Engagement (Priority: HIGH)
**Timeline:** 3-5 days
**Impact:** High engagement boost
**Dependencies:** Phase 1 (toast notifications)

### 2.1 Advanced Dashboard 📊
**Status:** NEW FEATURE
**Priority:** HIGH

**Implementation:**
- Install: `chart.js`, `react-chartjs-2`
- Create dashboard page: `/src/app/dashboard/page.tsx`

**Features:**
- Real-time statistics with auto-refresh
- Time range filters (24h, 7d, 30d, 90d, All Time)
- Visual charts:
  - Line chart: Profit/Loss over time
  - Bar chart: Bet volume per game
  - Doughnut chart: Win/Loss ratio
  - Area chart: Balance history

**Metrics:**
```typescript
interface DashboardStats {
  totalBets: number
  totalWagered: number
  totalProfit: number
  winRate: number
  biggestWin: number
  biggestLoss: number
  favoriteGame: string
  currentStreak: number
  gamesPlayed: {
    crash: number
    mines: number
    slide: number
    videoPoker: number
  }
}
```

**Components:**
```
/src/components/dashboard/
├── AdvancedDashboard.tsx
├── StatCard.tsx
├── ProfitChart.tsx
├── VolumeChart.tsx
├── GameDistribution.tsx
└── RecentActivity.tsx
```

**API Endpoints:**
```
GET /api/dashboard/stats?timeRange=7d
GET /api/dashboard/profit-history?timeRange=30d
GET /api/dashboard/game-distribution
```

---

### 2.2 Leaderboard System 🏆
**Status:** NEW FEATURE
**Priority:** HIGH

**Implementation:**
- Create leaderboard page: `/src/app/leaderboard/page.tsx`
- Add leaderboard widget on landing page

**Features:**
- Multiple categories:
  - Highest Profit (24h, 7d, 30d, All-time)
  - Highest Volume (total wagered)
  - Best Win Rate (min 100 bets)
  - Biggest Single Win
  - Longest Win Streak
- Player rankings with badges:
  - 🥇 Gold (Top 3)
  - 🥈 Silver (Top 10)
  - 🥉 Bronze (Top 25)
- User profile cards with stats
- Time-based filters
- Anonymous mode option

**Components:**
```
/src/components/leaderboard/
├── AdvancedLeaderboard.tsx
├── LeaderboardCard.tsx
├── PlayerProfile.tsx
├── RankBadge.tsx
└── CategoryTabs.tsx
```

**API Endpoints:**
```
GET /api/leaderboard?category=profit&timeRange=7d&limit=25
GET /api/leaderboard/player/:address
```

**Data Structure:**
```typescript
interface LeaderboardEntry {
  rank: number
  address: string
  displayName: string
  avatar?: string
  stats: {
    profit: number
    volume: number
    winRate: number
    totalBets: number
    biggestWin: number
    currentStreak: number
  }
  badge: 'gold' | 'silver' | 'bronze' | null
}
```

---

## Phase 3: Enhanced Games (Priority: MEDIUM)
**Timeline:** 5-7 days
**Impact:** New game variety
**Dependencies:** Phase 1 (sound system)

### 3.1 Ultra Coin Flip 🪙
**Status:** NEW GAME
**Priority:** MEDIUM

**Features:**
- 3D coin flip animation (CSS3 + Framer Motion)
- Physics-based rotation
- Particle effects on landing
- 50/50 odds with configurable multiplier
- Betting on Heads or Tails
- Provably fair with seed verification

**Implementation:**
```
/src/app/coinflip/
├── page.tsx
├── CoinFlip3D.tsx
├── CoinPhysics.tsx
└── CoinParticles.tsx
```

**Game Logic:**
```typescript
const coinFlipGame = {
  odds: 0.5,
  multiplier: 1.98,  // 1% house edge
  outcomes: ['heads', 'tails'],
  animation: '3D rotation with physics'
}
```

**Backend Integration:**
```
POST /api/coinflip/bet
{
  amount: number,
  choice: 'heads' | 'tails',
  publicSeed: string
}

Response:
{
  result: 'heads' | 'tails',
  won: boolean,
  payout: number,
  privateSeed: string,
  privateHash: string
}
```

---

### 3.2 Ultra Slots 🎰
**Status:** NEW GAME
**Priority:** MEDIUM

**Features:**
- 5-reel slot machine
- Multiple symbols (cherry, lemon, bar, seven, diamond, jackpot)
- Jackpot mode (progressive or fixed)
- Bonus rounds
- Free spins on scatter symbols
- Animated reel spinning
- Sound effects for each symbol
- Win line animations

**Symbols & Payouts:**
```typescript
const slotSymbols = {
  jackpot: { payout: 1000, probability: 0.001 },
  diamond: { payout: 100, probability: 0.01 },
  seven: { payout: 50, probability: 0.02 },
  bar: { payout: 25, probability: 0.05 },
  lemon: { payout: 10, probability: 0.1 },
  cherry: { payout: 5, probability: 0.2 },
  scatter: { payout: 0, probability: 0.05, bonus: 'free_spins' }
}
```

**Implementation:**
```
/src/app/slots/
├── page.tsx
├── SlotMachine.tsx
├── SlotReel.tsx
├── WinLineAnimation.tsx
├── JackpotDisplay.tsx
└── PaytableModal.tsx
```

**Backend Integration:**
```
POST /api/slots/spin
{
  amount: number,
  lines: number (1-5),
  publicSeed: string
}

Response:
{
  reels: [string[], string[], string[], string[], string[]],
  winLines: { line: number, symbols: string[], payout: number }[],
  totalPayout: number,
  bonusTriggered: boolean,
  privateSeed: string
}
```

---

### 3.3 3D Game Selector 🎯
**Status:** ENHANCEMENT
**Priority:** LOW

**Current State:**
- Basic card grid on landing page
- 2D hover effects

**Enhancements:**
- 3D card rotation on hover
- Animated game preview
- Game metadata display:
  - Difficulty level
  - Min/Max bet
  - Max payout
  - Player count (live)
  - House edge
- Feature tags (NEW, HOT, JACKPOT)
- Card flip animation to show stats
- Smooth transitions

**Implementation:**
```
/src/components/games/GameSelector3D.tsx
/src/components/games/GameCard3D.tsx
```

**Game Metadata:**
```typescript
interface GameMeta {
  id: string
  name: string
  image: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  minBet: number
  maxBet: number
  maxPayout: number
  houseEdge: number
  tags: ('new' | 'hot' | 'jackpot' | 'live')[]
  activePlayers: number
}
```

---

## Phase 4: UI/UX Enhancements (Priority: MEDIUM)
**Timeline:** 2-3 days
**Impact:** Better user experience
**Dependencies:** Phase 1 & 2

### 4.1 Stat Card Component 💎
**Status:** NEW COMPONENT
**Priority:** MEDIUM

**Purpose:**
- Reusable metric display component
- Used in dashboard, game pages, leaderboard

**Features:**
- Icon support
- Trend indicators (↑ ↓)
- Percentage changes
- Loading states
- Animated number counters
- Responsive sizing

**Implementation:**
```typescript
// /src/components/StatCard.tsx
interface StatCardProps {
  title: string
  value: number | string
  icon?: React.ReactNode
  trend?: { direction: 'up' | 'down', value: number }
  format?: 'currency' | 'number' | 'percentage'
  loading?: boolean
}
```

---

### 4.2 Enhanced Navigation 🧭
**Status:** ENHANCEMENT
**Priority:** LOW

**Current State:**
- Basic sidebar navigation
- Wallet connect in navbar

**Enhancements:**
- Breadcrumb navigation
- Active route highlighting (improved)
- Mobile bottom navigation
- Quick actions menu
- User profile dropdown
- Notification center
- Settings modal

---

## Phase 5: Advanced Features (Future)
**Timeline:** TBD
**Impact:** Platform maturity
**Dependencies:** All previous phases

### 5.1 Social Login Integration 🔐
**Status:** PLANNED
**Priority:** LOW

**Providers:**
- Google OAuth 2.0
- Discord OAuth
- Twitter/X OAuth
- Email/Password (fallback)

**Implementation:**
- Install: `next-auth`
- Link social accounts to Coreum wallet
- Profile management

---

### 5.2 Telegram Bot Integration 🤖
**Status:** PLANNED
**Priority:** LOW

**Features:**
- Bet notifications
- Win alerts
- Balance updates
- Game tips
- Chat roulette (as mentioned in solana repo)

---

### 5.3 Achievements System 🏅
**Status:** PLANNED
**Priority:** LOW

**Achievement Categories:**
- First bet
- First win
- Win streaks (5, 10, 25, 50, 100)
- Volume milestones
- Profit milestones
- Game-specific achievements
- Referral achievements

---

## Technical Migration Considerations

### Framework Differences
| Aspect | Solana Casino | CozyCasino | Migration Strategy |
|--------|---------------|------------|-------------------|
| Framework | Vite + React Router | Next.js 15 | Port components, adapt routing |
| State Management | Zustand | React Context | Introduce Zustand selectively |
| Styling | Tailwind + Styled | Tailwind + Styled | Compatible ✅ |
| Animations | Framer Motion | Framer Motion | Compatible ✅ |
| Blockchain | Solana | Coreum | Keep Coreum, adapt logic |
| Charts | Chart.js | None | Add Chart.js |

### Dependency Additions
```json
{
  "react-hot-toast": "^2.4.1",
  "chart.js": "^4.4.0",
  "react-chartjs-2": "^5.2.0",
  "zustand": "^4.4.7",
  "emoji-picker-react": "^4.5.16"
}
```

### Backend API Requirements
**New Endpoints Needed:**
```
# Chat
POST   /api/chat/send
GET    /api/chat/history
Socket /chat (namespace)

# Dashboard
GET    /api/dashboard/stats
GET    /api/dashboard/profit-history
GET    /api/dashboard/game-distribution

# Leaderboard
GET    /api/leaderboard
GET    /api/leaderboard/player/:address

# New Games
POST   /api/coinflip/bet
POST   /api/slots/spin
GET    /api/slots/jackpot
```

### Database Schema Updates
```sql
-- Chat Messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY,
  user_address VARCHAR(64) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  edited BOOLEAN DEFAULT FALSE,
  deleted BOOLEAN DEFAULT FALSE
);

-- User Stats (for dashboard)
CREATE TABLE user_stats (
  address VARCHAR(64) PRIMARY KEY,
  total_bets INTEGER DEFAULT 0,
  total_wagered DECIMAL(20,6) DEFAULT 0,
  total_profit DECIMAL(20,6) DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  total_losses INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  biggest_win DECIMAL(20,6) DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Leaderboard Cache
CREATE TABLE leaderboard_cache (
  category VARCHAR(50),
  time_range VARCHAR(20),
  data JSONB,
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (category, time_range)
);
```

---

## Testing Strategy

### Unit Tests
- Chat message validation
- Sound system state management
- Dashboard calculation logic
- Leaderboard ranking algorithm

### Integration Tests
- Socket.io chat event flow
- API endpoint responses
- Wallet integration with new features

### E2E Tests
- Chat workflow (join, send, receive)
- Dashboard data loading
- Leaderboard navigation
- New game betting flow

---

## Performance Optimization

### Code Splitting
```typescript
// Dynamic imports for heavy components
const AdvancedDashboard = dynamic(() => import('@/components/dashboard/AdvancedDashboard'))
const ChatWidget = dynamic(() => import('@/components/Chat/ChatWidget'))
```

### Caching Strategy
- Leaderboard: Cache for 5 minutes
- Dashboard stats: Cache for 1 minute
- Chat history: Cache last 100 messages
- Sound files: Preload on app init

### Bundle Size Management
- Chart.js: Use tree-shaking for required components only
- Emoji picker: Lazy load on demand
- Images: Next.js Image optimization

---

## Security Considerations

### Chat System
- Rate limiting: 5 messages per 10 seconds
- Profanity filter integration
- Admin moderation tools
- Report/block functionality
- XSS prevention (sanitize messages)

### API Security
- CORS configuration
- Rate limiting on all endpoints
- JWT token validation
- Input sanitization
- SQL injection prevention

---

## Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Bundle size < 500KB (gzipped)
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Mobile responsive verified
- [ ] Wallet connection tested
- [ ] Socket.io connections stable

### Backend Deployment
- [ ] New API endpoints deployed
- [ ] Socket.io namespace configured
- [ ] Database migrations run
- [ ] Environment variables set
- [ ] SSL certificates valid

### Post-deployment
- [ ] Monitor error logs
- [ ] Check Socket.io connection count
- [ ] Verify chat message delivery
- [ ] Dashboard data accuracy
- [ ] Leaderboard updates

---

## Success Metrics

### User Engagement
- Chat activity: Messages per hour
- Average session duration increase
- Return user rate
- Leaderboard views

### Technical Metrics
- API response time < 200ms
- Socket.io latency < 50ms
- Page load time < 2s
- First contentful paint < 1s

### Business Metrics
- New game adoption rate
- Bet volume increase
- User retention rate
- Feature usage analytics

---

## Risk Mitigation

### Technical Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Socket.io connection drops | Medium | High | Implement reconnection logic |
| Chart.js bundle size | Low | Medium | Use tree-shaking |
| Chat spam | High | Medium | Rate limiting + moderation |
| Leaderboard manipulation | Medium | High | Server-side validation |
| Sound performance on mobile | Medium | Low | Lazy loading |

---

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 1 | 1-2 days | Chat, Toast, Sound System |
| Phase 2 | 3-5 days | Dashboard, Leaderboard |
| Phase 3 | 5-7 days | Coin Flip, Slots, 3D Selector |
| Phase 4 | 2-3 days | StatCard, Enhanced Navigation |
| Phase 5 | TBD | Social Login, Telegram Bot |

**Total Estimated Time:** 11-17 days for Phases 1-4

---

## Contact & Support

**Implementation Questions:**
- Refer to inline code documentation
- Check component README files
- Review Solana casino platform source

**Backend API:**
- Base URL: `https://casino.truebliss.dev/api`
- Socket URL: `https://casino.truebliss.dev`

---

## Appendix

### A. Color Palette (Coreum Theme)
```css
--coreum-primary: #25D695
--coreum-dark: #101216
--coreum-dark-bg: #030612
--cozy-green: #25D695
--cozy-gold: #FFD700
--dark-900: #030612
--dark-600: #0e141d
--dark-500: #141923
```

### B. Font Stack
```css
--font-bangers: 'Bangers', cursive
--font-geist: 'Geist', sans-serif
--font-pacifico: 'Pacifico', cursive
```

### C. Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

**Document Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Ready for Implementation
