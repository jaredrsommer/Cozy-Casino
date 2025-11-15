"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProfitChartProps {
  timeRange: '24h' | '7d' | '30d' | '90d' | 'all';
}

const ProfitChart: React.FC<ProfitChartProps> = ({ timeRange }) => {
  // Generate mock data based on time range
  const generateData = () => {
    let dataPoints = 7;
    let labels: string[] = [];

    switch (timeRange) {
      case '24h':
        dataPoints = 24;
        labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
        break;
      case '7d':
        dataPoints = 7;
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        break;
      case '30d':
        dataPoints = 30;
        labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
        break;
      case '90d':
        dataPoints = 12;
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        break;
      case 'all':
        dataPoints = 12;
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        break;
    }

    const data = Array.from({ length: dataPoints }, () => Math.random() * 2000 - 500);

    return { labels, data };
  };

  const { labels, data } = generateData();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Profit (COREUM)',
        data,
        borderColor: '#25D695',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(37, 214, 149, 0.3)');
          gradient.addColorStop(1, 'rgba(37, 214, 149, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#25D695',
        pointBorderColor: '#101216',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0e141d',
        titleColor: '#25D695',
        bodyColor: '#ffffff',
        borderColor: '#25D695',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            return `${value >= 0 ? '+' : ''}${value.toFixed(2)} COREUM`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(37, 214, 149, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(37, 214, 149, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 11,
          },
          callback: (value: any) => {
            return `${value >= 0 ? '+' : ''}${value}`;
          },
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default ProfitChart;
