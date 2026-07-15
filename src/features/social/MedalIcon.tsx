import { medalLabel, type LeaderboardMedalTier } from '@/features/social/leaderboardUtils'

const SIZE = { sm: 22, md: 30, lg: 38 } as const

const PALETTE: Record<
  LeaderboardMedalTier,
  { fill: string; rim: string; shine: string; ribbon: string; ribbonDark: string }
> = {
  gold: {
    fill: '#FFD54F',
    rim: '#B8860B',
    shine: '#FFF8E1',
    ribbon: '#E6A817',
    ribbonDark: '#9A7209',
  },
  silver: {
    fill: '#E8E8EE',
    rim: '#8A8A96',
    shine: '#FFFFFF',
    ribbon: '#A8A8B8',
    ribbonDark: '#6E6E7A',
  },
  bronze: {
    fill: '#E8A86B',
    rim: '#8B4513',
    shine: '#FFE4C4',
    ribbon: '#C4722A',
    ribbonDark: '#7A3E10',
  },
  elite: {
    fill: '#B794F6',
    rim: '#5C3D99',
    shine: '#EDE4FF',
    ribbon: '#7C5CBF',
    ribbonDark: '#4A2D80',
  },
  top10: {
    fill: '#6BC99A',
    rim: '#1E5236',
    shine: '#E2F7ED',
    ribbon: '#3D9970',
    ribbonDark: '#164028',
  },
}

function PodiumMedal({ tier, px }: { tier: LeaderboardMedalTier; px: number }) {
  const c = PALETTE[tier]
  const isRibbon = tier === 'top10'

  if (isRibbon) {
    return (
      <svg width={px} height={px * 1.15} viewBox="0 0 40 46" aria-hidden className="ace-medal-svg">
        <path d="M6 4h28l-4 14H10L6 4z" fill={c.ribbon} />
        <path d="M10 18h20l-2 22H12L10 18z" fill={c.fill} stroke={c.rim} strokeWidth="1.2" />
        <path d="M14 24h12v2H14z" fill={c.rim} opacity="0.5" />
        <text x="20" y="33" textAnchor="middle" fontSize="9" fontWeight="700" fill={c.rim}>
          10
        </text>
      </svg>
    )
  }

  if (tier === 'elite') {
    return (
      <svg width={px} height={px * 1.15} viewBox="0 0 40 46" aria-hidden className="ace-medal-svg">
        <path d="M8 2 L14 14 L8 14 Z" fill={c.ribbonDark} />
        <path d="M32 2 L26 14 L32 14 Z" fill={c.ribbonDark} />
        <path d="M8 14 L32 14 L28 42 L12 42 Z" fill={c.ribbon} />
        <polygon
          points="20,8 26,18 20,16 14,18"
          fill={c.fill}
          stroke={c.rim}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="28" r="10" fill={c.fill} stroke={c.rim} strokeWidth="1.5" />
        <circle cx="16" cy="24" r="3" fill={c.shine} opacity="0.7" />
        <polygon points="20,22 21.2,25.5 25,25.5 22,27.8 23.2,31.5 20,29.2 16.8,31.5 18,27.8 15,25.5 18.8,25.5" fill={c.rim} />
      </svg>
    )
  }

  return (
    <svg width={px} height={px * 1.2} viewBox="0 0 40 48" aria-hidden className="ace-medal-svg">
      <path d="M6 2 L14 16 L6 16 Z" fill={c.ribbonDark} />
      <path d="M34 2 L26 16 L34 16 Z" fill={c.ribbonDark} />
      <path d="M6 16 L34 16 L30 44 L10 44 Z" fill={c.ribbon} />
      <path d="M10 16 L30 16 L28 40 L12 40 Z" fill={c.ribbonDark} opacity="0.25" />
      <circle cx="20" cy="26" r="13" fill={c.fill} stroke={c.rim} strokeWidth="1.8" />
      <circle cx="15" cy="21" r="4.5" fill={c.shine} opacity="0.65" />
      <polygon
        points="20,19 22.4,24.5 28.5,24.5 23.5,28 25.5,33.5 20,30 14.5,33.5 16.5,28 11.5,24.5 17.6,24.5"
        fill={c.rim}
      />
    </svg>
  )
}

export function MedalIcon({ tier, size = 'md' }: { tier: LeaderboardMedalTier; size?: 'sm' | 'md' | 'lg' }) {
  const px = SIZE[size]
  return (
    <span
      className={`ace-medal-wrap ace-medal-wrap--${tier} ace-medal-wrap--${size}`}
      title={medalLabel(tier)}
      aria-label={medalLabel(tier)}
      role="img"
    >
      <PodiumMedal tier={tier} px={px} />
    </span>
  )
}
