# Platzi Overflow

Sistema tipo foro, donde se permite iniciar sesión, crear y responder preguntas

#### Nota: Proyecto estrictamente educativo

## Herramientas utilizadas

- HapiJs
- Hbs
- Firebase
- Docker

## Instalación y configuración

Para el funcionamiento del proyecto se utiliza Docker. A continuación la forma de inicializar

### Configuración

Antes de iniciar los servicios del proyecto es necesario generar un archivo de configuración para las variables de entorno, para ello sera necesario realizar los siguientes pasos:

- En la raiz del proyecto generar un archivo para las variables de entorno que debera llamarse `.env`

```
touch .env
```
- En dicho archivo agregar y configurar las variables necesarias
- Ya que el proyecto utiliza Firebase como sistema para persistir la data es necesario primero configurar dicha base de datos y agregar el archivo `firebase.json` generado en el directorio `config/`

### Lanzamiento Modo desarrollo

- Para el modo de desarrollo es importante tener configuradas las variables de entorno 
  - PORT
  - NODE_ENV

- Inicializar el contenedor

```
# Iniciarlizar el contenedor por primera vez
docker-compose up -d --build

# Cuando ya se ha construido la imagen es posible ejecutar
docker-compose up -d

```
- Cuando el contenedor termine de inicializar es posible acceder a este a traves de la dirección `http://localhost:PORT`

- Como ultimo paso y para finalizar es necesario dar de baja el contenedor

```
# Finalizar el contenedor
docker-compose down
```
### Lanzamiento Modo producción

- Para el modo de desarrollo es importante tener configuradas las variables de entorno 
  - PORT
  - NODE_ENV

- Inicializar el contenedor
```

# Iniciarlizar el contenedor por primera vez
docker-compose -f docker-compose.prod.yml up -d --build

# Cuando ya se ha construido la imagen es posible ejecutar
docker-compose -f docker-compose.prod.yml up -d

```
- Cuando el contenedor termine de inicializar es posible acceder a este a traves de la dirección `http://localhost:SERVER_PORT`

- Como ultimo paso y para finalizar es necesario dar de baja el contenedor

```
# Finalizar el contenedor
docker-compose down
```

## Variables de entorno

```
NODE_ENV=dev|prod
PORT=YOUR_PORT
FIREBASE_DATABASE=URL_FIREBASE_DATABASE
```
