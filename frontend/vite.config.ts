import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@common': path.resolve(__dirname, 'src/common'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@reducers': path.resolve(__dirname, 'src/reducers'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@frontend-types': path.resolve(__dirname, 'src/types'),
      '@socket': path.resolve(__dirname, 'src/socket.ts'),
      '@sockets': path.resolve(__dirname, 'src/sockets'),
      '@utils': path.resolve(__dirname, 'src/utils.ts'),
    },
  },
});
