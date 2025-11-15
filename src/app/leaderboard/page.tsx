"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Layout from '@/layout/layout';
import axios from '@/util/axios';
import { formatAmount } from '@/util/formatAmount';
import { useCoreumWallet } from '@/providers/coreum';
import { showError, showLoading, dismissToast } from '@/util/toast';

const Container = styled.div`
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 48px;
  font-weight: bold;
  background: linear-gradient(135deg, #25D695 0%, #FFD700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const Tab = styled.button<{ $isActive: boolean }>`
  padding: 12px 24px;
  background: ${props => props.$isActive
    ? 'linear-gradient(135deg, #25D695 0%, #1fb67a 100%)'
    : 'rgba(37, 214, 149, 0.1)'
  };
  border: 1px solid ${props => props.$isActive ? '#25D695' : 'rgba(37, 214, 149, 0.3)'};
  border-radius: 12px;
  color: ${props => props.$isActive ? '#101216' : '#25D695'};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 214, 149, 0.3);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 12px;
  }
`;

const LeaderboardGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const LeaderboardCard = styled(motion.div)<{ $rank: number }>`
  background: ${props => {
    if (props.$rank === 1) return 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(37, 214, 149, 0.05) 100%)';
    if (props.$rank === 2) return 'linear-gradient(135deg, rgba(192, 192, 192, 0.1) 0%, rgba(37, 214, 149, 0.05) 100%)';
    if (props.$rank === 3) return 'linear-gradient(135deg, rgba(205, 127, 50, 0.1) 0%, rgba(37, 214, 149, 0.05) 100%)';
    return 'rgba(14, 20, 29, 0.8)';
  }};
  border: 1px solid ${props => {
    if (props.$rank === 1) return '#FFD700';
    if (props.$rank === 2) return '#C0C0C0';
    if (props.$rank === 3) return '#CD7F32';
    return 'rgba(37, 214, 149, 0.2)';
  }};
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 20px rgba(37, 214, 149, 0.2);
    border-color: #25D695;
  }

  @media (max-width: 768px) {
    padding: 12px;
    gap: 12px;
  }
`;

const RankBadge = styled.div<{ $rank: number }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => {
    if (props.$rank === 1) return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
    if (props.$rank === 2) return 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)';
    if (props.$rank === 3) return 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)';
    return 'linear-gradient(135deg, #25D695 0%, #1fb67a 100%)';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #101216;
  flex-shrink: 0;
  box-shadow: 0 4px 12px ${props => {
    if (props.$rank === 1) return 'rgba(255, 215, 0, 0.4)';
    if (props.$rank === 2) return 'rgba(192, 192, 192, 0.4)';
    if (props.$rank === 3) return 'rgba(205, 127, 50, 0.4)';
    return 'rgba(37, 214, 149, 0.4)';
  }};

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;

const PlayerInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PlayerName = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #25D695;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const PlayerAddress = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 16px;
  flex: 2;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const StatItem = styled.div`
  text-align: right;

  @media (max-width: 768px) {
    text-align: left;
  }
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
  text-transform: uppercase;
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #25D695;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 32px;
  color: rgba(255, 255, 255, 0.5);
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 64px 32px;
  color: #25D695;
  font-size: 18px;
`;

interface LeaderboardEntry {
  rank: number;
  address: string;
  displayName: string;
  stats: {
    profit: number;
    volume: number;
    winRate: number;
    totalBets: number;
    biggestWin: number;
    currentStreak: number;
  };
}

type LeaderboardCategory = 'profit' | 'volume' | 'winRate' | 'biggestWin';
type TimeRange = '24h' | '7d' | '30d' | 'all';

const LeaderboardPage: React.FC = () => {
  const [category, setCategory] = useState<LeaderboardCategory>('profit');
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useCoreumWallet();

  useEffect(() => {
    fetchLeaderboard();
  }, [category, timeRange]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const toastId = showLoading('Loading leaderboard...');

    try {
      // Mock data for demonstration - replace with actual API call
      // const response = await axios.get(`/leaderboard?category=${category}&timeRange=${timeRange}&limit=25`);

      // Generate mock data
      const mockData: LeaderboardEntry[] = Array.from({ length: 20 }, (_, i) => ({
        rank: i + 1,
        address: `core1${Math.random().toString(36).substring(2, 15)}`,
        displayName: `Player ${i + 1}`,
        stats: {
          profit: Math.random() * 10000 - 5000,
          volume: Math.random() * 50000,
          winRate: Math.random() * 100,
          totalBets: Math.floor(Math.random() * 1000),
          biggestWin: Math.random() * 5000,
          currentStreak: Math.floor(Math.random() * 20),
        },
      }));

      setLeaderboard(mockData);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      showError('Failed to load leaderboard');
    } finally {
      dismissToast(toastId);
      setLoading(false);
    }
  };

  const getCategoryLabel = (cat: LeaderboardCategory) => {
    switch (cat) {
      case 'profit': return 'Highest Profit';
      case 'volume': return 'Highest Volume';
      case 'winRate': return 'Best Win Rate';
      case 'biggestWin': return 'Biggest Win';
    }
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <Layout>
      <Container>
        <PageHeader>
          <PageTitle>
            🏆 Leaderboard
          </PageTitle>
          <PageSubtitle>
            Compete with the best players on CozyCasino
          </PageSubtitle>
        </PageHeader>

        {/* Category Tabs */}
        <TabContainer>
          <Tab
            $isActive={category === 'profit'}
            onClick={() => setCategory('profit')}
          >
            💰 Profit
          </Tab>
          <Tab
            $isActive={category === 'volume'}
            onClick={() => setCategory('volume')}
          >
            📊 Volume
          </Tab>
          <Tab
            $isActive={category === 'winRate'}
            onClick={() => setCategory('winRate')}
          >
            🎯 Win Rate
          </Tab>
          <Tab
            $isActive={category === 'biggestWin'}
            onClick={() => setCategory('biggestWin')}
          >
            💎 Biggest Win
          </Tab>
        </TabContainer>

        {/* Time Range Tabs */}
        <TabContainer>
          <Tab $isActive={timeRange === '24h'} onClick={() => setTimeRange('24h')}>
            24 Hours
          </Tab>
          <Tab $isActive={timeRange === '7d'} onClick={() => setTimeRange('7d')}>
            7 Days
          </Tab>
          <Tab $isActive={timeRange === '30d'} onClick={() => setTimeRange('30d')}>
            30 Days
          </Tab>
          <Tab $isActive={timeRange === 'all'} onClick={() => setTimeRange('all')}>
            All Time
          </Tab>
        </TabContainer>

        {/* Leaderboard List */}
        {loading ? (
          <LoadingState>Loading {getCategoryLabel(category)}...</LoadingState>
        ) : leaderboard.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>
            <div>No leaderboard data available</div>
            <div style={{ fontSize: '14px', marginTop: '8px' }}>
              Be the first to play and claim the top spot!
            </div>
          </EmptyState>
        ) : (
          <LeaderboardGrid>
            {leaderboard.map((entry, index) => (
              <LeaderboardCard
                key={entry.address}
                $rank={entry.rank}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <RankBadge $rank={entry.rank}>
                  {getRankEmoji(entry.rank)}
                </RankBadge>

                <PlayerInfo>
                  <PlayerName>
                    {entry.displayName}
                    {entry.address === address && ' (You)'}
                  </PlayerName>
                  <PlayerAddress>{entry.address}</PlayerAddress>
                </PlayerInfo>

                <StatsGrid>
                  <StatItem>
                    <StatLabel>Profit</StatLabel>
                    <StatValue style={{ color: entry.stats.profit >= 0 ? '#25D695' : '#ff6b6b' }}>
                      {entry.stats.profit >= 0 ? '+' : ''}{formatAmount(entry.stats.profit, 2)} COREUM
                    </StatValue>
                  </StatItem>

                  <StatItem>
                    <StatLabel>Volume</StatLabel>
                    <StatValue>{formatAmount(entry.stats.volume, 2)} COREUM</StatValue>
                  </StatItem>

                  <StatItem>
                    <StatLabel>Win Rate</StatLabel>
                    <StatValue>{entry.stats.winRate.toFixed(1)}%</StatValue>
                  </StatItem>

                  <StatItem>
                    <StatLabel>Total Bets</StatLabel>
                    <StatValue>{entry.stats.totalBets}</StatValue>
                  </StatItem>
                </StatsGrid>
              </LeaderboardCard>
            ))}
          </LeaderboardGrid>
        )}
      </Container>
    </Layout>
  );
};

export default LeaderboardPage;
