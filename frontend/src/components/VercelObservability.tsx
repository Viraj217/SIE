'use client';

import { useEffect, useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';

export default function VercelObservability() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <SpeedInsights />
      <VercelAnalytics />
    </>
  );
}
