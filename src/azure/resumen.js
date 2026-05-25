// Servicio FOUNDRY (Azure)
require("dotenv").config();
const suscriptionKey = process.env.AZURE_SUBSCRIPTION_KEY;
const endpoint =
  process.env.AZURE_ENDPOINT || "https://ai001427877.services.ai.azure.com";

// URLs
const url = `${endpoint}/language/analyze-text/jobs?api-version=2023-04-01`;

async function resumirTexto(texto) {
  const documentoLargo =
    "Fíjate como las analogías y metáforas que utilizó para describirse a sí mismo y a los humanos. O sea, hizo como una, no esta esta mezcla entre lo humano y lo robótico. Hablaba de los de los cuerpos humanos como máquinas que se verían fácilmente. Entonces, es interesante que haya utilizado esas palabras para describirse. Digo, de entrada es bien interesante ver cómo los momentos históricos producen también la nuestra manera de entender el mundo. Hoy para describir muchas cosas hablamos en términos de software, hardware, incluso para el cerebro, ¿no? A veces escuchas a gente hablar de hardware, ¿no? de de como el cableado que tiene una persona y el software para describir cosas del cerebro y el comportamiento humano. Y es interesante porque esas palabras solamente se utilizan o más bien son producto esas descripciones del momento histórico en el que se vive, un momento histórico en donde hay computadoras, en donde hay tecnología, etcétera. Entonces, muy interesante verlo también en como Carl también utiliza estas palabras en un momento histórico en donde tienes androides, donde tienes máquinas, utiliza precisamente estas referencias para describir metafóricamente el cuerpo humano y así mismo. No soy como una máquina, pero él es un humano. Bueno, esper, en una de esas hay una sorpresa. Y tal vez eso también nos indica un poco, porque el [ __ ] está en los detalles y es bien importante las palabras que utilizamos porque las palabras a veces hay equívocos, a veces se dicen cosas que a lo mejor no tenías la intención de decir, pero que abajo o en el subtexto de las palabras que utilizamos se sale el inconsciente, se sale, ¿no? Que a final de cuentas el arte muchas veces es una expresión [música] del inconsciente, de aquello que no ha podido ser expresado de otra forma. Un artista suele a través de sus obras expresar cosas que tal vez no ha podido tramitar en un lenguaje convencional y el arte se vuelve un tipo de lenguaje justamente para poder expresar esas cosas. Entonces es interesante ver cómo nos ha descrito el cuerpo humano y asíismo como una máquina, como si fuera un androide, como algo robótico. Y vemos en sus obras de arte este patrón de rostros humanos, de cuerpo humano, de brazos humanos. Qué interesante, ¿no? De máquina, ¿no? Sino humano. O sea, como que pareciera, y digo, vuelvo a lo mismo, en el momento histórico en el que se encuentran, pues existe esta tensión entre lo humano y las máquinas. Y eso es bien interesante porque yo tal vez en nuestro momento histórico en el que estamos viviendo hoy, tal vez vamos a empezar a ver más esto. Podría ser incluso que se hagan mucho más populares, tal vez. Pero tal vez sí, sí, sí creo que podría ser que empecemos a ver como más obras de de cosas humanas, de cuerpos, de rostros, de cosas de ese estilo";

  const cuerpoPeticion = {
    displayName: "Resumir texto",
    analysisInput: {
      documents: [
        {
          id: "1",
          language: "es",
          text: documentoLargo,
        },
      ],
    },
    tasks: [
      {
        kind: "ExtractiveSummarization",
        taskName: "resumen_invasion",
        parameters: { sentenceCount: 2 },
      },
    ],
  };

  try {
    console.log("Enviando solicitud de resumen...");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": suscriptionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cuerpoPeticion),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error en: ${errorData.error.message}`);
    }

    // Hasta este punto, la mitad del trabajo ya está hecha, ahora solo falta esperar a que el servicio procese la solicitud y luego obtener el resultado

    const URLSeguimiento = response.headers.get("operation-location");
    console.log("Solicitud enviada, esperando resultado...");

    // Bucle de espera para obtener el resultado
    let resultadoFinal = null;
    while (true) {
      const respuestaSeguimiento = await fetch(URLSeguimiento, {
        headers: {
          "Ocp-Apim-Subscription-Key": suscriptionKey,
        },
      });

      resultadoFinal = await respuestaSeguimiento.json();
      if (resultadoFinal.status === "succeeded") {
        break;
      }

      if (resultadoFinal.status === "failed") {
        throw new Error("El proceso de resumen ha fallado.");
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    console.log("Resultado generado por la IA");
    //console.log(resultadoFinal.tasks.items);
    const tareaFinalizada = resultadoFinal.tasks.items[0];
    const frasesResumen = tareaFinalizada.results.documents[0].sentences;

    console.log(`Tarea finalizada: ${tareaFinalizada}`);
    frasesResumen.forEach((frase, indice) => {
      console.log(`${indice} - ${frase.text}`);
    });
  } catch (error) {
    console.error(error.message);
  }
}

resumirTexto();
