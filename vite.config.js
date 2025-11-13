import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'signinform.html'),
        signup: resolve(__dirname, 'blackjake.html'),
      }
    }
  }
})
