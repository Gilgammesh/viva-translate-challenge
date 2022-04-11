/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import authReducer, { IAuthReducer } from './reducers/authReducer';
import cuestionarioReducer, { ICuestionarioReducer } from './reducers/cuestionarioReducer';
import preguntaReducer, { IPreguntaReducer } from './reducers/preguntaReducer';

/*******************************************************************************************************/
// Interface de los reducers //
/*******************************************************************************************************/
export interface IRootReducers {
	auth: IAuthReducer;
	cuestionario: ICuestionarioReducer;
	pregunta: IPreguntaReducer;
}

/*******************************************************************************************************/
// Combinamos los reducers de la App //
/*******************************************************************************************************/
const reducers = combineReducers({
	auth: authReducer,
	cuestionario: cuestionarioReducer,
	pregunta: preguntaReducer
});

/*******************************************************************************************************/
// Cargamos la extensión de Redux para el navegador //
/*******************************************************************************************************/
const composeEnhancers =
	(typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

/*******************************************************************************************************/
// Aplicamos el Middleware Redux-Thunk, para el manejo de las peticiones asíncronas (Api's) //
/*******************************************************************************************************/
const enhancer = composeEnhancers(applyMiddleware(thunk));

/*******************************************************************************************************/
// Creamos el Store de nuestra App //
/*******************************************************************************************************/
const store = createStore(reducers, enhancer);

/*******************************************************************************************************/
// Exportamos el store //
/*******************************************************************************************************/
export default store;
