/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import { store_token } from 'configs/settings';

/*****************************************************************************************/
// Función para guardar token de autorización en LocalStorage del Navegador //
/*****************************************************************************************/
export const setToken = (token: string) => {
	localStorage.setItem(store_token, token);
};

/*****************************************************************************************/
// Función para obtener el token de autorización en LocalStorage del Navegador //
/*****************************************************************************************/
export const getToken = (): string => {
	return localStorage.getItem(store_token) || '';
};

/*****************************************************************************************/
// Función para eliminar el token de autorización en LocalStorage del Navegador //
/*****************************************************************************************/
export const deleteToken = () => {
	localStorage.removeItem(store_token);
};
