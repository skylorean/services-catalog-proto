import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // nginx отдаёт сборку на tlcore340.travelline.lan:8042/services-proto/
  base: '/services-proto/',
})
