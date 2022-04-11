/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import { sign, JwtPayload } from 'jsonwebtoken';
import { appSecret } from '../configs';

/*******************************************************************************************************/
// Función para generar un jsonwebtoken indefinido (que nunca expira) //
/*******************************************************************************************************/
export const generateToken = async (object: JwtPayload) => {
	try {
		// Intentamos crear el jwtoken firmado con el payload y el texto secreto
		const token: string = sign(
			object, // payload o datos del cuerpo
			appSecret // texto secreto de la aplicación
		);
		// Retornamos
		return token;
	} catch (error) {
		// Mostramos el error en consola
		console.log(error);
		// Retornamos
		return null;
	}
};

/*******************************************************************************************************/
// Función para generar un jsonwebtoken definido (que expira en un tiempo determinado) //
/*******************************************************************************************************/
export const generateTokenWithTime = async (object: JwtPayload, time: string) => {
	try {
		// Intentamos crear el jwtoken firmado con el payload, el texto secreto y el tiempo de expiración
		const token: string = sign(
			object, // payload o datos del cuerpo
			appSecret, // texto secreto de la aplicación
			{
				expiresIn: time // Tiempo en el que expira el token.
			}
		);
		// Retornamos
		return token;
	} catch (error) {
		// Mostramos el error en consola
		console.log(error);
		// Retornamos
		return null;
	}
};
