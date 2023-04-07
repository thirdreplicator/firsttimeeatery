import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import svelte from "@astrojs/svelte";

// https://astro.build/config
import image from "@astrojs/image";

// For server side rendering.
import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [tailwind(), svelte(), image({
    serviceEntryPoint: '@astrojs/image/sharp'
  })]
});
