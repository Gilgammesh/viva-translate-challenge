/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import { Handler } from 'express';
import { Error } from 'mongoose';
import Cuestionario, { ICuestionario } from '../../models/quiz/cuestionario';
import Pregunta, { IPregunta } from '../../models/quiz/pregunta';
import { getPage, getPageSize, getTotalPages } from '../../helpers/pagination';

/*******************************************************************************************************/
// Variables generales del Controlador //
/*******************************************************************************************************/
const exclude_campos = '-createdAt -updatedAt';
const pagination = {
	page: 1,
	pageSize: 10
};

/*******************************************************************************************************/
// Obtener todos los cuestionarios //
/*******************************************************************************************************/
export const getAll: Handler = async (req, res) => {
	// Leemos el query de la petición
	const { usuario, query } = req;

	try {
		// Intentamos obtener el total de registros de cuestionarios
		const totalRegistros: number = await Cuestionario.find({ usuario }).count();

		// Obtenemos el número de registros por página y hacemos las validaciones
		const validatePageSize: any = await getPageSize(pagination.pageSize, query.pageSize);
		if (!validatePageSize.status) {
			return res.status(404).json({
				status: validatePageSize.status,
				msg: validatePageSize.msg
			});
		}
		const pageSize = validatePageSize.size;

		// Obtenemos el número total de páginas
		const totalPaginas: number = getTotalPages(totalRegistros, pageSize);

		// Obtenemos el número de página y hacemos las validaciones
		const validatePage: any = await getPage(pagination.page, query.page, totalPaginas);
		if (!validatePage.status) {
			return res.status(404).json({
				status: validatePage.status,
				msg: validatePage.msg
			});
		}
		const page = validatePage.page;

		// Intentamos realizar la búsqueda de todos los cuestionarios paginados
		const list: Array<ICuestionario> = await Cuestionario.find({ usuario }, exclude_campos)
			.sort({ nombre: 'asc' })
			.skip((page - 1) * pageSize)
			.limit(pageSize);

		// Retornamos la lista de cuestionarios
		return res.json({
			status: true,
			pagina: page,
			totalPaginas,
			registros: list.length,
			totalRegistros,
			list
		});
	} catch (error) {
		// Mostramos el error en consola
		console.log('Quiz', 'Obteniendo la lista de cuestionarios', error);
		// Retornamos
		return res.status(404).json({
			status: false,
			msg: 'No se pudo obtener los cuestionarios'
		});
	}
};

/*******************************************************************************************************/
// Obtener datos de un cuestionario //
/*******************************************************************************************************/
export const get: Handler = async (req, res) => {
	// Leemos los parámetros de la petición
	const { params } = req;
	// Obtenemos el Id del cuestionario
	const { id } = params;
	try {
		// Intentamos realizar la búsqueda por id
		const cuestionario: ICuestionario | null = await Cuestionario.findById(id, exclude_campos);

		// Retornamos los datos del cuestionario encontrado
		return res.json({
			status: true,
			cuestionario
		});
	} catch (error) {
		// Mostramos el error en consola
		console.log('Quiz', 'Obteniendo datos del cuestionario', id, error);
		// Retornamos
		return res.status(404).json({
			status: false,
			msg: 'No se pudo obtener los datos del cuestionario'
		});
	}
};

/*******************************************************************************************************/
// Crear un nuevo cuestionario //
/*******************************************************************************************************/
export const create: Handler = async (req, res) => {
	// Leemos el cuerpo de la petición
	const { usuario, body } = req;

	try {
		// Creamos el modelo de un nuevo cuestionario
		const newCuestionario: ICuestionario = new Cuestionario({ ...body, usuario });

		// Intentamos guardar el nuevo cuestionario
		await newCuestionario.save();

		// Retornamos el cuestionario creado
		return res.json({
			status: true,
			msg: 'Se creó el cuestionario correctamente'
		});
	} catch (error: Error | any) {
		// Mostramos el error en consola
		console.log('Quiz', 'Crear nuevo cuestionario', error);

		// Inicializamos el mensaje de error
		let msg: string = 'No se pudo crear el cuestionario';
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

/*******************************************************************************************************/
// Actualizar los datos de un cuestionario //
/*******************************************************************************************************/
export const update: Handler = async (req, res) => {
	// Leemos los parámetros y el cuerpo de la petición
	const { params, body } = req;
	// Obtenemos el Id del cuestionario
	const { id } = params;

	try {
		// Intentamos realizar la búsqueda por id y actualizamos
		await Cuestionario.findByIdAndUpdate(
			id,
			{ $set: body },
			{
				new: true,
				runValidators: true,
				context: 'query'
			}
		);

		// Retornamos el cuestionario actualizado
		return res.json({
			status: true,
			msg: 'Se actualizó el cuestionario correctamente'
		});
	} catch (error: Error | any) {
		// Mostramos el error en consola
		console.log('Quiz', 'Actualizando cuestionario', id, error);

		// Inicializamos el mensaje de error
		let msg: string = 'No se pudo actualizar los datos del cuestionario';
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

/*******************************************************************************************************/
// Eliminar un cuestionario //
/*******************************************************************************************************/
export const remove: Handler = async (req, res) => {
	// Leemos los parámetros de la petición
	const { params } = req;
	// Obtenemos el Id del cuestionario
	const { id } = params;

	try {
		// Intentamos realizar la búsqueda por id y removemos
		await Cuestionario.findByIdAndRemove(id);

		// Removemos todas las preguntas asociadas al cuestionario
		await Pregunta.deleteMany({ cuestionario: id });

		// Retornamos el cuestionario eliminado
		return res.json({
			status: true,
			msg: 'Se eliminó el cuestionario correctamente'
		});
	} catch (error) {
		// Mostramos el error en consola
		console.log('Quiz', 'Eliminando cuestionario', id, error);
		// Retornamos
		return res.status(404).json({
			status: false,
			msg: 'No se pudo eliminar el cuestionario'
		});
	}
};
