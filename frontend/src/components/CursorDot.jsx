import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useCursor } from './CursorContext';

export default function CursorDot() {
  const { label } = useCursor();
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, { damping: 24, stiffness: 220, mass: 0.4 });
  const springY = useSpring(mouseY, { damping: 24, stiffness: 220, mass: 0.4 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const handleMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden items-center justify-center rounded-full md:flex"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        mixBlendMode: label ? 'normal' : 'difference',
      }}
      animate={{
        width: label ? 88 : 10,
        height: label ? 88 : 10,
        backgroundColor: label ? '#000000' : '#ffffff',
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence>
        {label && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-[10px] uppercase tracking-[0.15em] text-paper"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}