/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import { apiBaseUrl } from 'configs/settings';
import { getToken } from 'helpers/authToken';

/*******************************************************************************************************/
// Interface del Resultado de Fetch //
/*******************************************************************************************************/
export interface IResultFetch {
	status: boolean;
	data?: {
		[key: string]: any;
		status: boolean;
		msg: string;
	};
	msg?: string;
}

/*******************************************************************************************************/
// Función asíncrona para obtener datos de una petición al servidor usando Fetch //
/*******************************************************************************************************/
export const fetchData = async (
	path: string,
	method: string = 'GET',
	data: any = {},
	contentType: string = 'application/json'
) => {
	// path : ruta relativa del servidor a cual hacemos la petición
	// method: método de la petición al servidor ('GET', 'POST', 'PUT', 'DELETE')
	// contentType: tipo de contenido enviado por defecto "application/json"
	// data: objeto donde se recibe datos del cuerpo de la petición.

	// Definimos el resultado inicial
	let result: IResultFetch = { status: false, msg: '' };

	// Obtenemos el token del localstorage si está guardado, caso contrario vacio
	const token: string = getToken();

	// Definimos la url de la API a la cual haremos la petición, usando la api base
	const url: string = `${apiBaseUrl}/${path}`;

	// Definimos las cabeceras de la petición
	let headers: HeadersInit = { Authorization: token };
	// Si el contenido es de tipo JSON
	if (contentType === 'application/json') {
		headers = { ...headers, 'Content-Type': contentType };
	}

	// Definimos las opciones de la petición
	let options: RequestInit = { headers };
	// Si el método es diferente de GET => pasamos el método, las cabeceras y el cuerpo con la data
	if (method !== 'GET') {
		let bodyData = null;
		if (contentType === 'application/json') {
			bodyData = JSON.stringify(data);
		}
		if (contentType === 'multipart/form-data') {
			bodyData = data;
		}
		options = { method, headers, body: bodyData };
	}

	// Aplicamos la función fetch pasando la url y las opciones, y esperamos la respuesta
	await fetch(url, options)
		// La respuesta la convertimos a JSON
		.then(res => res.json())
		// Almacenamos la respuesta con un estado positivo
		.then(data => {
			result = {
				status: true,
				data
			};
		})
		// En caso hubiese un error mostramos en consola y devolvemos el estado y mensaje
		.catch(err => {
			console.log('Conexión API con FETCH', url, err);
			result = {
				status: false,
				msg: 'No se pudo establecer la conexión con el servidor'
			};
		});

	// Retornamos el resultado de la petición
	return result;
};
