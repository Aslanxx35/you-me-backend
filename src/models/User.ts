export interface User { id: string; email: string; name: string | null; birthData: Record<string, unknown> | null; createdAt: string; updatedAt: string; }
export interface Subscription { userId: string; appUserId: string | null; entitlementId: string; productId: string | null; status: string; isPremium: boolean; expiresAt: string | null; willRenew: boolean; trialEndsAt: string | null; }
