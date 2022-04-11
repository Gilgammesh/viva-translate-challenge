/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SignInView from 'views/public/SignInView';
import SignUpView from 'views/public/SignUpView';
import CuestionariosView from 'views/private/CuestionariosView';
import CuestionariosNewView from 'views/private/CuestionariosView/CuestionariosNew';
import CuestionariosEditView from 'views/private/CuestionariosView/CuestionariosEdit';
import PreguntassView from 'views/private/PreguntassView';
import PreguntassNewView from 'views/private/PreguntassView/PreguntasNew';
import PreguntassEditView from 'views/private/PreguntassView/PreguntasEdit';
import { IRootReducers } from '../redux/store';

/*******************************************************************************************************/
// Definimos las Rutas de la Aplicación //
/*******************************************************************************************************/
const AppRouter = () => {
	// Vemos si el usuario está logueado
	const { isLogged } = useSelector((state: IRootReducers) => state.auth.usuario);

	// Si está logueado
	if (isLogged === true) {
		// Renderizamos el componente
		return (
			<Routes>
				<Route path="/quiz/cuestionarios" element={<CuestionariosView />} />
				<Route path="/quiz/cuestionarios/nuevo" element={<CuestionariosNewView />} />
				<Route path="/quiz/cuestionarios/editar" element={<CuestionariosEditView />} />
				<Route path="/quiz/preguntas" element={<PreguntassView />} />
				<Route path="/quiz/preguntas/nuevo" element={<PreguntassNewView />} />
				<Route path="/quiz/preguntas/editar" element={<PreguntassEditView />} />
				<Route path="/" element={<CuestionariosView />} />
				<Route path="*" element={<Navigate to="/quiz/cuestionarios" replace />} />
			</Routes>
		);
	}
	// Si no está logueado
	if (isLogged === false) {
		// Renderizamos el componente
		return (
			<Routes>
				<Route path="/auth/inicio-sesion" element={<SignInView />} />
				<Route path="/auth/registro" element={<SignUpView />} />
				<Route path="/" element={<SignInView />} />
				<Route path="*" element={<Navigate to="/auth/inicio-sesion" replace />} />
			</Routes>
		);
	}

	// Si el estado de logueo es indefinido
	return <Routes></Routes>;
};

/*******************************************************************************************************/
// Exportamos el componente //
/*******************************************************************************************************/
export default AppRouter;
