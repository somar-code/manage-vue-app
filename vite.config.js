import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],

  // 配置别名@即为src
  resolve:{
    alias:[
      {
        find:"@",
        replacement:"/src",        
      }
    ]
  }
})
