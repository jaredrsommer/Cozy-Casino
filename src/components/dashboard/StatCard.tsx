"use client";

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { formatAmount } from '@/util/formatAmount';

const Card = styled(motion.div)`
  background: linear-gradient(135deg, rgba(37, 214, 149, 0.05) 0%, rgba(14, 20, 29, 0.8) 100%);
  border: 1px solid rgba(37, 214, 149, 0.2);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(37, 214, 149, 0.2);
    border-color: #25D695;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CardTitle = styled.h4`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardIcon = styled.div`
  font-size: 24px;
  opacity: 0.8;
`;

const CardValue = styled.div<{ $isPositive?: boolean; $isNegative?: boolean }>`
  font-size: 32px;
  font-weight: bold;
  color: ${props => {
    if (props.$isPositive) return '#25D695';
    if (props.$isNegative) return '#ff6b6b';
    return '#25D695';
  }};
  margin-bottom: 8px;
  font-family: 'Geist Mono', monospace;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const TrendContainer = styled.div<{ $isPositive: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${props => props.$isPositive ? '#25D695' : '#ff6b6b'};
  font-weight: 600;
`;

const TrendIcon = styled.span`
  font-size: 14px;
`;

const LoadingSkeleton = styled.div`
  background: linear-gradient(
    90deg,
    rgba(37, 214, 149, 0.1) 0%,
    rgba(37, 214, 149, 0.2) 50%,
    rgba(37, 214, 149, 0.1) 100%
  );
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
  border-radius: 8px;
  height: 32px;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

interface StatCardProps {
  title: string;
  value: number;
  icon?: string;
  format?: 'number' | 'currency' | 'percentage';
  trend?: {
    direction: 'up' | 'down';
    value: number;
  };
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  format = 'number',
  trend,
  loading = false,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Animated counter effect
  useEffect(() => {
    if (loading) return;

    let start = 0;
    const end = value;
    const duration = 1000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, loading]);

  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return `${val >= 0 ? '' : '-'}${formatAmount(Math.abs(val), 2)} COREUM`;
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'number':
      default:
        return Math.floor(val).toLocaleString();
    }
  };

  const isPositive = value >= 0;
  const isNegative = value < 0;

  return (
    <Card
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {icon && <CardIcon>{icon}</CardIcon>}
      </CardHeader>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <CardValue
            $isPositive={format === 'currency' && isPositive}
            $isNegative={format === 'currency' && isNegative}
          >
            {formatValue(displayValue)}
          </CardValue>

          {trend && (
            <TrendContainer $isPositive={trend.direction === 'up'}>
              <TrendIcon>
                {trend.direction === 'up' ? '↑' : '↓'}
              </TrendIcon>
              <span>{trend.value.toFixed(1)}% vs last period</span>
            </TrendContainer>
          )}
        </>
      )}
    </Card>
  );
};

export default StatCard;
