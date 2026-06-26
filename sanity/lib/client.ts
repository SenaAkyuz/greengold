import { createClient } from 'next-sanity';
import { projectId, dataset, apiVersion } from '../env';

// Read-only client for published content. The dataset is public, so no token is
// required for published reads. useCdn:false because ISR already caches the
// rendered page for `revalidate` seconds — we want fresh data on each
// (re)generation, not a separately-lagging CDN cache (which made SSG builds
// pick up stale post counts).
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
});
