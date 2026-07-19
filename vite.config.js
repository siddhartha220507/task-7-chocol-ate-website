import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Don't watch heavy binary model files — prevents EBUSY crash on Windows
      ignored: ['**/public/models/**/*.bin', '**/src/Models/**'],
    },
  },
  assetsInclude: ['**/*.gltf', '**/*.bin', '**/*.glb'],
})
