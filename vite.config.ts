import { defineConfig } from 'vite'
import fs from 'fs'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Inspect from 'vite-plugin-inspect'
import path from 'path'

import electron from "vite-plugin-electron";
import electronRenderer from "vite-plugin-electron/renderer";
import polyfillExports from "vite-plugin-electron/polyfill-exports";
import viteCompression from 'vite-plugin-compression'

// 如果编辑器提示 path 模块找不到，则可以安装一下 @types/node -> npm i @types/node -D
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
const pathSrc = path.resolve(__dirname, 'src')


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // electron({
    //   main: {
    //     entry: "electron-main/index.ts", // 主进程文件
    //     vite: {
    //       build: {
    //         outDir: 'dist/electron-main',
    //       },
    //     },
    //   },
    //   preload: {
    //     input: [path.join(__dirname, "./electron-preload/index.ts")], // 预加载文件
    //     vite: {
    //       build: {
    //         // For debug
    //         // sourcemap: 'inline',
    //         outDir: 'dist/electron-preload',
    //       },
    //     },
    //   },
    // }),
    // electronRenderer(),
    polyfillExports(),
    AutoImport({
      // Auto import functions from Vue, e.g. ref, reactive, toRef...
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue'],

      // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [
        ElementPlusResolver(),

        // Auto import icon components
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        }),
      ],

      dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
    }),
    Components({
      resolvers: [
        // Auto register icon components
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
        // Auto register Element Plus components
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
      ],
      dts: path.resolve(pathSrc, 'components.d.ts'),
    }),
    Icons({
      autoInstall: true,
    }),
    Inspect(),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    })
  ],
  build: {
    emptyOutDir: false, // 必须配置，否则electron相关文件将不会生成build后的文件
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true, 
    }
  },
  optimizeDeps: {
    exclude: ['electron'], // 告诉 Vite 排除预构建 electron，不然会出现 __diranme is not defined
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 设置 `@` 指向 `src` 目录
      'c': resolve(__dirname, 'src/components'),//组件
      'i': resolve(__dirname, 'src/interface'),//接口
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/assets/scss/globalStyle.scss" as *;@use "@/assets/scss/table.scss" as *;@use "@/assets/scss/btn.scss" as *;@use "@/assets/scss/router.scss" as *;'
      }
    }
  },
  base: './', // 设置打包路径
  server: {
    port: 4000, // 设置服务启动端口号
    open: true, // 设置服务启动时是否自动打开浏览器
    cors: true, // 允许跨域
    // host: '192.168.3.3',
    https: {
      cert: fs.readFileSync(path.join(__dirname, 'keys/cert.crt')),
      key: fs.readFileSync(path.join(__dirname, 'keys/cert.key'))
    },
    // 设置代理，根据我们项目实际情况配置
    // proxy: {
    //   '/localhost': {
    //     target: 'https://www.qiuadam.site/',
    //     changeOrigin: true,
    //     secure: false,
    //     rewrite: (path) => path.replace('/api/', '/')
    //   }
    // }
  }
})
