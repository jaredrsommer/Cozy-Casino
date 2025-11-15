"use client";

import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        className: '',
        duration: 3000,
        style: {
          background: '#0e141d',
          color: '#fff',
          border: '1px solid #25D695',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(37, 214, 149, 0.2)',
        },
        // Success
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#25D695',
            secondary: '#0e141d',
          },
        },
        // Error
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ff6b6b',
            secondary: '#0e141d',
          },
          style: {
            background: '#0e141d',
            color: '#fff',
            border: '1px solid #ff6b6b',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.2)',
          },
        },
        // Loading
        loading: {
          iconTheme: {
            primary: '#4a9eff',
            secondary: '#0e141d',
          },
        },
      }}
    />
  );
};

export default ToastProvider;
