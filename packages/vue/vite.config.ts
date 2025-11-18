import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FlowDesignerVue',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'es') return 'esm/index.js';
        return 'index.js';
      }
    },
    rollupOptions: {
      external: ['vue', '@vue-flow/core', '@vue-flow/background', '@vue-flow/controls', '@vue-flow/minimap', '@xiaoxiao6.0/flow-designer-core'],
      output: {
        globals: {
          vue: 'Vue',
          '@vue-flow/core': 'VueFlow',
          '@xiaoxiao6.0/flow-designer-core': 'FlowDesignerCore'
        }
      }
    },
    outDir: 'dist'
  }
});
