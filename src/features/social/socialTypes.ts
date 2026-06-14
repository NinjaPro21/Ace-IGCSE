export type GroupType = 'school' | 'clan'

export interface SchoolGroup {
  id: string
  name: string
  type: GroupType
  inviteCode: string
  memberCount?: number
}

export interface LeaderboardEntry {
  userId: string
  displayName: string
  avatarUrl?: string
  xp: number
  streakDays: number
  level: number
  isYou?: boolean
}

export interface PendingGroupAction {
  action: 'create' | 'join'
  name?: string
  type?: GroupType
  inviteCode?: string
}

export interface AuthUser {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
}

export function generateInviteCode(type: GroupType): string {
  const prefix = type === 'school' ? 'SCH' : 'CLN'
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `${prefix}-${code}`
}

export function normalizeInviteCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, '')
}

export function isValidInviteCode(code: string): boolean {
  return /^(SCH|CLN)-[A-Z0-9]{6}$/.test(code)
}
