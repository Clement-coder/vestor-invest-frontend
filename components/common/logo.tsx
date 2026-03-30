import { cn } from '@/lib/utils'
import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: { w: 32, h: 32, text: 'text-base sm:text-xl' },
  md: { w: 40, h: 40, text: 'text-xl sm:text-2xl' },
  lg: { w: 56, h: 56, text: 'text-2xl sm:text-4xl' },
}

export function Logo({ size = 'md', className }: LogoProps) {
  const { w, h, text } = sizeMap[size]
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Image src="/VestorLog.png" alt="Vestor Invest" width={w} height={h} className="object-contain" />
      <div className={cn('font-bold', text)}>
        <span className="text-white">Vestor</span>
        <span className="text-gradient-primary"> INVEST</span>
      </div>
    </div>
  )
}
