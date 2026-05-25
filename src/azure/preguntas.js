const { text } = require("express");

const suscriptionKey = "";
const endpoint = "";

// const url = `${endpoint}/language/:query-knowledgebases?projectName=PruebaQA&api-version=2021-10-01`;
const url = `${endpoint}/language/:query-text?api-version=2021-10-01`;

async function responderPreguntas() {
  try {
    const contextoAnalizar = `Slackware Linux es una distribución Linux orientada a usuarios avanzados. Fue desarrollada por Patrick Volkerding en 1993 basándose en el código fuente de la distribución SLS Linux, y es considerada la distribución más antigua aún en desarrollo. Slackware contiene un programa de instalación basado en Ncurses que utiliza texto y menús para guiar a los usuarios durante el proceso de instalación. Además, incluye un gestor de paquetes integrado. Cuenta con documentación integrada en el sistema (FAQ), documentación en línea (Wiki) y Foros. Su característica distintiva es la similitud con los sistemas operativos Unix y la inclusión de software que no se encuentra de forma predeterminada en otras distribuciones Linux, como por ejemplo, Korn shell, Nvi, Elvis, entre otros. Una instalación completa de Slackware incorpora X.Org, una implementación del sistema de ventanas X Window System, así como diversos entornos de escritorio, tales como KDE y Xfce, y gestores de ventanas como Fluxbox, Blackbox, FVWM, Window Maker y Twm. Es importante señalar que a partir de la versión 10.1 de Slackware Linux, GNOME dejó de ser incluido de forma predeterminada. También incluye entornos de desarrollo para la mayoría de lenguajes de programación, utilidades de red, programas de diseño gráfico y edición de imágenes como Krita, GIMP y KolourPaint, entre otras opciones que se pueden instalar desde provedores de terceros y navegadores web como Firefox, SeaMonkey, ELinks, Lynx, etc. El proyecto Slackware comenzó como una serie de correcciones y modificaciones de la descontinuada distribución Softlanding Linux System (SLS). Pronto, la versión modificada de SLS ganó popularidad y el 16 de julio de 1993 fue lanzada oficialmente como «Slackware 1.0». Se distribuía en discos flexibles de 3½, en servidores FTP anónimos y fue anunciada por Patrick Volkerding en los grupos de noticias comp.os.linux. El término «Slackware» se deriva originalmente del concepto «slack» definido por la Iglesia de los subgenios, a la que Patrick Volkerding estuvo afiliado. La elección del nombre «Slackware» surgió como una ingeniosa broma de los primeros días del proyecto. En las primeras versiones de Slackware, la distribución tenía tres cuentas de usuario, «satan», «gonzo» y «snake». Estas eran incluidas solo como ejemplos, pero fueron eliminadas posteriormente porque entrañaban un potencial riesgo computacional. En 1999, el número de versión de Slackware se incrementó de 4 a 7, para demostrar que Slackware estaba actualizado al igual que otras distribuciones de Linux, muchas de las cuales tenían como número de publicación en ese momento el 6.`;

    // const pregunta = `¿Qué es Slackware?`;
    // const pregunta = `¿Que benefisios me trae al usar Slackware?`;
    const pregunta = `¿Qué significa Slackware?`;

    // Version conpacta
    const cuerpoPeticion = {
      question: pregunta,
      records: [
        {
          id: "doc_01",
          text: contextoAnalizar,
        },
      ],
    };

    // const cuerpoPeticion = {
    //   kind: "Conversation",
    //   analysisInput: {
    //     conversationItem: {
    //       id: "1",
    //       participantId: "usuario_final",
    //       text: pregunta,
    //     },
    //   },
    //   parameters: {
    //     projectName: "PruebaQA",
    //     deploymentName: "production",
    //     stringIndexType: "Utf16CodeUnit",
    //     records: [
    //       {
    //         id: "contexto_01",
    //         text: contextoAnalizar,
    //       },
    //     ],
    //   },
    // };

    console.log("Buscando respuesta en el documento...");
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

    const data = await response.json();

    const respuesta = data.answers[0].answer;
    const confianza = (data.answers[0].confidenceScore * 100).toFixed(2);

    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
}

responderPreguntas();
