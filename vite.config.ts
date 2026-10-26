import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: 'src',
      exclude: ['src/**/__tests__/**', 'src/**/*.test.ts'],
      include: ['src'],
      tsconfigPath: './tsconfig.build.json',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    emptyOutDir: true,
    lib: {
      cssFileName: 'style',
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        'prediction-config': fileURLToPath(new URL('./src/prediction-config/index.ts', import.meta.url)),
      },
      fileName: (_format, entryName) => `${entryName}.js`,
      formats: ['es'],
      name: 'MmUI',
    },
    rollupOptions: {
      external: id => id === 'vue' || id === 'element-plus' || id.startsWith('element-plus/') || id === '@element-plus/icons-vue',
    },
    sourcemap: true,
  },
})
