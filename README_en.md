# deno-azure-openai-proxy

This is an Azure OpenAI proxy deployed on Deno Deploy.
It supports custom secondary domains or domain binding.
It supports typewriter mode for streaming response.

# Deployment Method

1. Visit https://dash.deno.com/ and register and log in.
2. Click "New Project" to create a new project.
3. Click "play" on the right side of the code editor to enter edit mode.
4. Copy and paste the contents of [main.ts](https://github.com/hbsgithub/deno-azure-openai-proxy/blob/main/main.ts) from this repository into the editor.
5. Modify the corresponding "resourceName" and "deployName".

![img](https://user-images.githubusercontent.com/1295315/229705215-e0556c99-957f-4d98-99a6-1c51254110b9.png)

6. Click "save and deploy" to save and deploy the project.
7. Customize your own secondary domain or bind your own domain in the project settings.

# Usage

Fill in your custom secondary domain or bound domain in the GPT API project you're using, and fill in your own Azure OpenAI key in the API key field to use.

# Acknowledgements

Inspired by https://github.com/haibbo/cf-openai-azure-proxy