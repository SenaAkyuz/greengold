import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity.config';

// Embedded Sanity Studio at /studio. Auth is handled by Sanity (role-based).
export const dynamic = 'force-static';

export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
