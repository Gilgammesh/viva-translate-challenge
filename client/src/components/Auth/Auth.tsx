/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import React, { useEffect, memo } from 'react';
import { useDispatch } from 'react-redux';
import { fetchData } from 'services/fetch';
import { startLogout, startSetAuth } from 'redux/actions/auth';
import { getToken } from 'helpers/authToken';

/*******************************************************************************************************/
// Interface de las propiedades del componente //
/*******************************************************************************************************/
interface IProps {
	children: React.ReactNode;
}

/*******************************************************************************************************/
// Definimos el componente de Authenticación de la aplicación //
/*******************************************************************************************************/
const Auth = (props: IProps) => {
	// Llamamos al dispatch de redux
	const dispatch = useDispatch();

	// Efecto para verificar la autenticación del usuario
	useEffect(() => {
		let mounted = true;

		const checkAuth = async () => {
			// Obtenemos el token del usuario en caso exista
			const token = getToken();
			// Si existe un token verificamos
			if (token && token !== '') {
				// Validamos el token en el servidor
				const result = await fetchData('auth/check', 'POST', { token });
				if (result && mounted && result.data) {
					if (result.data.status) {
						dispatch(startSetAuth(result.data.usuario));
					} else {
						dispatch(startLogout());
					}
				}
			} else {
				dispatch(startLogout());
			}
		};

		checkAuth();

		// Limpiamos el mounted
		return () => {
			mounted = false;
		};
	}, [dispatch]);

	// Renderizamos el componente y pasamos las propiedades a los hijos
	return <>{props.children}</>;
};

/*******************************************************************************************************/
// Exportamos el componente memorizado //
/*******************************************************************************************************/
export default memo(Auth);
