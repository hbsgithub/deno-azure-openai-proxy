# deno-azure-openai-proxy
 **[English](https://github.com/hbsgithub/deno-azure-openai-proxy/blob/main/README_en.md)**

部署在deno deploy上的azure openai 代理
相比于使用cloudflare workers可以直连使用
支持自定义二级域名或者绑定自己的域名
支持打字机模式的流式响应
# 部署方法
1. 访问https://dash.deno.com/并注册登录
2. 点击New Project新建项目
3. 点击playground右侧的play进入编辑模式
4. 将本项目的 [main.ts](https://github.com/hbsgithub/deno-azure-openai-proxy/blob/main/main.ts)中的内容复制并粘贴到编辑器中
5. 修改对应的 resourceName 和 deployName
![这是图片](https://user-images.githubusercontent.com/1295315/229705215-e0556c99-957f-4d98-99a6-1c51254110b9.png)
1. 点击save and deploy进行保存并部署
2. 返回到project的settings中自定义自己的二级域名或者绑定自己的域名
# 使用方法
将自己自定义的二级域名或绑定填写到自己所使用的gpt api项目中，并在api key 中填写自己的azure openai key即可使用

# 致谢
Inspired by https://github.com/haibbo/cf-openai-azure-proxy




