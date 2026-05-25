const azure_endpoint = process.env.AZURE_ENDPOINT_PROJECT;
const deployment_name = "gpt-5.4-mini";
const api_key = process.env.TOKEN;
const api_servion = "2025-04-01-preview"

async function preguntaAzure(pregunta = ``, historial = []) {

  // EndPint Final
  const url = `${azure_endpoint}/apenai/deployments/${deployment_name}/chat/completions?api-version=${api_servion}`

  // Contendiendo la informacion de Body
  const body = {
    messages: [
      { role: "system", content: "Eres un asistente útil" },
      ...historial,
      { role: "user", content: pregunta }
    ],
    max_completion_token: 800,
    temperature: 0.7
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": `application/json`,
      "api-key": `${api_key}`,
    },
    body: JSON.stringify(body)
  })

  if(!response.ok) {
    console.error("No se pudo acceder al servicio");
    return      
  }

  const data = await response.json()
  const mensaje = data.choices[0].message

  return {
    respuesta: mensaje.content,
    tokens_usados: data.usage.total_tokens,
    nuevo_hisrotial: [...historial, { role: 'user', content: pregunta }, mensaje]
  }
}

// Prepara un bloque de preguntas que estaran relacionadas
async function test() {
  let historial = []

  console.log('--- Pregunta 1 ---');
  let r1 = await preguntaAzure("¿Que es Slackware Linux? dame una respuesta corta")
  console.log(r1.respuesta)
  historial = r1.nuevo_hisrotial

  console.log('--- Pregunta 2 ---');
  let r2 = await preguntaAzure('¿Y cual su alternativa mas conicida?', historial)
  console.log(r2.respuesta);
  historial = r2.nuevo_hisrotial

  console.log('--- Pregunta 3 ---');  
  let r3 = await preguntaAzure('¿Y cual de los dos es mejor para el uso diario?', historial)
  historial = r3.nuevo_hisrotial 

  console.log(`Token usados: ${r3.tokens_usados}`);
}

test()
