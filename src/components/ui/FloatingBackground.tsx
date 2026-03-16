"use client"

import { useEffect, useState } from "react"

const ICONS = ["🛒", "🥦", "🍎", "🥛", "🥑", "🥖", "🛍️", "🥫", "🧊", "🧀"]

interface FloatingItem {
  id: number
  icon: string
  left: number
  animationDuration: number
  opacity: number
  size: number
  delay: number
}

export default function FloatingBackground() {
  const [items, setItems] = useState<FloatingItem[]>([])

  useEffect(() => {
    // Solo generamos posiciones en el cliente para evitar hidratación fallida en Next.js SSR
    const generatedItems = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      icon: ICONS[Math.floor(Math.random() * ICONS.length)],
      left: Math.random() * 100, // porcentaje de X
      animationDuration: 25 + Math.random() * 20, // entre 25s y 45s
      opacity: 0.1 + Math.random() * 0.15, // opacidad entre 0.1 y 0.25
      size: 2 + Math.random() * 3, // tamaño en rem (entre 2rem y 5rem)
      delay: Math.random() * 20, // delay inicial aleatorio
    }))
    setItems(generatedItems)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[-10] overflow-hidden" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatUp {
          from {
            transform: translateY(110vh) rotate(0deg);
          }
          to {
            transform: translateY(-20vh) rotate(360deg);
          }
        }
        @keyframes sway {
          0%, 100% {
            margin-left: -20px;
          }
          50% {
            margin-left: 20px;
          }
        }
        .float-icon {
          animation: floatUp linear infinite, sway ease-in-out infinite alternate;
        }
      `}} />
      
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute float-icon will-change-transform select-none"
          style={{
            left: `${item.left}%`,
            fontSize: `${item.size}rem`,
            opacity: item.opacity,
            animationDuration: `${item.animationDuration}s, ${5 + Math.random() * 5}s`,
            animationDelay: `-${item.delay}s`,
            filter: "blur(0.5px)",
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  )
}
