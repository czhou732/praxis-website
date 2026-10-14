import { useEffect } from 'react'

/* Apple-style staggered reveal: adds .sr-visible to .scroll-reveal elements as
   they enter the viewport. Without it, html.js keeps them at opacity 0. */
export function useScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.scroll-reveal, .scroll-reveal-img').forEach(el => el.classList.add('sr-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    )

    document.querySelectorAll('.scroll-reveal, .scroll-reveal-img').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}
