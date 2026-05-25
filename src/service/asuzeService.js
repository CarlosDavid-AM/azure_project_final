const detectarImagen = async (req, res) => {
  const suscriptionKey = ""
  const endpoint = ""

  const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Categories,Description,Color`
  const imageURL = req.params

  try{
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        "Ocp-Apim-Subscription-Key": suscriptionKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: imageURL })
    })

    if (!response.ok){
      const errorData = await response.json()
      throw new Error(`Error en: ${errorData.error.message}`)
    }

    //Logramos recibir un resultado favorable
    const data = await response.json()
    res.status(200).json(data);
    // const confianza = (data.description.captions[0].confidence * 100).toFixed(2)

    // //Muestra todos los datos
    // //console.log(data.description)
    
    // console.log("Descripción: ", data.description.captions[0].text)
    // console.log(`Confianza: ${confianza} %`)
    
    // //join método que itera y concatena valores de un array
    // console.log("Etiquetas: " + data.description.tags.join(", ")) 



  }catch(error){
    console.error(`Error analizando imagen: ${error.message}`)
  }
}

export default detectarImagen;