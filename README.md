# deno-azure-openai-proxy
[![License](https://badgen.net/badge/license/MIT/cyan)](https://github.com/hbsgithub/deno-azure-openai-proxy/blob/main/LICENSE)
[![Azure](https://badgen.net/badge/icon/Azure?icon=azure&label)](https://github.com/hbsgithub/deno-azure-openai-proxy)
[![Azure](https://badgen.net/badge/icon/OpenAI?icon=azure&label)](https://github.com/hbsgithub/deno-azure-openai-proxy)
[![TS](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://github.com/hbsgithub/deno-azure-openai-proxy)

 **[English](https://github.com/hbsgithub/deno-azure-openai-proxy/blob/main/README_en.md)**

一个部署Deno Deploy上在 Azure OpenAI API 的代理工具，可以将一个 OpenAI 请求转化为 Azure OpenAI 请求，方便作为各类开源 ChatGPT 的后端使用，无需服务器，免费使用。
## 特点
1. 支持一键部署！
2. 相比于cloudflare workers，可以无需代理，直连使用
3. 支持自定义二级域名（*.deno.dev）或者绑定自己的域名
4. 支持打字机模式的流式响应
5. 支持mapper，可以自定义模型映射规则，也支持直接透传模型名
6. 无需服务器，免费在线部署，每日10万次请求额度
# 更新
- 23.4.27 更新支持环境变量设置resourceName和mapper的值以及支持一键部署
- 23.4.12 更新支持mapper模型映射规则
# 一键部署
1. 点击 [Deploy on Deno](https://dash.deno.com/new?url=https://raw.githubusercontent.com/hbsgithub/deno-azure-openai-proxy/main/main.ts)（首次点击要先登录Deno Deploy，登录完成之后重新点击这个链接即可进行部署）
2. 部署完成后设置环境变量
- 环境变量设置方法
  
  在project的setting中的Environment Variables点击Add Variable
![environment](https://raw.githubusercontent.com/hbsgithub/deno-azure-openai-proxy/main/img/Environment%20Variables.png)
![部署方法](https://user-images.githubusercontent.com/1295315/233124125-1ea95665-ffab-4b5c-a7ba-26f31f1bb0b3.png)
3. 在project的settings中自定义自己的二级域名或者绑定自己的域名
![custom](https://raw.githubusercontent.com/hbsgithub/deno-azure-openai-proxy/main/img/custom%20url.png)
# 手动部署方法
1. 访问 https://dash.deno.com 并注册登录（可以直接使用github账号）
2. 点击New Project新建项目
3. 点击playground右侧的play进入编辑模式
4. 将本项目的 [main.ts](https://github.com/hbsgithub/deno-azure-openai-proxy/blob/main/main.ts)中的内容复制并粘贴到编辑器中
5. 通过直接修改或环境变量调整 resourceName 和 mapper 的值
   - **mapper设置例子**：如果你在azure上部署的gpt-3.5-turbo和gpt-4的模型deployment name为gpt35和gpt4，那么mapper按照如下设置

     ```
     const mapper:any = {
       'gpt-3.5-turbo': 'gpt35',
       'gpt-4': 'gpt4' 
     };
     ```
     其他的map规则直接按这样的格式续写即可
6. 点击save and deploy进行保存并部署
7. 返回到project的settings中自定义自己的二级域名或者绑定自己的域名
# 使用方法
将自己自定义的二级域名或绑定的自定义域名填写到自己所使用的gpt项目的api url中，选择设定过mapper的模型，并在api key 中填写自己的azure openai key即可使用。
## License
MIT

# 备注
有问题的话欢迎提issue，觉得该项目对你有帮助的话欢迎star！

# 致谢
Inspired by https://github.com/haibbo/cf-openai-azure-proxy




