import { createImageUrlBuilder } from '@sanity/image-url';
import { projectId, dataset } from '../env';

const builder = createImageUrlBuilder({ projectId, dataset });

type ImageSource = string | { asset?: { _ref?: string } } | Record<string, unknown>;

export function urlFor(source: ImageSource) {
  return builder.image(source as Parameters<typeof builder.image>[0]);
}

// Sanity asset refs encode their dimensions: image-<id>-<width>x<height>-<ext>.
// Parsing them avoids an extra deref just to get width/height (kills CLS).
export function dimsFromRef(ref?: string): { width: number; height: number } | null {
  if (!ref) return null;
  const m = /-(\d+)x(\d+)-[a-z]+$/.exec(ref);
  if (!m) return null;
  return { width: parseInt(m[1], 10), height: parseInt(m[2], 10) };
}
