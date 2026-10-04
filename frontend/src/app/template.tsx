'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        ease: 'easeOut', 
        duration: 0.35 
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
      }}
    >
      {children}
    </motion.div>
  );
}
