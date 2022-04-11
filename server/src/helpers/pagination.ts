/*******************************************************************************************************/
// Función para obtener el número de registros por página, con sus respectivas validaciones //
/*******************************************************************************************************/
export const getPageSize = async (defaultValue: number, valuePageSize: any) => {
	// Definimos el número de registros por página por defecto
	let pageSize: number = defaultValue;

	// Si el valor es indefinido (que no se mando en el request)
	if (valuePageSize === undefined) {
		// Retornamos
		return {
			status: true,
			size: pageSize
		};
	} else {
		// Si viene en el query, hacemos las validaciones
		if (typeof valuePageSize === 'string') {
			try {
				// Intentamos convertir el string a número
				pageSize = Number(valuePageSize);
				// Si el número de registros por página es entero
				if (Number.isInteger(pageSize)) {
					// Si el número de registros por página es 0 o negativo
					if (pageSize < 1) {
						// Retornamos
						return {
							status: false,
							msg: 'El número de registros por página debe ser mayor o igual a 1'
						};
					} else {
						// Retornamos
						return {
							status: true,
							size: pageSize
						};
					}
				} else {
					// Retornamos
					return {
						status: false,
						msg: 'El número de registros por página debe ser un número entero'
					};
				}
			} catch (error) {
				// Retornamos
				return {
					status: false,
					msg: 'El número de registros por página debe ser un número entero'
				};
			}
		} else {
			// Retornamos
			return {
				status: true,
				size: pageSize
			};
		}
	}
};

/*******************************************************************************************************/
// Función para obtener el número total del páginas //
/*******************************************************************************************************/
export const getTotalPages = (total: number, size: number): number => {
	// Definimos el número total de páginas
	let totalPaginas: number;

	// Obtenemos el entero de la división del total y el tamaño
	const entero: number = ~~(total / size);
	// Obtenemos el residuo de la división del total y el tamaño
	const residuo: number = total % size;

	// Si el entero el mayor que cero
	if (entero > 0) {
		// Si el residuo es mayor que cero
		if (residuo > 0) {
			totalPaginas = entero + 1;
		} else {
			totalPaginas = entero;
		}
	} else {
		totalPaginas = 1;
	}

	// Retornamos
	return totalPaginas;
};

/*******************************************************************************************************/
// Función para obtener el número de página, con sus respectivas validaciones //
/*******************************************************************************************************/
export const getPage = async (defaultValue: number, valuePage: any, total: number) => {
	// Definimos el número de página por defecto
	let page: number = defaultValue;

	// Si el valor es indefinido (que no se mando en el request)
	if (valuePage === undefined) {
		// Retornamos
		return {
			status: true,
			page
		};
	} else {
		// Si viene en el query, hacemos las validaciones
		if (typeof valuePage === 'string') {
			try {
				// Intentamos convertir el string a número
				page = Number(valuePage);

				// Si el número de página es entero
				if (Number.isInteger(page)) {
					if (page < 1 || page > total) {
						// Retornamos
						return {
							status: false,
							msg: `El número de página debe ser un número entero entre 1 a ${total}`
						};
					} else {
						// Retornamos
						return {
							status: true,
							page
						};
					}
				} else {
					// Retornamos
					return {
						status: false,
						msg: 'El número de página debe ser un número entero'
					};
				}
			} catch (error) {
				// Retornamos
				return {
					status: false,
					msg: 'El número de página debe ser un número entero'
				};
			}
		} else {
			// Retornamos
			return {
				status: true,
				page
			};
		}
	}
};
