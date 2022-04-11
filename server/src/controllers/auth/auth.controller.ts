/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import { Handler } from 'express';
import { verify, JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import Usuario, { IUsuario } from '../../models/auth/usuario';
import { tokenTime, appSecret } from '../../configs';
import { parseJwtDateExpire } from '../../helpers/date';
import { generateTokenWithTime } from '../../helpers/jwtoken';

/*******************************************************************************************************/
// Inicio de sesión del usuario //
/*******************************************************************************************************/
export const login: Handler = async (req, res) => {
	// Leemos las cabeceras y el cuerpo de la petición
	const { headers, body } = req;

	try {
		// Intentamos realizar la búsqueda por nombre del usuario
		const usuario: IUsuario | null = await Usuario.findOne({ nombre: body.nombre });

		// Verificamos si el usuario existe
		if (!usuario) {
			return res.status(401).json({
				status: false,
				msg: 'El usuario no existe'
			});
		}

		// Verificamos la contraseña enviada con la contraseña del usuario
		const pwdIsValid: boolean = await compare(body.password, usuario.password);
		// Si no es válida
		if (pwdIsValid === false) {
			return res.status(401).json({
				status: false,
				msg: 'La contraseña no es válida'
			});
		}

		// Definimos el objeto payload
		const payload: JwtPayload = {
			usuario: usuario._id
		};

		// Generamos el token del usuario
		const token: string | null = await generateTokenWithTime(payload, tokenTime);

		// Retornamos los token, datos y permisos del usuario
		return res.json({
			status: true,
			msg: 'Se inició la sesión correctamente',
			usuario: usuario.nombre,
			token: token ? token : ''
		});
	} catch (error) {
		// Mostramos el error en consola
		console.log('Login de usuario:', error);
		// Retornamos
		return res.status(404).json({
			status: false,
			msg: 'Hubo un error en la validación del usuario'
		});
	}
};

/*******************************************************************************************************/
// Chequeamos el token del usuario //
/*******************************************************************************************************/
export const check: Handler = async (req, res) => {
	// Leemos las cabeceras y el cuerpo de la petición
	const { headers, body } = req;
	// Obtenemos la cabecera de autorización
	const { token } = body;

	// Si no existe el token
	if (!token || token === '') {
		return res.status(401).json({
			status: false,
			msg: 'Se debe proporcionar un token'
		});
	}

	try {
		// Intentamos verificar el token, con el texto secreto de la aplicación
		const decoded: JwtPayload = <JwtPayload>verify(token, appSecret);

		// Si existe una decodificación
		if (decoded?.usuario) {
			// Obtenemos los datos del usuario actualizados
			const usuario: IUsuario | null = await Usuario.findById(decoded.usuario);

			// Si existe el usuario
			if (usuario) {
				// Retornamos
				return res.json({
					status: true,
					msg: 'El usuario fue validado',
					usuario: usuario.nombre
				});
			} else {
				// Retornamos
				return res.status(403).json({
					status: false,
					msg: 'El usuario no existe'
				});
			}
		}
	} catch (error: VerifyErrors | any) {
		// Capturamos los tipos de error en la vericación
		if (error.name === 'JsonWebTokenError') {
			// Mostramos el error en consola
			console.log('Chequeando token', 'JsonWebTokenError', error.message);
			// Retornamos
			return res.status(401).json({
				status: false,
				msg: 'El token proporcionado es inválido'
			});
		}
		if (error.name === 'TokenExpiredError') {
			// Mostramos el error en consola
			console.log('Chequeando token', 'TokenExpiredError', error.message, error.expiredAt);
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
			console.log('Chequeando token', 'NotBeforeError', error.message, error.date);
			// Retornamos
			return res.status(401).json({
				status: false,
				msg: 'El token no está activo'
			});
		}
	}
};
