import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('museo_session');

    if (!sessionToken || !sessionToken.value) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    // Return non-sensitive user profile data
    const userProfile = {
      id: 'usr_museo_01',
      name: 'Yashraj Desai',
      email: 'yashrajdesai044@gmail.com',
      role: 'Chief Specimen Curator',
      avatar: '🏛️',
    };

    return NextResponse.json({
      authenticated: true,
      user: userProfile,
    });
  } catch {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}
