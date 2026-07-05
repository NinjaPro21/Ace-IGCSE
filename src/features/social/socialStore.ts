import type { PendingGroupAction } from './socialTypes'

const STORAGE_KEY = 'enlight-social-v1'

interface SocialState {
  pendingGroup?: PendingGroupAction
  localInviteCode?: string
}

function load(): SocialState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SocialState) : {}
  } catch {
    return {}
  }
}

function save(state: SocialState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const socialStore = {
  getPendingGroup(): PendingGroupAction | undefined {
    return load().pendingGroup
  },

  setPendingGroup(action: PendingGroupAction): void {
    save({ ...load(), pendingGroup: action })
  },

  clearPendingGroup(): void {
    const state = load()
    delete state.pendingGroup
    save(state)
  },

  getLocalInviteCode(): string | undefined {
    return load().localInviteCode
  },

  setLocalInviteCode(code: string): void {
    save({ ...load(), localInviteCode: code })
  },

  clearLocalInviteCode(): void {
    const state = load()
    delete state.localInviteCode
    save(state)
  },

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY)
  },
}
