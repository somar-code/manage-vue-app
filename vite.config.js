// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [vue()],

//   // 配置别名@即为src
//   resolve:{
//     alias:[
//       {
//         find:"@",
//         replacement:"/src",        
//       }
//     ]
//   }
// })
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  // 确保构建输出配置正确
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 确保路由正常工作
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'] // 如果使用了这些库
        }
      }
    }
  }
})