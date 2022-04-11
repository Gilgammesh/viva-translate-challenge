/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import types from 'configs/types';
import { getToken } from 'helpers/authToken';

/*******************************************************************************************************/
// Interface de Action //
/*******************************************************************************************************/
interface IAction {
	type: string;
	payload: any;
}

/*******************************************************************************************************/
// Interface del Reducer //
/*******************************************************************************************************/
export interface IAuthReducer {
	token: string;
	usuario: {
		isLogged?: boolean;
		nombre?: string;
	};
}

/*******************************************************************************************************/
// Estado inicial del Reducer //
/*******************************************************************************************************/
const initialState: IAuthReducer = {
	token: getToken(),
	usuario: {}
};

/*******************************************************************************************************/
// Definimos el reducer y sus métodos //
/*******************************************************************************************************/
const authReducer = (state = initialState, { type, payload }: IAction) => {
	switch (type) {
		case types.setAuth:
			return {
				...state,
				usuario: { isLogged: true, nombre: payload }
			};
		case types.login:
			return {
				...state,
				token: payload.token,
				usuario: { isLogged: true, nombre: payload.usuario }
			};
		case types.logout:
			return {
				token: '',
				usuario: { isLogged: false }
			};
		default:
			return state;
	}
};

/*******************************************************************************************************/
// Exportamos el reducer //
/*******************************************************************************************************/
export default authReducer;
