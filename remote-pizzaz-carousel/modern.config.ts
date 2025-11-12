import { appTools, defineConfig } from '@modern-js/app-tools';
import { moduleFederationPlugin } from '@module-federation/modern-js';
import { tailwindcssPlugin } from '@modern-js/plugin-tailwindcss';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  runtime: {
    router: true,
  },
  plugins: [
    appTools({
      bundler: 'rspack'
    }),
    moduleFederationPlugin(),
    tailwindcssPlugin()
  ],
  server: {
    ssr:{
      mode:'stream'
    },
    port: 3003,
  },
  output: {
    disableTsChecker: true
  }
});
