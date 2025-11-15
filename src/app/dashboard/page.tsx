"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '@/layout/layout';
import { useCoreumWallet } from '@/providers/coreum';
import StatCard from '@/components/dashboard/StatCard';
import ProfitChart from '@/components/dashboard/ProfitChart';
import GameDistribution from '@/components/dashboard/GameDistribution';
import { showError, showLoading, dismissToast } from '@/util/toast';
import axios from '@/util/axios';

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

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const TimeButton = styled.button<{ $isActive: boolean }>`
  padding: 10px 20px;
  background: ${props => props.$isActive
    ? 'linear-gradient(135deg, #25D695 0%, #1fb67a 100%)'
    : 'rgba(37, 214, 149, 0.1)'
  };
  border: 1px solid ${props => props.$isActive ? '#25D695' : 'rgba(37, 214, 149, 0.3)'};
  border-radius: 10px;
  color: ${props => props.$isActive ? '#101216' : '#25D695'};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 214, 149, 0.3);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartContainer = styled.div`
  background: rgba(14, 20, 29, 0.8);
  border: 1px solid rgba(37, 214, 149, 0.2);
  border-radius: 16px;
  padding: 24px;
`;

const ChartTitle = styled.h3`
  font-size: 20px;
  color: #25D695;
  margin: 0 0 20px 0;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 32px;
  color: rgba(255, 255, 255, 0.5);
`;

type TimeRange = '24h' | '7d' | '30d' | '90d' | 'all';

interface DashboardStats {
  totalBets: number;
  totalWagered: number;
  totalProfit: number;
  winRate: number;
  biggestWin: number;
  biggestLoss: number;
  favoriteGame: string;
  currentStreak: number;
  gamesPlayed: {
    crash: number;
    mines: number;
    slide: number;
    videoPoker: number;
  };
}

const DashboardPage: React.FC = () => {
  const { address, isConnected } = useCoreumWallet();
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      fetchDashboardStats();
    }
  }, [timeRange, address, isConnected]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    const toastId = showLoading('Loading dashboard...');

    try {
      // Mock data - replace with actual API call
      // const response = await axios.get(`/dashboard/stats?timeRange=${timeRange}&address=${address}`);

      // Generate mock data
      const mockStats: DashboardStats = {
        totalBets: Math.floor(Math.random() * 500),
        totalWagered: Math.random() * 10000,
        totalProfit: Math.random() * 2000 - 1000,
        winRate: Math.random() * 100,
        biggestWin: Math.random() * 1000,
        biggestLoss: Math.random() * -500,
        favoriteGame: 'Crash',
        currentStreak: Math.floor(Math.random() * 10),
        gamesPlayed: {
          crash: Math.floor(Math.random() * 200),
          mines: Math.floor(Math.random() * 150),
          slide: Math.floor(Math.random() * 100),
          videoPoker: Math.floor(Math.random() * 80),
        },
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      showError('Failed to load dashboard');
    } finally {
      dismissToast(toastId);
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Layout>
        <Container>
          <EmptyState>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>
              Connect your wallet
            </div>
            <div>Please connect your Coreum wallet to view your dashboard</div>
          </EmptyState>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <PageHeader>
          <PageTitle>📊 Dashboard</PageTitle>
          <PageSubtitle>Track your gaming performance and statistics</PageSubtitle>
        </PageHeader>

        <TimeRangeSelector>
          <TimeButton $isActive={timeRange === '24h'} onClick={() => setTimeRange('24h')}>
            24 Hours
          </TimeButton>
          <TimeButton $isActive={timeRange === '7d'} onClick={() => setTimeRange('7d')}>
            7 Days
          </TimeButton>
          <TimeButton $isActive={timeRange === '30d'} onClick={() => setTimeRange('30d')}>
            30 Days
          </TimeButton>
          <TimeButton $isActive={timeRange === '90d'} onClick={() => setTimeRange('90d')}>
            90 Days
          </TimeButton>
          <TimeButton $isActive={timeRange === 'all'} onClick={() => setTimeRange('all')}>
            All Time
          </TimeButton>
        </TimeRangeSelector>

        {loading || !stats ? (
          <EmptyState>Loading...</EmptyState>
        ) : (
          <>
            <StatsGrid>
              <StatCard
                title="Total Bets"
                value={stats.totalBets}
                icon="🎲"
                format="number"
              />
              <StatCard
                title="Total Wagered"
                value={stats.totalWagered}
                icon="💰"
                format="currency"
                trend={timeRange !== 'all' ? { direction: 'up', value: 12.5 } : undefined}
              />
              <StatCard
                title="Total Profit"
                value={stats.totalProfit}
                icon={stats.totalProfit >= 0 ? '📈' : '📉'}
                format="currency"
                trend={timeRange !== 'all' ? {
                  direction: stats.totalProfit >= 0 ? 'up' : 'down',
                  value: Math.abs(stats.totalProfit / stats.totalWagered * 100)
                } : undefined}
              />
              <StatCard
                title="Win Rate"
                value={stats.winRate}
                icon="🎯"
                format="percentage"
              />
              <StatCard
                title="Biggest Win"
                value={stats.biggestWin}
                icon="💎"
                format="currency"
              />
              <StatCard
                title="Current Streak"
                value={stats.currentStreak}
                icon="🔥"
                format="number"
              />
            </StatsGrid>

            <ChartsGrid>
              <ChartContainer>
                <ChartTitle>Profit Over Time</ChartTitle>
                <ProfitChart timeRange={timeRange} />
              </ChartContainer>

              <ChartContainer>
                <ChartTitle>Game Distribution</ChartTitle>
                <GameDistribution gamesPlayed={stats.gamesPlayed} />
              </ChartContainer>
            </ChartsGrid>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default DashboardPage;
