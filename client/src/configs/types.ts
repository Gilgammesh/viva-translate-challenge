/*******************************************************************************************************/
// Interface de los Tipos //
/*******************************************************************************************************/
export interface ITypes {
	setAuth: string;
	login: string;
	logout: string;
	setCuestionario: string;
	cleanCuestionario: string;
	setPregunta: string;
	cleanPregunta: string;
}

/*******************************************************************************************************/
// Definimos los tipos de acciones para los reducers de la aplicación //
/*******************************************************************************************************/
const types: ITypes = {
	setAuth: '[auth] set',
	login: '[auth] login',
	logout: '[auth] logout',
	setCuestionario: '[cuestionario] set',
	cleanCuestionario: '[cuestionario] clean',
	setPregunta: '[pregunta] set',
	cleanPregunta: '[pregunta] clean'
};

/*******************************************************************************************************/
// Exportamos los tipos //
/*******************************************************************************************************/
export default types;
