const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutos

type AttemptRecord = {
  count: number;
  lockedUntil: number | null;
};

// Em memória de propósito: o backend roda como um único processo PM2 (sem
// cluster mode), então não precisa de um store compartilhado como Redis.
const attempts = new Map<string, AttemptRecord>();

function normalize(email: string) {
  return email.trim().toLowerCase();
}

export function isLockedOut(email: string): boolean {
  const record = attempts.get(normalize(email));
  if (!record?.lockedUntil) return false;

  if (Date.now() >= record.lockedUntil) {
    attempts.delete(normalize(email));
    return false;
  }

  return true;
}

export function registerFailedAttempt(email: string): void {
  const key = normalize(email);
  const record = attempts.get(key) ?? { count: 0, lockedUntil: null };

  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCKOUT_MS;
  }

  attempts.set(key, record);
}

export function clearAttempts(email: string): void {
  attempts.delete(normalize(email));
}
