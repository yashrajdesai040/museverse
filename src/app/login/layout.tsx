import type { Metadata } from 'next';
import './login.css';

export const metadata: Metadata = {
  title: 'MUSEO — Enter the Museum',
  description: 'The Living Museum Login Experience — your admission begins here.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
