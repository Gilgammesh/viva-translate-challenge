/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import { genSalt, hash } from 'bcryptjs';

/*******************************************************************************************************/
// Función para encriptar cualquier cadena de texto //
/*******************************************************************************************************/
const encrypt = async (text: string) => {
	try {
		// Número de veces que aplicamos el algoritmo de hash
		const n: number = 10;
		// Generamos el Salt con el número de veces de aplicación del algoritmo
		const salt: string = await genSalt(n);
		// Convertimos la cadena de texto a un código de texto encriptado
		const encrypted: string = await hash(text, salt);
		return encrypted;
	} catch (error) {
		console.log(error);
		return null;
	}
};

/*******************************************************************************************************/
// Exportamos la función encriptar por defecto //
/*******************************************************************************************************/
export default encrypt;
