import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/subtitle", component: "subtitle" },
  ],
  npmClient: 'yarn',
  chainWebpack: (config) => {
    // 自定义字体的加载配置
    config.module
      .rule('custom-fonts')
      .test(/\.(ttf|woff|woff2|eot|otf)$/)
      .include.add(/public\/assets\/fonts/) // 只处理自定义字体目录
      .end()
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'fonts/[name].[hash:8].[ext]',
      });
  },
});
