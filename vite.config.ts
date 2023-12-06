import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { UserConfigExport, ConfigEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  //获取各个环境下的对应变量
  let env = ''
  env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [vue(),
    createSvgIconsPlugin({
      //配置svg图标
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]'
    }),
    viteMockServe({
      //@ts-ignore 最新版本为enabled
      localEnabled: command === 'serve',//保证开发阶段可以使用mock接口
    })
    ],
    resolve: {
      alias: {
        "@": path.resolve('./src')
      }
    },
    //sass全局变量配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/style/var.scss";',
        },
      },
    },
    // 配置代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          // 代理目标
          target: 'http://192.168.0.106:8081/',
          // 配置是否跨域
          changeOrigin: true,
          // 是否重写路径
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
}
)
