/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import store from 'redux/store';
import Auth from 'components/Auth';
import AppRouter from 'router/AppRouter';
import { esES } from '@material-ui/core/locale';

/*******************************************************************************************************/
// Definimos el componente //
/*******************************************************************************************************/
const App = () => {
	// Definimos el tema de la aplicación pasandole el locale españól
	const theme = createTheme(esES);

	// Renderizamos
	return (
		<ThemeProvider theme={theme}>
			<Provider store={store}>
				<BrowserRouter>
					<Auth>
						<AppRouter />
					</Auth>
				</BrowserRouter>
			</Provider>
		</ThemeProvider>
	);
};

/*******************************************************************************************************/
// Exportamos el componente //
/*******************************************************************************************************/
export default App;
