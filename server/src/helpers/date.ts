/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
const moment = require('moment-timezone');
import { Moment } from 'moment-timezone';
import { timeZone } from '../configs';

/*******************************************************************************************************/
// Función para obtener el mensaje de la Fecha parseada del Token como un string //
/*******************************************************************************************************/
export const parseJwtDateExpire = (date: Date) => {
	// Casteamos la fecha
	const fecha: Moment = moment(date).tz(timeZone);
	const dayNro: string = fecha.format('DD');
	const monthName: string = fecha.format('MMMM');
	const year: string = fecha.format('YYYY');
	const fecha_: string = `${dayNro} de ${monthName} de ${year}`;
	const hora: string = fecha.format('hh:mm:ss a');
	const fechaExpire: string = `El token proporcionado ha expirado el ${fecha_} a las ${hora}`;
	// Retornamos
	return fechaExpire;
};
