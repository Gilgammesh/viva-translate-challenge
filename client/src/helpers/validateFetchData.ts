/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import { Swal } from 'configs/settings';
import { IResultFetch } from 'services/fetch';

/*******************************************************************************************************/
// Función para validar la data obtenida en la petición mediante FETCH //
/*******************************************************************************************************/
export const validateFetchData = ({ status, data, msg }: IResultFetch) => {
	// Si el estado es falso, muestra el mensaje de error
	if (!status) {
		Swal.fire({
			title: msg,
			icon: 'error'
		});
		return false;
	}
	// Si el estado es verdadero el estado de la data es falso, muestra el mensaje de error
	if (!data?.status) {
		Swal.fire({
			title: data?.msg,
			icon: 'error'
		});
		return false;
	}
	return true;
};
