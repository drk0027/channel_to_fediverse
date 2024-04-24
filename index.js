require('dotenv').config();

const { Telegraf } = require('telegraf');
const axios = require('axios');

// Inicializa el bot de Telegram con tu token
const bot = new Telegraf(process.env.BOTAPI);

/**
 * Escuchar nuevos mensajes en el canal
 */
bot.on('channel_post', async (ctx) => {
  if (ctx.channelPost.sender_chat.id == process.env.CHANNEL_ID) {


    //Array to store data for send
    let status
    const messageUrl = `${process.env.CHANNEL_URL}${ctx.channelPost.message_id}`;


    console.log(ctx.channelPost)
    //si es un post de tipo foto o documento
    if (ctx.channelPost.photo || ctx.channelPost.document) {
      //y si la foto o documento tiene descripcion y la descripcion tiene entidades
      if (ctx.channelPost.caption && ctx.channelPost.caption_entities) {
        let messageEntities = ctx.channelPost.entities || ctx.channelPost.caption_entities;
        let text = ctx.channelPost.text || ctx.channelPost.caption;
        let html = convertEntitiesToHTML(text, messageEntities);
        status = `${html}\n\n[Ver mensaje original](${messageUrl})`
      }
      //si la foto tiene descripcion pero no entidades
      if (ctx.channelPost.caption && !ctx.channelPost.caption_entities) {
        status = `${ctx.channelPost.caption}\n\n[Ver mensaje original](${messageUrl})`
      }
      //si la foto no tiene texto en la descripcion
      if (!ctx.channelPost.caption && !ctx.channelPost.caption_entities) {
        status = `La entrada tiene multimedia. Miralo en el post original.\n\n[Ver mensaje original](${messageUrl})`
      }
    } else {
      //no es de documento ni foto, pero si de texto y tiene entidades
      if (ctx.channelPost.text && ctx.channelPost.entities) {
        let messageEntities = ctx.channelPost.entities || ctx.channelPost.caption_entities;
        let text = ctx.channelPost.text || ctx.channelPost.caption;
        let html = convertEntitiesToHTML(text, messageEntities);
        status = `${html}\n\n[Ver mensaje original](${messageUrl})`
      }
      //no es de documento ni foto pero si de texto y no tiene entidades
      if (ctx.channelPost.text && !ctx.channelPost.entities) {
        //dataForm.status=`${html}\n\n[Ver mensaje original](${messageUrl})`
        status = `${ctx.channelPost.text}\n\n[Ver mensaje original](${messageUrl})`
      }
    }


    if (process.env.FRIENDICA_USER != "") {
      postToFriendica(status)
    }

    if (process.env.MASTODON_ACCESS_TOKEN != "") {
      if (ctx.channelPost.text || ctx.channelPost.caption) {
        if (ctx.channelPost.text) {
          status = `${ctx.channelPost.text}\n\n[Ver mensaje original](${messageUrl})`
        }
        if (ctx.channelPost.caption) {
          status = `${ctx.channelPost.caption}\n\n[Ver mensaje original](${messageUrl})`
        }
      } else {
        status = `La entrada tiene multimedia. Miralo en el post original.\n\n[Ver mensaje original](${messageUrl})`
      }
      postToMastodon(status)
    }
  }
});

/**
 * # postToFriendica
 * Recibe los datos para construir el estado y publicarlo
 */
async function postToFriendica(status) {
  try {
    // Prepara el formulario para enviar a Friendica
    const formData = new FormData();
    formData.append('status', status)
    formData.append('source', 'Telegram');

    console.log(formData)

    // Envía el mensaje a Friendica
    const response = await axios.post('https://social.interlan.ec/api/statuses/update', formData, {
      auth: {
        username: process.env.FRIENDICA_USER,
        password: process.env.FRIENDICA_PASS
      },
      headers: formData.getHeaders ? formData.getHeaders() : { 'Content-Type': 'multipart/form-data' }
    });

    // Verifica si la publicación fue exitosa
    if (response.status === 200) {
      console.log('Mensaje reenviado a Friendica con éxito');
    } else {
      console.log('Error al publicar en Friendica:', response.status);
    }
  } catch (error) {
    console.error('Error al reenviar el mensaje:', error);
  }
}

/**
 * # postToMastodon
 * 
 * 
 * @param {*} status 
 */
function postToMastodon(status) {
  //falta que de formato al post, pero esta casi listo
  const accessToken = process.env.MASTODON_ACCESS_TOKEN;
  const apiUrl = process.env.MASTODON_API_URL;

  // Prepara el texto con formato y la nota de que proviene de Telegram
  const contenidoConFormato = status;

  // Configura los datos de la publicación
  const datosDePublicacion = {
    status: contenidoConFormato,
    visibility: 'public' // Puedes cambiar la visibilidad si lo deseas
  };

  // Realiza la petición POST a la API de Mastodon
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosDePublicacion)
  })
    .then(response => response.json())
    .then(data => console.log('Publicación exitosa:', data))
    .catch(error => console.error('Error al publicar:', error));
}

/**
 * # convertEntitiesToHTML
 * 
 * convert entities to HTML
 * @param {*} text 
 * @param {*} entities 
 * @returns 
 */
function convertEntitiesToHTML(text, entities) {
  let offsetAdjustment = 0;

  for (let entity of entities) {
    let offset = entity.offset + offsetAdjustment;
    let length = entity.length;
    let htmlTag = getHTMLTagForEntity(entity.type);

    if (htmlTag) {
      let before = text.substring(0, offset);
      let middle = text.substring(offset, offset + length);
      let after = text.substring(offset + length);

      middle = `<${htmlTag}>${middle}</${htmlTag}>`;
      text = before + middle + after;

      offsetAdjustment += htmlTag.length * 2 + 5; // Adjust offset for added HTML tags
    }
  }

  return text;
}

/**
 * # getHTMLTagForEntity
 * 
 * 
 * @param {*} entityType 
 * @returns 
 */
function getHTMLTagForEntity(entityType) {
  switch (entityType) {
    case 'bold':
      return 'b';
    case 'italic':
      return 'i';
    case 'underline':
      return 'u';
    case 'strikethrough':
      return 's';
    case 'code':
      return 'code';
    case 'pre':
      return 'pre';
    default:
      return '';
  }
}

// Bot Start
bot.launch();