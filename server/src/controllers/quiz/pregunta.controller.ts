/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import { Handler } from 'express';
import { Error } from 'mongoose';
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
// Obtener todas las preguntas //
/*******************************************************************************************************/
export const getAll: Handler = async (req, res) => {
	// Leemos el query de la petición
	const { query } = req;

	try {
		// Intentamos obtener el total de registros de preguntas
		const totalRegistros: number = await Pregunta.find({ cuestionario: query.cuestionario }).count();

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

		// Intentamos realizar la búsqueda de todas las preguntas paginadas
		const list: Array<IPregunta> = await Pregunta.find({ cuestionario: query.cuestionario }, exclude_campos)
			.sort({ nombre: 'asc' })
			.populate('cuestionario', exclude_campos)
			.skip((page - 1) * pageSize)
			.limit(pageSize);

		// Retornamos la lista de preguntas
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
		console.log('Quiz', 'Obteniendo la lista de preguntas', error);
		// Retornamos
		return res.status(404).json({
			status: false,
			msg: 'No se pudo obtener las preguntas'
		});
	}
};

/*******************************************************************************************************/
// Obtener datos de una pregunta //
/*******************************************************************************************************/
export const get: Handler = async (req, res) => {
	// Leemos los parámetros de la petición
	const { params } = req;
	// Obtenemos el Id de la pregunta
	const { id } = params;
	try {
		// Intentamos realizar la búsqueda por id
		const pregunta: IPregunta | null = await Pregunta.findById(id, exclude_campos).populate(
			'cuestionario',
			exclude_campos
		);

		// Retornamos los datos de la pregunta encontrada
		return res.json({
			status: true,
			pregunta
		});
	} catch (error) {
		// Mostramos el error en consola
		console.log('Quiz', 'Obteniendo datos de la pregunta', id, error);
		// Retornamos
		return res.status(404).json({
			status: false,
			msg: 'No se pudo obtener los datos de la pregunta'
		});
	}
};

/*******************************************************************************************************/
// Crear una nueva pregunta //
/*******************************************************************************************************/
export const create: Handler = async (req, res) => {
	// Leemos el cuerpo de la petición
	const { body } = req;

	try {
		// Creamos el modelo de una nueva pregunta
		const newPregunta: IPregunta = new Pregunta(body);

		// Intentamos guardar la nueva pregunta
		await newPregunta.save();

		// Retornamos el pregunta creada
		return res.json({
			status: true,
			msg: 'Se creó la pregunta correctamente'
		});
	} catch (error: Error | any) {
		// Mostramos el error en consola
		console.log('Quiz', 'Crear nueva pregunta', error);

		// Inicializamos el mensaje de error
		let msg: string = 'No se pudo crear la pregunta';
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
// Actualizar los datos de una pregunta //
/*******************************************************************************************************/
export const update: Handler = async (req, res) => {
	// Leemos los parámetros y el cuerpo de la petición
	const { params, body } = req;
	// Obtenemos el Id de la pregunta
	const { id } = params;

	try {
		// Intentamos realizar la búsqueda por id y actualizamos
		await Pregunta.findByIdAndUpdate(
			id,
			{ $set: body },
			{
				new: true,
				runValidators: true,
				context: 'query'
			}
		);

		// Retornamos la pregunta actualizada
		return res.json({
			status: true,
			msg: 'Se actualizó la pregunta correctamente'
		});
	} catch (error: Error | any) {
		// Mostramos el error en consola
		console.log('Quiz', 'Actualizando pregunta', id, error);

		// Inicializamos el mensaje de error
		let msg: string = 'No se pudo actualizar los datos de la pregunta';
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
// Eliminar una pregunta //
/*******************************************************************************************************/
export const remove: Handler = async (req, res) => {
	// Leemos los parámetros de la petición
	const { params } = req;
	// Obtenemos el Id de la pregunta
	const { id } = params;

	try {
		// Intentamos realizar la búsqueda por id y removemos
		await Pregunta.findByIdAndRemove(id);

		// Retornamos la pregunta eliminada
		return res.json({
			status: true,
			msg: 'Se eliminó la pregunta correctamente'
		});
	} catch (error) {
		// Mostramos el error en consola
		console.log('Quiz', 'Eliminando pregunta', id, error);
		// Retornamos
		return res.status(404).json({
			status: false,
			msg: 'No se pudo eliminar la pregunta'
		});
	}
};
