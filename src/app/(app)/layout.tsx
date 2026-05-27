import { AppHeader } from '@/components/layout/AppHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="min-h-[calc(100vh-64px)] bg-sand-100">{children}</main>
    </>
  );
}
