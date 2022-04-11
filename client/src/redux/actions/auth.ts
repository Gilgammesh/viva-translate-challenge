/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import types from 'configs/types';
import { deleteToken, setToken } from 'helpers/authToken';
import { Dispatch } from 'redux';

/*******************************************************************************************************/
// Función para iniciar el evento Establecer los datos de Autenticación //
/*******************************************************************************************************/
export const startSetAuth = (usuario: string) => {
	return (dispatch: Dispatch) => {
		// Establecemos los datos del usuario
		dispatch(setAuth(usuario));
	};
};

/*******************************************************************************************************/
// Función para el evento Iniciar Login //
/*******************************************************************************************************/
export const startLogin = (token: string, usuario: string) => {
	return (dispatch: Dispatch) => {
		// Establecemos el token
		setToken(token);
		// Establecemos los datos del usuario
		dispatch(login(token, usuario));
	};
};

/*******************************************************************************************************/
// Función para el evento Iniciar Logout //
/*******************************************************************************************************/
export const startLogout = () => {
	return (dispatch: Dispatch) => {
		// Eliminamos el token
		deleteToken();
		// Eliminamos los datos del usuario
		dispatch(logout());
	};
};

/*******************************************************************************************************/
// Acción para el evento Establecer los datos de Autenticación //
/*******************************************************************************************************/
export const setAuth = (usuario: string) => {
	return {
		type: types.setAuth,
		payload: usuario
	};
};

/*******************************************************************************************************/
// Accion para el evento login //
/*******************************************************************************************************/
export const login = (token: string, usuario: string) => {
	return {
		type: types.login,
		payload: { token, usuario }
	};
};

/*******************************************************************************************************/
// Accion para el evento logout //
/*******************************************************************************************************/
export const logout = () => {
	return {
		type: types.logout
	};
};
