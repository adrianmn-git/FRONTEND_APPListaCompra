"use client"

import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCartShopping, faCarrot, faAppleWhole, faGlassWater, faLemon,
  faBreadSlice, faBasketShopping, faBoxArchive, faCube, faCheese,
  faFish, faDrumstickBite, faEgg, faSeedling, faIcicles
} from "@fortawesome/free-solid-svg-icons"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"

const ICONS: IconDefinition[] = [
  faCartShopping, faCarrot, faAppleWhole, faGlassWater, faLemon,
  faBreadSlice, faBasketShopping, faBoxArchive, faCube, faCheese,
  faFish, faDrumstickBite, faEgg, faSeedling, faIcicles
]

interface FloatingItem {
  id: number
  iconIndex: number
  left: number
  animationDuration: number
  opacity: number
  size: number
  delay: number
}

export default function FloatingBackground() {
  const [items, setItems] = useState<FloatingItem[]>([])
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check reduced motion preference
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener("change", handler)

    const generatedItems = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      iconIndex: Math.floor(Math.random() * ICONS.length),
      left: Math.random() * 100,
      animationDuration: 25 + Math.random() * 20,
      opacity: 0.15 + Math.random() * 0.15, // between 0.15 and 0.30
      size: 1.5 + Math.random() * 2.0, // base size up to 3.5rem
      delay: Math.random() * 20,
    }))
    setItems(generatedItems)

    return () => mq.removeEventListener("change", handler)
  }, [])

  if (prefersReducedMotion) return null

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
            margin-left: -15px;
          }
          50% {
            margin-left: 15px;
          }
        }
        .float-icon {
          animation: floatUp linear infinite, sway ease-in-out infinite alternate;
        }
      `}} />
      
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute float-icon will-change-transform select-none text-indigo-400"
          style={{
            left: `${item.left}%`,
            fontSize: `${item.size}rem`,
            opacity: item.opacity,
            animationDuration: `${item.animationDuration}s, ${5 + Math.random() * 5}s`,
            animationDelay: `-${item.delay}s`,
          }}
        >
          <FontAwesomeIcon icon={ICONS[item.iconIndex]} />
        </div>
      ))}
    </div>
  )
}
