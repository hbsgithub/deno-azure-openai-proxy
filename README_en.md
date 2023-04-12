# deno-azure-openai-proxy
[![License](https://badgen.net/badge/license/MIT/cyan)](https://github.com/hbsgithub/deno-azure-openai-proxy/blob/main/LICENSE)
[![Azure](https://badgen.net/badge/icon/Azure?icon=azure&label)](https://github.com/hbsgithub/deno-azure-openai-proxy)
[![Azure](https://badgen.net/badge/icon/OpenAI?icon=azure&label)](https://github.com/hbsgithub/deno-azure-openai-proxy)
[![TS](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://github.com/hbsgithub/deno-azure-openai-proxy)

A proxy tool deployed on Deno Deploy that can convert an OpenAI request into an Azure OpenAI request, facilitating use as a backend for various open-source ChatGPTs without the need for servers and free to use.
## Features
1. Compared to Cloudflare Workers, it can be used directly without a proxy.
2. Support for custom second-level domain names (*.deno.dev) or binding your own domain name.
3. Support for typewriter mode of streaming responses.
4. Supports mapper, which allows for custom model mapping rules，also supports directly passing through the model name.
5. No server required, free online deployment, with a monthly limit of 100,000 requests.
# Update
- 23.4.12 Updated support for mapper model mapping rules
# Deployment Method

1. Visit https://dash.deno.com/ and register and log in (you can directly use your GitHub account).
2. Click "New Project" to create a new project.
3. Click "play" on the right side of the code editor to enter edit mode.
4. Copy and paste the contents of [main.ts](https://github.com/hbsgithub/deno-azure-openai-proxy/blob/main/main.ts) from this repository into the editor.
5. Modify the corresponding "resourceName" and "mapper".

![img](https://user-images.githubusercontent.com/1295315/229705215-e0556c99-957f-4d98-99a6-1c51254110b9.png)
**Mapper configuration example**: If you have deployed the GPT-3.5 Turbo and GPT-4 models on Azure with deployment names 'gpt35' and 'gpt4', respectively, then the mapper should be configured as follows.
```
const mapper:any = {
  'gpt-3.5-turbo': 'gpt35',
  'gpt-4': 'gpt4' 
};
```
   Other map rules can be continued directly in this format.
   
6. Click "save and deploy" to save and deploy the project.
7. Customize your own secondary domain or bind your own domain in the project settings.

# Usage

Fill in your custom secondary domain or bound domain in the GPT API project you're using, select a model that has been set up with a mapper and fill in your own Azure OpenAI key in the API key field to use.
## License
MIT
# Remarks
If you have any questions, please feel free to raise an issue. If you find this project helpful, we welcome your star!
# Acknowledgements

Inspired by https://github.com/haibbo/cf-openai-azure-proxy