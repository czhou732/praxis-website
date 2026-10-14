import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react'

/* ---------- 3D tilt person card ----------
   Shared by Home (officers) and People (everyone). Links out only when the
   person has a public profile; otherwise the card is a plain block. */
export function PersonCard({ member, index = 0, imgMax = 'max-w-[13rem]' }) {
  const cardRef = useRef(null)

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  // Fluid physics configuration
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  // Rotate based on smooth mouse position
  const rotateX = useTransform(smoothY, [0, 1], [10, -10])
  const rotateY = useTransform(smoothX, [0, 1], [-10, 10])

  // Scale and light opacity with separate springs for feel
  const scale = useSpring(useMotionValue(1), { damping: 20, stiffness: 200 })
  const lightOpacity = useSpring(useMotionValue(0), { damping: 20, stiffness: 100 })

  // Transform coordinates for radial gradient string
  const lightX = useTransform(smoothX, (x) => x * 100)
  const lightY = useTransform(smoothY, (y) => y * 100)
  const lightBg = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, rgba(110,155,255,0.18), transparent 60%)`

  const onMove = (e) => {
    const el = cardRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
    scale.set(1.03)
    lightOpacity.set(1)
  }

  const onLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
    scale.set(1)
    lightOpacity.set(0)
  }

  const Tag = member.href ? 'a' : 'div'
  const linkProps = member.href ? { href: member.href, target: '_blank', rel: 'noopener' } : {}

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="scroll-reveal min-w-0"
      style={{ '--sr-delay': `${index * 0.12}s` }}
    >
      <motion.div style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d', perspective: 800 }}>
        <Tag {...linkProps} className="group block text-inherit no-underline">
          <div className={`relative overflow-hidden rounded-sm ${imgMax}`}>
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                width="384"
                height="512"
                loading="lazy"
                className="aspect-[3/4] w-full object-cover opacity-90 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex aspect-[3/4] w-full items-center justify-center bg-gradient-to-b from-ink/10 to-transparent font-serif text-[2.4rem] text-muted/60 opacity-90 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
              >
                {member.initials}
              </div>
            )}
            <motion.div
              style={{ opacity: lightOpacity, background: lightBg }}
              className="pointer-events-none absolute inset-0"
            />
          </div>
          <p className="mt-4 mb-0.5 font-serif text-[1.25rem] leading-[1.25] tracking-[-0.012em]">{member.name}</p>
          <p className="m-0 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">
            {member.role}
          </p>
          {member.bio && (
            <p className="mt-2.5 mb-0 max-w-[22rem] text-[0.88rem] leading-[1.55] text-ink-2">{member.bio}</p>
          )}
        </Tag>
      </motion.div>
    </div>
  )
}
