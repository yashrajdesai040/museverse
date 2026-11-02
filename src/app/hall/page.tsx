'use client';

import dynamic from 'next/dynamic';
import { ModelLoader } from '@/components/canvas/ModelLoader';

const GrandMuseumHall3D = dynamic(
  () => import('@/components/canvas/hall/GrandMuseumHall3D').then((m) => m.GrandMuseumHall3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#07080a] flex flex-col items-center justify-center">
        <ModelLoader label="ENTERING GRAND 3D EXHIBITION HALL..." theme="dark" />
      </div>
    ),
  }
);

export default function HallPage() {
  return (
    <main className="w-full h-screen bg-black overflow-hidden relative">
      <GrandMuseumHall3D />
    </main>
  );
}
