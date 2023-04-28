import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

// The name of your Azure OpenAI Resource.
const resourceName:string = Deno.env.get("RESOURCE_NAME");
// The version of OpenAI API.
const apiVersion:string = "2023-03-15-preview";
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
    path="chat/completions"
  } else if (url.pathname === '/v1/completions') {
    path="completions"
  } else if (url.pathname === '/v1/models') {
    return handleModels(request)
  } else {
    return new Response('404 Not Found', { status: 404 })
  }


  // Get the value of the model field and perform mapping.
  let deployName:string = '';
  let body:any;
  if (request.method === 'POST') {
    body = await request.json();
  }

  const modelName:string = body?.model;

  if (modelName) {
    deployName = mapper[modelName] || modelName;
  }

  const fetchAPI:string = `https://${resourceName}.openai.azure.com/openai/deployments/${deployName}/${path}?api-version=${apiVersion}`;

  const authKey:string|null = request.headers.get('Authorization');
  if (!authKey) {
    return new Response("Not allowed", {status: 403});
  }

  const payload:RequestInit = {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      "api-key": authKey.replace('Bearer ', ''),
    },
    body: JSON.stringify(body),
  };

  const response:Response = await fetch(fetchAPI, payload);

  if (body?.stream != true){
    return response
  } 

  const { readable, writable } = new TransformStream();
  
  if (response.body) {
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