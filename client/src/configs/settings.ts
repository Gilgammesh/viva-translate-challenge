/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import Swal2 from 'sweetalert2';

/*******************************************************************************************************/
// Definimos los ajustes de la aplicación //
/*******************************************************************************************************/
// Url Base de la API o endpoint de los servicios
export const apiBaseUrl: string = process.env.REACT_APP_API_URL || '';

// Nombre de la variable de LocalStorage
export const store_token: string = 'App-Quiz-token';

// Ancho del drawer layout
export const drawerWidth = 220;

// Configurción de los mensajes de alerta clásicos
export const Swal = Swal2.mixin({
	showConfirmButton: false,
	heightAuto: false,
	padding: '3em',
	width: 500,
	customClass: {
		confirmButton: 'btn-swal2',
		denyButton: 'btn-swal2'
	}
});

// Configuración de los mensajes de alerta tipo Toast
export const Toast = Swal2.mixin({
	toast: true,
	position: 'bottom-end',
	showConfirmButton: false,
	timer: 3000,
	timerProgressBar: true,
	background: '#43A047',
	iconColor: '#ffffff',
	customClass: {
		title: 'text-white'
	},
	didOpen: toast => {
		toast.addEventListener('mouseenter', Swal.stopTimer);
		toast.addEventListener('mouseleave', Swal.resumeTimer);
	}
});
