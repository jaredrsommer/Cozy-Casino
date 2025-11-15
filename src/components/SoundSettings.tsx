"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdvancedSound } from '@/hooks/useAdvancedSound';

const SettingsButton = styled.button`
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #25D695 0%, #1fb67a 100%);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 16px rgba(37, 214, 149, 0.4);
  transition: all 0.2s;
  z-index: 999;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 24px rgba(37, 214, 149, 0.6);
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    bottom: 70px;
    right: 10px;
  }
`;

const SettingsPanel = styled(motion.div)`
  position: fixed;
  bottom: 150px;
  right: 20px;
  width: 320px;
  background: linear-gradient(135deg, #0e141d 0%, #101216 100%);
  border: 1px solid #25D695;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(37, 214, 149, 0.3);
  z-index: 999;

  @media (max-width: 768px) {
    width: calc(100vw - 40px);
    right: 10px;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #25D695;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 20px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #25D695;
    transform: scale(1.1);
  }
`;

const VolumeControl = styled.div`
  margin-bottom: 20px;
`;

const ControlHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ControlLabel = styled.label`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VolumeValue = styled.span`
  font-size: 12px;
  color: #25D695;
  font-family: monospace;
  font-weight: bold;
`;

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
`;

const VolumeSlider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(37, 214, 149, 0.2);
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #25D695;
    cursor: pointer;
    box-shadow: 0 0 8px rgba(37, 214, 149, 0.6);
    transition: all 0.2s;

    &:hover {
      transform: scale(1.2);
      box-shadow: 0 0 12px rgba(37, 214, 149, 0.8);
    }
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #25D695;
    cursor: pointer;
    box-shadow: 0 0 8px rgba(37, 214, 149, 0.6);
    border: none;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.2);
      box-shadow: 0 0 12px rgba(37, 214, 149, 0.8);
    }
  }
`;

const MuteButton = styled.button<{ $isMuted: boolean }>`
  background: ${props => props.$isMuted ? 'rgba(255, 107, 107, 0.2)' : 'rgba(37, 214, 149, 0.1)'};
  border: 1px solid ${props => props.$isMuted ? '#ff6b6b' : '#25D695'};
  color: ${props => props.$isMuted ? '#ff6b6b' : '#25D695'};
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  min-width: 32px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
  }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(37, 214, 149, 0.2);
  margin: 16px 0;
`;

const SoundSettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sound = useAdvancedSound();

  // Initialize audio on mount
  useEffect(() => {
    sound.initializeAudio();

    // Auto-play music on first user interaction
    const handleFirstInteraction = () => {
      if (!sound.currentMusic && !sound.isMusicMuted) {
        sound.playMusic('main');
      }
      window.removeEventListener('click', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  return (
    <>
      <SettingsButton onClick={() => setIsOpen(!isOpen)} title="Sound Settings">
        🔊
      </SettingsButton>

      <AnimatePresence>
        {isOpen && (
          <SettingsPanel
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <PanelHeader>
              <PanelTitle>🎵 Sound Settings</PanelTitle>
              <CloseButton onClick={() => setIsOpen(false)}>✕</CloseButton>
            </PanelHeader>

            {/* Master Volume */}
            <VolumeControl>
              <ControlHeader>
                <ControlLabel>
                  <MuteButton
                    $isMuted={sound.isMasterMuted}
                    onClick={sound.toggleMasterMute}
                  >
                    {sound.isMasterMuted ? '🔇' : '🔊'}
                  </MuteButton>
                  Master Volume
                </ControlLabel>
                <VolumeValue>{sound.masterVolume}%</VolumeValue>
              </ControlHeader>
              <SliderContainer>
                <VolumeSlider
                  type="range"
                  min="0"
                  max="100"
                  value={sound.masterVolume}
                  onChange={(e) => sound.setMasterVolume(Number(e.target.value))}
                />
              </SliderContainer>
            </VolumeControl>

            <Divider />

            {/* Music Volume */}
            <VolumeControl>
              <ControlHeader>
                <ControlLabel>
                  <MuteButton
                    $isMuted={sound.isMusicMuted}
                    onClick={sound.toggleMusicMute}
                  >
                    {sound.isMusicMuted ? '🔇' : '🎵'}
                  </MuteButton>
                  Music
                </ControlLabel>
                <VolumeValue>{sound.musicVolume}%</VolumeValue>
              </ControlHeader>
              <SliderContainer>
                <VolumeSlider
                  type="range"
                  min="0"
                  max="100"
                  value={sound.musicVolume}
                  onChange={(e) => sound.setMusicVolume(Number(e.target.value))}
                />
              </SliderContainer>
            </VolumeControl>

            {/* SFX Volume */}
            <VolumeControl>
              <ControlHeader>
                <ControlLabel>
                  <MuteButton
                    $isMuted={sound.isSfxMuted}
                    onClick={sound.toggleSfxMute}
                  >
                    {sound.isSfxMuted ? '🔇' : '🔔'}
                  </MuteButton>
                  Sound Effects
                </ControlLabel>
                <VolumeValue>{sound.sfxVolume}%</VolumeValue>
              </ControlHeader>
              <SliderContainer>
                <VolumeSlider
                  type="range"
                  min="0"
                  max="100"
                  value={sound.sfxVolume}
                  onChange={(e) => sound.setSfxVolume(Number(e.target.value))}
                />
              </SliderContainer>
            </VolumeControl>

            {/* Ambient Volume */}
            <VolumeControl>
              <ControlHeader>
                <ControlLabel>
                  <MuteButton
                    $isMuted={sound.isAmbientMuted}
                    onClick={sound.toggleAmbientMute}
                  >
                    {sound.isAmbientMuted ? '🔇' : '🌊'}
                  </MuteButton>
                  Ambient
                </ControlLabel>
                <VolumeValue>{sound.ambientVolume}%</VolumeValue>
              </ControlHeader>
              <SliderContainer>
                <VolumeSlider
                  type="range"
                  min="0"
                  max="100"
                  value={sound.ambientVolume}
                  onChange={(e) => sound.setAmbientVolume(Number(e.target.value))}
                />
              </SliderContainer>
            </VolumeControl>
          </SettingsPanel>
        )}
      </AnimatePresence>
    </>
  );
};

export default SoundSettings;
