import { useState, useEffect } from 'react'

export function useTypewriter(text, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let timeout
    let interval

    timeout = setTimeout(() => {
      let i = 0
      interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i === text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [text, speed, startDelay])

  return { displayed, done }
}
