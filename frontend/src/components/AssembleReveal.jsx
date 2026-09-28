import { motion } from 'framer-motion';

const stripVariants = {
  hidden: (i) => ({
    opacity: 0,
    y: i % 2 === 0 ? -48 : 48,
    scale: 1.08,
  }),
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function AssembleReveal({ image, alt, aspect = 'aspect-[16/9]' }) {
  return (
    <div className={`relative ${aspect} w-full overflow-hidden bg-ink`} role="img" aria-label={alt}>
      <div className="absolute inset-0 flex">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={stripVariants}
            className="h-full w-1/3 bg-graphite/40"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: '300% 100%',
              backgroundPosition: `${i * 50}% center`,
              filter: 'grayscale(1) contrast(1.05)',
            }}
          />
        ))}
      </div>
    </div>
  );
}