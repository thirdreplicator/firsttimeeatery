import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import svelte from "@astrojs/svelte";

// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [tailwind(), svelte(), image({
    serviceEntryPoint: '@astrojs/image/sharp'
  })]
});
