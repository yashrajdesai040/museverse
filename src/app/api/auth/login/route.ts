import { NextResponse } from 'next/server';

const DEMO_EMAIL = 'yashrajdesai044@gmail.com';
const DEMO_ALT = 'yashraj';
const DEMO_PASS = 'museo2025';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password, rememberMe, isGuest } = body || {};

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Guest Admission: instant visitor pass
    const isGuestRequest =
      isGuest === true ||
      cleanEmail === 'guest' ||
      cleanEmail === 'guest@museo.archive' ||
      cleanEmail === 'visitor';

    if (isGuestRequest) {
      const guestProfile = {
        id: 'usr_guest_' + Date.now().toString(36),
        name: 'Visiting Explorer',
        username: 'visiting_explorer',
        email: 'guest@museo.archive',
        role: 'Visiting Explorer',
        avatar: '🧭',
      };

      const token = 'guest_session_' + Date.now();
      const response = NextResponse.json({
        success: true,
        user: guestProfile,
      });

      response.cookies.set({
        name: 'museo_session',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days for guest
      });

      return response;
    }

    // Require email or username
    if (!cleanEmail) {
      return NextResponse.json(
        { success: false, error: 'Please enter your email or patron identifier' },
        { status: 400 }
      );
    }

    // Require non-empty password
    if (!cleanPass) {
      return NextResponse.json(
        { success: false, error: 'Please enter your password' },
        { status: 400 }
      );
    }

    // Chief Specimen Curator credentials
    const isDemoCurator =
      (cleanEmail === DEMO_EMAIL || cleanEmail === DEMO_ALT || cleanEmail === 'curator@museo.archive') &&
      cleanPass === DEMO_PASS;

    let userProfile;

    if (isDemoCurator) {
      userProfile = {
        id: 'usr_museo_01',
        name: 'Yashraj Desai',
        username: 'yashraj_curator',
        email: DEMO_EMAIL,
        role: 'Chief Specimen Curator',
        avatar: '🏛️',
      };
    } else {
      // General Patron: allow any visitor with valid format to sign in seamlessly
      const displayName = cleanEmail.includes('@')
        ? cleanEmail
            .split('@')[0]
            .replace(/[._-]/g, ' ')
            .replace(/\b\w/g, (c: string) => c.toUpperCase())
        : cleanEmail.replace(/\b\w/g, (c: string) => c.toUpperCase());

      userProfile = {
        id: 'usr_patron_' + Date.now().toString(36),
        name: displayName || 'Distinguished Patron',
        username: cleanEmail.replace(/[^a-zA-Z0-9_]/g, '_'),
        email: cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@museo.archive`,
        role: 'Verified Museum Patron',
        avatar: '🎟️',
      };
    }

    const token = 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);

    const response = NextResponse.json({
      success: true,
      user: userProfile,
    });

    response.cookies.set({
      name: 'museo_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 1 day
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Authentication service temporarily busy. Please retry.' },
      { status: 500 }
    );
  }
}
