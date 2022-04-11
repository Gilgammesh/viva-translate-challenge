/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import { Handler } from 'express';
import { Error } from 'mongoose';
import Usuario, { IUsuario } from '../../models/auth/usuario';
import encrypt from '../../helpers/encrypt';

/*******************************************************************************************************/
// Crear un nuevo usuario //
/*******************************************************************************************************/
export const create: Handler = async (req, res) => {
	// Leemos el cuerpo de la petición
	const { body } = req;

	try {
		// Encriptamos la contraseña antes de guardarla
		const pwdEncrypted: string | null = await encrypt(body.password);
		// Insertamos la contraseña encriptada
		body.password = pwdEncrypted;

		// Creamos el modelo de un nuevo usuario
		const newUsuario: IUsuario = new Usuario(body);

		// Intentamos guardar el nuevo usuario
		await newUsuario.save();

		// Retornamos el usuario creado
		return res.json({
			status: true,
			msg: 'Se registró el usuario correctamente'
		});
	} catch (error: Error | any) {
		// Mostramos el error en consola
		console.log('Auth', 'Crear nuevo usuario', error);

		// Inicializamos el mensaje de error
		let msg: string = 'No se pudo registrar el usuario';
		// Si existe un error con validación de campo único
		if (error?.errors) {
			// Obtenemos el array de errores
			const array: string[] = Object.keys(error.errors);
			// Construimos el mensaje de error de acuerdo al campo
			msg = `${error.errors[array[0]].path}: ${error.errors[array[0]].properties.message}`;
		}

		// Retornamos
		return res.status(404).json({
			status: false,
			msg
		});
	}
};
