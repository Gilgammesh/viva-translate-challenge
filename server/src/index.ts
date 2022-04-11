/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import express, { json, urlencoded, Request, Response } from 'express';
import { createServer } from 'http';
import { platform } from 'os';
import cors from 'cors';
import logger from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import routesX from './routes';
import dbConnection from './db/connection';
import { corsOptions, appEnvironment, appPort, appAutorName, appNombre, appHost } from './configs';
import 'moment/locale/es';
import 'colors';

/*******************************************************************************************************/
// Inicializamos la variable de aplicación express //
/*******************************************************************************************************/
const app = express();

/*******************************************************************************************************/
// Middlewares de la aplicación //
/*******************************************************************************************************/
// Asegura nuestra app configurando varios encabezados HTTP
app.use(helmet());
// Permite acceder a recursos del servidor desde otros dominios
app.use(cors(corsOptions));
// Realiza un parse de los formatos aplication/json
app.use(json());
// Decodifica los datos enviados desde un formulario
app.use(urlencoded({ extended: false }));
// Realiza un parse de la cookies en las peticiones http al servidor
app.use(cookieParser());
// Habilita compresión en todas las responses del servidor
app.use(compression());
// Logger para ver las peticiones http al servidor
app.use(logger('combined'));

/*******************************************************************************************************/
// Llamamos a las rutas de la aplicación //
/*******************************************************************************************************/
routesX(app);

/***************************************************************************************************************/
// Nos conectamos a la Base de Datos MongoDB //
/***************************************************************************************************************/
dbConnection();

/*******************************************************************************************************/
// Creamos el Servidor HTTP //
/*******************************************************************************************************/
const httpServer = createServer(app);

/*******************************************************************************************************/
// Arrancamos el Servidor HTTP con Express //
/*******************************************************************************************************/
httpServer.listen(appPort, () => {
	console.log('************************************'.rainbow);
	console.log(`Autor: ${appAutorName}`.blue.bold);
	console.log('************************************'.rainbow);
	console.log(`Nombre: ${appNombre}`.magenta.bold);
	console.log('************************************'.rainbow);
	console.log(`${platform().toUpperCase()} Servidor (${appEnvironment})`.yellow.bold.toString());
	if (appEnvironment === 'development') {
		console.log(`${appHost}:${appPort}   `.white.bold);
	}
	if (appEnvironment === 'production') {
		console.log(`${appHost}   `.white.bold);
	}
	console.log('************************************'.rainbow);
});
