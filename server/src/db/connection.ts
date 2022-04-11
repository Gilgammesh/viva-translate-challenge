/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import mongoose, { ConnectOptions } from 'mongoose';
import { appEnvironment, dbDriver, dbHost, dbName, dbUser, dbPwd, dbPort } from '../configs';
import 'colors';

/*******************************************************************************************************/
// Creamos la conexión a la Base de Datos MongoDB //
/*******************************************************************************************************/
const connection = async () => {
	// Propiedades en la cadena de conexión
	let properties: string = 'retryWrites=true&w=majority';
	// Si no existe usuario y contraseña (entorno local)
	if (dbUser !== '' && dbPwd !== '') {
		properties = 'authSource=admin&retryWrites=true&w=majority';
	}
	// URI de acceso a la Base de Datos
	const URI: string = `${dbDriver}://${dbHost}:${dbPort}/${dbName}?${properties}`;

	// Definimos las opciones de conexión a la base de datos
	const mongooseOptions: ConnectOptions = {
		// Construye index definidos en nuestros esquemas cuando se conecta (ideal en producción)
		autoIndex: appEnvironment === 'development' ? true : false,
		// Usuario de la base de datos
		user: dbUser,
		// Contraseña de la base de datos
		pass: dbPwd
	};

	// Intentamos conectarnbos a la base de datos
	try {
		await mongoose.connect(URI, mongooseOptions);
		console.log(`Conexión exitosa a MongoDB  `.green.bold.toString());
		console.log(`Base de datos: `.yellow.bold.toString() + `${dbName}   `.white.bold);
		console.log('************************************'.rainbow);
	} catch (error) {
		// En caso de error mostramos
		console.log('Error en la conexión:  '.white.bold);
		console.log(error);
		console.log('************************************'.rainbow);
	}
};

/*******************************************************************************************************/
// Exportamos la conexión a la base de datos por defecto //
/*******************************************************************************************************/
export default connection;
