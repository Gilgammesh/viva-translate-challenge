/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import types from 'configs/types';
import { Dispatch } from 'redux';
import { IPreguntaReducer } from 'redux/reducers/preguntaReducer';

/*******************************************************************************************************/
// Función para iniciar establecer la pregunta //
/*******************************************************************************************************/
export const startSetPregunta = (pregunta: any) => {
	return (dispatch: Dispatch) => {
		dispatch(cleanPregunta());
		delete pregunta.cuestionario;
		dispatch(setPregunta(pregunta));
	};
};

/*******************************************************************************************************/
// Función para iniciar limpiar la pregunta //
/*******************************************************************************************************/
export const starCleanPregunta = () => {
	return (dispatch: Dispatch) => {
		dispatch(cleanPregunta());
	};
};

/*******************************************************************************************************/
// Acción para establecer la pregunta //
/*******************************************************************************************************/
export const setPregunta = (pregunta: IPreguntaReducer) => {
	return {
		type: types.setPregunta,
		payload: pregunta
	};
};

/*******************************************************************************************************/
// Accion para limpiar la pregunta //
/*******************************************************************************************************/
export const cleanPregunta = () => {
	return {
		type: types.cleanPregunta
	};
};
