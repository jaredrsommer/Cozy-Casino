'use client'

import GameCard3D from '@/components/GameSelector/GameCard3D'
import { GAME_METADATA } from '@/types/games'
import { motion } from 'framer-motion'

export default function LandingPage() {
    return (
        <div className='bg-casino w-screen min-h-screen bg-center bg-cover bg-no-repeat'>
            <div className='w-full bg-black/60 backdrop-blur-sm min-h-screen relative flex flex-col items-center justify-center py-8 px-4'>
                <motion.div
                    className='text-center mb-12'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className='text-5xl md:text-6xl font-bangers text-cozy-green mb-3'>
                        Choose Your Game
                    </h1>
                    <p className='text-white/80 text-lg md:text-xl'>
                        Provably fair games on Coreum blockchain
                    </p>
                    <p className='text-cozy-green/60 text-sm mt-2'>
                        ✨ Hover over cards for details • Click to play ✨
                    </p>
                </motion.div>

                <motion.div
                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {GAME_METADATA.map((game, idx) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx, duration: 0.4 }}
                        >
                            <GameCard3D game={game} />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className='mt-12 text-center'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <p className='text-gray-400 text-sm'>
                        🔒 All games are provably fair and secured by Coreum blockchain
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
