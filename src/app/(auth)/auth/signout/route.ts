import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const { origin } = new URL(request.url);
  try {
    const supabase = createSupabaseServer();
    await supabase.auth.signOut();
  } catch (err) {
    console.error('[auth/signout] failed', err);
  }
  return NextResponse.redirect(`${origin}/login`, { status: 303 });
}
