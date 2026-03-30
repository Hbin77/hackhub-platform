'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import RecommendModal from './RecommendModal';

export default function RecommendButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-primary-hover"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ boxShadow: '0 0 20px rgba(108, 92, 231, 0.4)' }}
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.09 6.26L20.18 9l-5.09 3.74L16.18 19 12 15.27 7.82 19l1.09-6.26L3.82 9l6.09-.74z" />
        </svg>
        AI 추천
      </motion.button>
      <RecommendModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
