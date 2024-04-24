# Channel to Fediverse Bot

Este bot permite republicar las entradas de un canal de telegram a las cuentas de friendica o mastodon definidas en el archivo .env

# :notebook_with_decorative_cover: Table of Contents

- [Channel to Fediverse Bot](#channel-to-fediverse-bot)
- [:notebook\_with\_decorative\_cover: Table of Contents](#notebook_with_decorative_cover-table-of-contents)
- [Sobre El Proyecto](#sobre-el-proyecto)
    - [:key: Environment Variables](#key-environment-variables)
  - [:toolbox: Getting Started](#toolbox-getting-started)
    - [:bangbang: Prerequisites](#bangbang-prerequisites)
    - [:gear: Installation](#gear-installation)
  - [:compass: Roadmap](#compass-roadmap)
  - [:grey\_question: FAQ](#grey_question-faq)
  - [:handshake: Contact](#handshake-contact)

# Sobre El Proyecto

Esta version es de uso personal debido a que hay que hacer cierta inversion para mantener un bot activo. Utilizalo a tu gusto y montalo en el servidor o computadora domestica que quieras. Incluso puedes ejecutarlo en un dispositivo android con termux y sus respectivas configuraciones.

Recuerda que la naturaleza de los canales de telegram, te dan cierta libertad que no tendras en mastodon y la estructura de chat hace que olvides que publicar cosas insignificantes como un separador en el canal, sea extraño y probablemente descontextualizable en tu perfil social de friendica o mastodon.

En este bot tambien he omitido la carga de multimedia a los post de las cuentas sociales citadas debido a la misma naturaleza de los canales de telegram. Mientras que en friendica es posible incrustar imagenes a lo largo del post, en mastodon solo se puede agregar una o varias al final y en telegram solo se puede crear un post tipo imagen con descripcion o un post de texto sin imagen.

### :key: Environment Variables

Para ejecutar este proyecto, deberas configurar las siguientes variables de entorno. He dejado un archivo de ejemplo llamado `.env.example` para que lo puedas copiar renombrandolo a `.env` en el directorio raiz

`BOTAPI` 

`CHANNEL_URL`

`CHANNEL_ID`

`FRIENDICA_USER`

`FRIENDICA_PASS`

`MASTODON_ACCESS_TOKEN`

`MASTODON_API_URL`

MASTODON_API_URL es la url de tu instancia de mastodon mas `/api/v1/statuses` ejemplo `https:/mastodon.social/api/v1/statuses`

## :toolbox: Getting Started

Este codigo permite el control de un bot de telegram que supervisará el canel donde sea agregado como administrador y reenviara a las cuentas configuradas en el archivo `.env` por lo que no tiene un bot asociado. Este debera ser creado en el BotFather, de donde se podrá obtener el token para su funcionamiento.

### :bangbang: Prerequisites

- Necesitas tener Node JS Instalado


### :gear: Installation

Instalar los módulos

```bash
npm install
```


## :compass: Roadmap

* [x] Detectar nuevos post en el canal
* [ ] Filtrar mensajes ajenos al propietario del bot


## :grey_question: FAQ

- ¿Donde está el bot?
- Este este bot no tiene un usuario creado para realizar sus tareas. Deberas crearlo usando el BotFather


## :handshake: Contact

Por el momento no tengo una forma de contacto apropiada, pero puedes visitar mi canal de telegram [drk0027](https:t.me/drk0072) o mi perfil de friendica.

[drk0027](https://social.interlan.ec/profile/drk0027) - - drk0027@interlan.ec