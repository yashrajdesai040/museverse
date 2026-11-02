import { Suspense } from 'react';
import { Metadata } from 'next';
import { ChronoComparator } from '@/components/compare/ChronoComparator';
import { ModelLoader } from '@/components/canvas/ModelLoader';

export const metadata: Metadata = {
  title: 'Chrono-Scale 3D Laboratory | Specimen Comparator | MUSEO',
  description:
    'Compare any two specimens from 4.5 billion years of planetary evolution side-by-side in real-time 3D WebGL.',
};

function CompareContent({
  searchParams,
}: {
  searchParams: Promise<{ item1?: string; item2?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-28 flex items-center justify-center bg-[#0a0a0a]">
          <ModelLoader label="INITIALIZING 3D COMPARATOR LAB..." theme="dark" />
        </div>
      }
    >
      <ComparePageInner searchParams={searchParams} />
    </Suspense>
  );
}

async function ComparePageInner({
  searchParams,
}: {
  searchParams: Promise<{ item1?: string; item2?: string }>;
}) {
  const resolved = await searchParams;
  return (
    <main className="min-h-screen bg-[#F2EDE4] text-[#0E0E0E] pt-28 px-4 sm:px-8 pb-24 font-space">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <span className="px-3 py-1 bg-[#0E0E0E] text-[#FFD400] font-mono text-xs font-bold uppercase tracking-[0.15em] inline-block shadow-[3px_3px_0px_#0E0E0E] mb-3">
            [ 3D CHRONO-SCALE LABORATORY ]
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-space text-[#0E0E0E] tracking-tight mb-3 uppercase">
            Dual Specimen Comparator
          </h1>
          <p className="text-sm font-space text-[#0E0E0E]/80 max-w-2xl font-medium">
            Analyze morphological structures, material compositions, and evolutionary temporal distances
            between any two planetary specimen records in real-time synchronized 3D WebGL.
          </p>
        </header>

        <ChronoComparator
          initialItem1Id={resolved.item1 || 'trex-sue'}
          initialItem2Id={resolved.item2 || 'rosetta-stone'}
        />
      </div>
    </main>
  );
}

export default function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ item1?: string; item2?: string }>;
}) {
  return <CompareContent searchParams={searchParams} />;
}
