import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { projects } from '../data/projects';

function WebflowInspirationSectionVertical({ project }) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Les 3 bandes verticales se rétractent (scaleX de 1 à 0) lors du scroll de la section 200vh
  const curtainScaleX = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[200vh] bg-ink block overflow-visible"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">

        <div className="group relative block w-full h-full overflow-hidden">
          {/* Contenu Texte + Image */}
          <div className="inspiration_content-wrapper absolute inset-0 overflow-hidden w-full h-full flex items-center">

            {/* Texte "Design inspiré par la nature" */}
            <div className="absolute z-30 left-8 md:left-20 max-w-xl pointer-events-none">
              <div className="padding-global">
                <div className="container-large">
                  <div className="padding-section-small">
                    <div className="story_content-wrapper">
                      <h2 className="heading-style-h2 font-display text-5xl italic leading-tight sm:text-7xl md:text-8xl text-paper drop-shadow-lg">
                        Design inspiré par la nature
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image de fond */}
            <div className="inspiration_image-wrapper absolute inset-0 w-full h-full">
              <img
                src={project.image}
                alt={project.name}
                className="inspiration_bg-image w-full h-full object-cover grayscale transition-transform duration-[1200ms] ease-editorial group-hover:scale-105"
              />
              <div className="inspiration_bg-image-overlay absolute inset-0 bg-ink/20 transition-colors duration-500 group-hover:bg-ink/10" />
            </div>

            {/* Les 3 blocs rideaux verticaux côte à côte */}
            <motion.div
              style={{ scaleX: curtainScaleX }}
              className="inspiration_curtain-block is-1 absolute inset-y-0 left-0 w-1/3 bg-ink z-20 origin-left"
            />

            <motion.div
              style={{ scaleX: curtainScaleX }}
              className="inspiration_curtain-block is-2 absolute inset-y-0 left-1/3 w-1/3 bg-ink z-20 origin-center"
            />

            <motion.div
              style={{ scaleX: curtainScaleX }}
              className="inspiration_curtain-block is-3 absolute inset-y-0 right-0 w-1/3 bg-ink z-20 origin-right"
            />

          </div>
        </div>

      </div>
    </section>
  );
}

export default function ProjectsSection() {
  const firstProject = projects[0];

  return (
    <div className="bg-ink text-paper">
      {/* 1. La section d'inspiration avec 3 bandes verticales et le premier projet */}
      {firstProject && <WebflowInspirationSectionVertical project={firstProject} />}
    </div>
  );
}