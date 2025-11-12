import { createModuleFederationConfig } from '@module-federation/enhanced';

export default createModuleFederationConfig({
  name: 'pizzazCarouselProvider',
  exposes: {
    '.': './src/components/CarouselProvider.tsx',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
  getPublicPath:`return 'http://127.0.0.1:3003/'`
});
