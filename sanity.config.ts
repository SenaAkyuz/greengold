'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { projectId, dataset, apiVersion } from './sanity/env';
import { schemaTypes } from './sanity/schemaTypes';

export default defineConfig({
  name: 'greengold-blog',
  title: 'Green Gold Blog',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
  },
});
