import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { isAllowedEmail } from '@/lib/auth/allowed-domains';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=callback_failed`);
  }

  try {
    const supabase = createSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('[auth/callback] exchange failed', error.message);
      return NextResponse.redirect(`${origin}/login?error=callback_failed`);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!isAllowedEmail(user?.email)) {
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/login?error=unauthorized_domain`);
    }

    return NextResponse.redirect(`${origin}/casais`);
  } catch (err) {
    console.error('[auth/callback] unexpected error', err);
    return NextResponse.redirect(`${origin}/login?error=callback_failed`);
  }
}
