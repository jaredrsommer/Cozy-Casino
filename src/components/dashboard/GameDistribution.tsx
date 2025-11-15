"use client";

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GameDistributionProps {
  gamesPlayed: {
    crash: number;
    mines: number;
    slide: number;
    videoPoker: number;
  };
}

const GameDistribution: React.FC<GameDistributionProps> = ({ gamesPlayed }) => {
  const data = {
    labels: ['Crash', 'Mines', 'Slide', 'Video Poker'],
    datasets: [
      {
        label: 'Games Played',
        data: [
          gamesPlayed.crash,
          gamesPlayed.mines,
          gamesPlayed.slide,
          gamesPlayed.videoPoker,
        ],
        backgroundColor: [
          'rgba(37, 214, 149, 0.8)',
          'rgba(255, 215, 0, 0.8)',
          'rgba(74, 158, 255, 0.8)',
          'rgba(255, 107, 107, 0.8)',
        ],
        borderColor: [
          '#25D695',
          '#FFD700',
          '#4a9eff',
          '#ff6b6b',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          padding: 15,
          font: {
            size: 13,
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#0e141d',
        titleColor: '#25D695',
        bodyColor: '#ffffff',
        borderColor: '#25D695',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default GameDistribution;
