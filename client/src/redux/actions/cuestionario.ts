/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import types from 'configs/types';
import { Dispatch } from 'redux';
import { ICuestionarioReducer } from 'redux/reducers/cuestionarioReducer';
import { cleanPregunta } from './pregunta';

/*******************************************************************************************************/
// Función para iniciar establecer el cuestionario //
/*******************************************************************************************************/
export const startSetCuestionario = (cuestionario: any) => {
	return (dispatch: Dispatch) => {
		dispatch(cleanPregunta());
		dispatch(cleanCuestionario());
		delete cuestionario.usuario;
		dispatch(setCuestionario(cuestionario));
	};
};

/*******************************************************************************************************/
// Función para iniciar limpiar el cuestionario //
/*******************************************************************************************************/
export const starCleanCuestionario = () => {
	return (dispatch: Dispatch) => {
		dispatch(cleanCuestionario());
	};
};

/*******************************************************************************************************/
// Acción para establecer el cuestionario //
/*******************************************************************************************************/
export const setCuestionario = (cuestionario: ICuestionarioReducer) => {
	return {
		type: types.setCuestionario,
		payload: cuestionario
	};
};

/*******************************************************************************************************/
// Accion para limpiar el cuestionario //
/*******************************************************************************************************/
export const cleanCuestionario = () => {
	return {
		type: types.cleanCuestionario
	};
};
