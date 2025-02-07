import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'ggHa8vZ@|P4JWt,Mt/NOWN&4/pIa(J7&&Agg';

export function createSession(userId: string, applicationId: string) {
  const token = sign({ userId, applicationId }, JWT_SECRET, { expiresIn: '1d' });
  cookies().set('session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
}

export function getSession() {
  const token = cookies().get('session')?.value;
  if (!token) return null;

  try {
    return verify(token, JWT_SECRET) as { userId: string, applicationId: string };
  } catch {
    return null;
  }
}

export function clearSession() {
  cookies().delete('session');
}

