import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import { pooledMap } from "https://deno.land/std@0.182.0/async/pool.ts";

// The name of your Azure OpenAI Resource.
const resourceName:string = Deno.env.get("RESOURCE_NAME");
// The version of OpenAI API.
const apiVersion:string = "2023-05-15";
// The mapping of model name.
const mapper:any = {
  'gpt-3.5-turbo': Deno.env.get("DEPLOY_NAME_GPT35"),
  'gpt-4': Deno.env.get("DEPLOY_NAME_GPT4") 
  // Other mapping rules can be added here.
};

async function handleRequest(request:Request):Promise<Response> {
  if (request.method === 'OPTIONS') {
    return handleOPTIONS(request)
  }

  const url = new URL(request.url);
  let path:string;
  if (url.pathname === '/v1/chat/completions') {
    return handleDirect(request, "chat/completions");
  } else if (url.pathname === '/v1/completions') {
    return handleDirect(request, "completions");
  } else if (url.pathname === '/v1/models') {
    return handleModels(request)
  } else if (url.pathname === '/v1/embeddings') {
    return handleEmbedding(request, "embeddings");
  } else {
    return new Response('404 Not Found', { status: 404 })
  }
}

async function requestAzure(method: string, body: any, path: string, authKey?: string) {
  if (!authKey) {
      return new Response("Not allowed", { status: 403 });
  }
  
  // Get the value of the model field and perform mapping.
  let deployName:string = '';
  if (method === 'POST') {
    const modelName: string | undefined = body?.model;
    if (modelName) {
        deployName = mapper[modelName] || modelName;
    }
 }

  const fetchAPI:string = `https://${resourceName}.openai.azure.com/openai/deployments/${deployName}/${path}?api-version=${apiVersion}`;

  const payload:RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "api-key": authKey.replace('Bearer ', ''),
    },
    body: JSON.stringify(body),
  };
  return await fetch(fetchAPI, payload);
  // const response:Response = await fetch(fetchAPI, payload);
}
async function handleDirect(request: Request, path: string) {
  const [key, body] = await extractRequest(request);
  const response: Response = await requestAzure(request.method, body, path, key);
  if (body?.stream != true){
    return response
  } 
  if (response.body) {
      const { readable, writable } = new TransformStream();
      stream(response.body, writable);
      return new Response(readable, response);
  } else {
      throw new Error('Response body is null');
  }
}

function sleep(ms:number):Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// support printer mode and add newline
async function stream(readable:ReadableStream<Uint8Array>, writable:WritableStream<Uint8Array>):Promise<void> {
  const reader = readable.getReader();
  const writer = writable.getWriter();

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const newline = "\n";
  const delimiter = "\n\n";
  const encodedNewline = encoder.encode(newline);

  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(value, { stream: true }); // stream: true is important here,fix the bug of incomplete line
    const lines = buffer.split(delimiter);

    // Loop through all but the last line, which may be incomplete.
    for (let i = 0; i < lines.length - 1; i++) {
      await writer.write(encoder.encode(lines[i] + delimiter));
      await sleep(30);
    }

    buffer = lines[lines.length - 1];
  }

  if (buffer) {
    await writer.write(encoder.encode(buffer));
  }
  await writer.write(encodedNewline)
  await writer.close();
}

async function extractRequest(request: Request) {
  const key = request.headers.get('Authorization')?.replace('Bearer ', '');
  const body = request.method === "POST" ? await request.json() : null;
  return [key, body]
}

async function handleEmbedding(request: Request, path: string) {
  const [key, body] = await extractRequest(request);
  const input = body.input;
  if (typeof input === "string") {
      return await requestAzure(request.method, body, path, key);
  } else if (Array.isArray(input)) {
      const resps = pooledMap(3,
          input, (x: any) => {
              return requestAzure(request.method, { ...body, input: x }, path, key);
          });
      const retbody = {
          object: "list",
          data: [] as any[],
          model: body.model,
          usage: {
              prompt_tokens: 0,
              total_tokens: 0
          }
      };
      let i = 0;
      for await (const r of resps) {
          const ret = await r.json();
          for (const data of ret.data) {
              retbody.data.push({ ...data, index: i });
              i++;
          }
          retbody.usage.prompt_tokens += ret.usage.prompt_tokens;
          retbody.usage.total_tokens += ret.usage.total_tokens;
      }
      const json: string = JSON.stringify(retbody, null, 2);
      return new Response(json, {
          headers: { 'Content-Type': 'application/json' },
      });
  } else {
      throw new Error('Invalid input type');
  }
}

async function handleModels(request:Request):Promise<Response> {
  const data:any = {
    "object": "list",
    "data": []  
  };

  for (let key in mapper) {
    data.data.push({
      "id": key,
      "object": "model",
      "created": 1677610602,
      "owned_by": "openai",
      "permission": [{
        "id": "modelperm-M56FXnG1AsIr3SXq8BYPvXJA",
        "object": "model_permission",
        "created": 1679602088,
        "allow_create_engine": false,
        "allow_sampling": true,
        "allow_logprobs": true,
        "allow_search_indices": false,
        "allow_view": true,
        "allow_fine_tuning": false,
        "organization": "*",
        "group": null,
        "is_blocking": false
      }],
      "root": key,
      "parent": null
    });  
  }

  const json:string = JSON.stringify(data, null, 2);
  return new Response(json, {
    headers: { 'Content-Type': 'application/json' },
  });
}

function handleOPTIONS(request:Request):Response {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
      }
    })
}
serve(handleRequest);
