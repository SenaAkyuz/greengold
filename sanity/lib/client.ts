import { createClient } from 'next-sanity';
import { projectId, dataset, apiVersion } from '../env';

// Read-only client for published content. The dataset is public, so no token is
// required for published reads; useCdn keeps it fast and cacheable under ISR.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
});
