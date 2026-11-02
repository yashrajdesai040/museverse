import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('museo_session');

    if (!sessionToken || !sessionToken.value) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, username, email, avatar } = body || {};

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and Email are required fields.' },
        { status: 400 }
      );
    }

    const updatedUser = {
      id: 'usr_museo_01',
      name: String(name).trim(),
      username: username ? String(username).trim() : '@curator_museo',
      email: String(email).trim().toLowerCase(),
      role: 'Chief Specimen Curator',
      avatar: avatar || '🏛️',
    };

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server error updating profile' },
      { status: 500 }
    );
  }
}
