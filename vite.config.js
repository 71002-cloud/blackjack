import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'signinform.html'),
        signup: resolve(__dirname, 'blackjake.html'),
        // blackjack can just be index.html if it’s loaded dynamically
        // add more pages here if needed
      }
    }
  }
})
