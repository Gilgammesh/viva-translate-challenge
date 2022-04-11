/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import { Router } from 'express';
import { validarToken } from '../middlewares/authentication';
import * as cuestionario from '../controllers/quiz/cuestionario.controller';
import * as pregunta from '../controllers/quiz/pregunta.controller';

/*******************************************************************************************************/
// Instanciamos router //
/*******************************************************************************************************/
const router: Router = Router();

/*******************************************************************************************************/
// Definimos las rutas //
/*******************************************************************************************************/
// Cuestionarios
router.get('/cuestionarios', validarToken, cuestionario.getAll);
router.post('/cuestionarios', validarToken, cuestionario.create);
router.get('/cuestionarios/:id', validarToken, cuestionario.get);
router.put('/cuestionarios/:id', validarToken, cuestionario.update);
router.delete('/cuestionarios/:id', validarToken, cuestionario.remove);

// Preguntas
router.get('/preguntas', validarToken, pregunta.getAll);
router.post('/preguntas', validarToken, pregunta.create);
router.get('/preguntas/:id', validarToken, pregunta.get);
router.put('/preguntas/:id', validarToken, pregunta.update);
router.delete('/preguntas/:id', validarToken, pregunta.remove);

/*******************************************************************************************************/
// Exportamos las rutas definidas en router por defecto //
/*******************************************************************************************************/
export default router;
