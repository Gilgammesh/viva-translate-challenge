/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import * as dotenv from 'dotenv';
import { CorsOptions } from 'cors';

/*******************************************************************************************************/
// Habilitamos las variables de entorno //
/*******************************************************************************************************/
dotenv.config();

/*******************************************************************************************************/
// Variables de la Aplicación //
/*******************************************************************************************************/
// Entorno de la Aplicación ( development / production )
export const appEnvironment: string = process.env.APP_ENVIRONMENT || 'development';
// Host de la Aplicación
export const appHost: string = process.env.APP_HOST || 'http://localhost';
// Nombre de la aplicación
export const appNombre: string = process.env.APP_NAME || '';
// Descripción de la aplicación
export const appDescripcion: string = process.env.APP_DESCRIPTION || '';
// Puerto de la aplicación
export const appPort: number = parseInt(`${process.env.APP_PORT}`, 10) || 3000;
// Texto secreto de la aplicación
export const appSecret: string = process.env.APP_SECRET_TEXT || '';
// Autor de la aplicación
export const appAutorName: string = process.env.APP_AUTHOR_NAME || '';

/*******************************************************************************************************/
// Variables de la Base de Datos MongoDB //
/*******************************************************************************************************/
// Driver de la base de datos
export const dbDriver: string = process.env.APP_MONGO_DB_DRIV || 'mongodb';
// Host de la base de datos
export const dbHost: string = process.env.APP_MONGO_DB_HOST || 'localhost';
// Puerto de la base de datos
export const dbPort: number = parseInt(`${process.env.APP_MONGO_DB_PORT}`, 10) || 27017;
// Nombre de la base de datos
export const dbName: string = process.env.APP_MONGO_DB_NAME || 'test';
// Usuario de la base de datos
export const dbUser: string = process.env.APP_MONGO_DB_USER || '';
// Contraseña de la base de datos
export const dbPwd: string = process.env.APP_MONGO_DB_PWD || '';

/*******************************************************************************************************/
// Configuraciones Generales de la Aplicación //
/*******************************************************************************************************/
// Locale para la zona horaria
export const locale: string = 'es-PE';
// Estado para indicar si el token expira
export const tokenExpire: boolean = true;
// Tiempo de expiración de los JsonWebToken
export const tokenTime: string = '7d';
// Zona horaria la aplicación
export const timeZone: string = 'America/Lima';

/*******************************************************************************************************/
// Opciones de CORS //
/*******************************************************************************************************/
export const corsOptions: CorsOptions = {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Authorization', 'Content-Type']
};
