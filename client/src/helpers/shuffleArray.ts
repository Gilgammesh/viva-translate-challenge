/*******************************************************************************************************/
// Función para ordenar un array de forma aleatoria //
/*******************************************************************************************************/
const shuffleArray = (array: any) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
};

/*******************************************************************************************************/
// Exportamos la función por defecto //
/*******************************************************************************************************/
export default shuffleArray;
