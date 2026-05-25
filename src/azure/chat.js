const { response } = require("express");

const endpointUrl = process.env.AZURE_CHAT_URL_ENDPOINT;

const token = process.env.TOKEN

const data = {
  model: "Phi-4",
  messages: [
    {
      role: "user",
      content: "¿Que ventajas tiene slackware linux sobre Windows? --- Responde en respuestas cortas y resumidas",
    }
  ]
};

fetch(endpointUrl, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": `application/json`,
  },
  body: JSON.stringify(data),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    if (data.choices && data.choices.length > 0) {
      console.log(`Respuesta corta: ${data.choices[0].message.content}`);
    } else {
      console.log(`No puedo dar una respuesta`);
    }
  })
  .catch((e) => {
    console.error(e);
  });

  async function enviarPregunta(pregunta = ``) {
    const data = {
      model: "Phi-4",
      messages: [
        {
          role: "user",
          content: pregunta,
        }
      ]
    };

    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": `application/json`,
      },
      body: JSON.stringify(data),
    })

    if(!response.ok) {
      console.error("No se pudo acceder al servicio");
      return      
    }

    const datas = await response.json()

    if(!response.ok) {
      console.log(`Respuesta corta: ${datas.choices[0].message.content}`);      
    } else {
      console.log(`No puedo dar una respuesta`);
    }
  }

  enviarPregunta("¿Que ventajas tiene slackware linux sobre Windows? --- Responde en respuestas cortas y resumidas")