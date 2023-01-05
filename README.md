# mascota-feliz-backend V.0.1.0

Esta aplicación fue generada usando [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) con el
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Instalación de dependencias

Por defecto, las dependencias se instalaron cuando se generó esta aplicación.
Siempre que se cambien las dependencias en `package.json`, ejecute el siguiente comando:

```sh
npm install
```

Para instalar sólo las dependencias resueltas en `package-lock.json`:

```sh
npm ci
```

## Correr la aplicación

Antes de correr la aplicación tenga en cuenta que este solo es el backend del proyecto **MascotaFeliz** esto solo desplegará una Full REST API con los endpoints necesarios para interactuar con el sistema y la base de datos en **MongoDB**. Para poder visualizar el proyecto por completo por favor dirijase a el repositorio correspondiente al [frontend de MascotaFeliz](https://github.com/jhonjab19/mascota-feliz-frontend) para más información.

Si la recomendación anterior está resuelta entonces pruebe ejecutar:

```sh
npm start
```

También puede ejecutar `node .` para saltarse el paso de compilación.

Abra http://127.0.0.1:3000 en su navegador.

## Recompilar el proyecto

Para construir el proyecto de forma incremental:

```sh
npm run build
```

Para forzar una compilación completa limpiando los artefactos almacenados en caché:

```sh
npm run rebuild
```

## Corrección de problemas de estilo y formato del código

```sh
npm run lint
```

Para solucionar automáticamente estos problemas:

```sh
npm run lint:fix
```

## Otros comandos útiles

- `npm run migrate`: Migrar esquemas de base de datos para modelos
- `npm run openapi-spec`: Genera la especificación OpenAPI en un archivo

## Pruebas

```sh
npm test
```

## ¿Qué sigue?

Por favor, consulte la [documentación de LoopBack 4](https://loopback.io/doc/en/lb4/) para
entender cómo puedes seguir añadiendo funciones a esta aplicación.

[![LoopBack](<https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)
