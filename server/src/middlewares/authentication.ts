/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import { Handler } from 'express';
import { verify, JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { parseJwtDateExpire } from '../helpers/date';
import { appSecret } from '../configs';
import Usuario, { IUsuario } from '../models/auth/usuario';

/*******************************************************************************************************/
// Validamos y decodificamos el jsonwebtoken en la petición  //
/*******************************************************************************************************/
export const validarToken: Handler = async (req, res, next) => {
	// Leemos los headers de la petición
	const { headers } = req;
	// Obtenemos la cabecera de autorización
	const { authorization } = headers;

	// Si no existe el authorization
	if (!authorization || authorization === '') {
		return res.status(401).json({
			status: false,
			msg: 'Se debe proporcionar un token'
		});
	}

	// Obtenemos el token desde la Autorización
	const token: string = <string>authorization;

	try {
		// Intentamos verificar el token, con el texto secreto de la aplicación
		const decoded: JwtPayload = <JwtPayload>verify(token, appSecret);

		// Si existe una decodificación
		if (decoded?.usuario) {
			// Obtenemos los datos del usuario actualizados
			const usuario: IUsuario | null = await Usuario.findById(decoded.usuario);

			// Si no existe el usuario
			if (!usuario) {
				// Retornamos
				return res.status(403).json({
					status: false,
					msg: 'El usuario no existe'
				});
			}

			// Almacenamos el id del usuario en el request
			req.usuario = usuario._id;

			// Si pasó todas las validaciones seguimos a la siguiente función
			next();
		}
	} catch (error: VerifyErrors | any) {
		// Capturamos los tipos de error en la vericación
		if (error.name === 'JsonWebTokenError') {
			// Mostramos el error en consola
			console.log('Autenticando token Middleware', 'JsonWebTokenError', error.message);
			// Retornamos
			return res.status(401).json({
				status: false,
				msg: 'El token proporcionado es inválido'
			});
		}
		if (error.name === 'TokenExpiredError') {
			// Mostramos el error en consola
			console.log('Autenticando token Middleware', 'TokenExpiredError', error.message, error.expiredAt);
			// Obtenemos la fecha de expiración casteada del token
			const msg: string = parseJwtDateExpire(error.expiredAt);
			// Retornamos
			return res.status(401).json({
				status: false,
				msg
			});
		}
		if (error.name === 'NotBeforeError') {
			// Mostramos el error en consola
			console.log('Autenticando token Middleware', 'NotBeforeError', error.message, error.date);
			// Retornamos
			return res.status(401).json({
				status: false,
				msg: 'El token no está activo'
			});
		}
	}
};
