/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import React, { ChangeEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { blue } from '@material-ui/core/colors';
import Layout from 'components/Layout';
import useForm from 'hooks/useForm';
import { fetchData } from 'services/fetch';
import { validateFetchData } from 'helpers/validateFetchData';
import { Toast } from 'configs/settings';
import { IRootReducers } from 'redux/store';

/*******************************************************************************************************/
// Definimos los estilos del componente //
/*******************************************************************************************************/
const useStyles = makeStyles(theme => ({
	title: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	typography: {
		margin: theme.spacing(1, 0, 1)
	},
	submit: {
		margin: theme.spacing(1, 0, 1)
	}
}));

/*******************************************************************************************************/
// Botón personalizado //
/*******************************************************************************************************/
const ColorButton = withStyles((theme: Theme) => ({
	root: {
		color: theme.palette.getContrastText(blue[700]),
		backgroundColor: blue[700],
		'&:hover': {
			backgroundColor: blue[800]
		}
	}
}))(Button);

/*******************************************************************************************************/
// Interfaces del Componente //
/*******************************************************************************************************/
interface IForm {
	nombre: string;
	descripcion: string;
}

/*******************************************************************************************************/
// Definimos el componente Cuesionarios - Editar //
/*******************************************************************************************************/
const CuestionariosEdit = () => {
	// Instanciamos la navegación
	let navigate = useNavigate();

	// Obtenemos los datos del cuestionario
	const cuestionario = useSelector((state: IRootReducers) => state.cuestionario);

	// Instanciamos las clases para ls estilos
	const classes = useStyles();

	// Formulario inicial
	const initialForm: IForm = {
		nombre: '',
		descripcion: ''
	};

	// Usamos el Hook personalizado de formularios
	const [formValues, handleInputChange, resetForm, setForm] = useForm(initialForm);
	const { nombre, descripcion } = formValues;

	// Efecto para obtener los datos del cuestionario
	useEffect(() => {
		// Si no existe un cuestionario
		if (cuestionario === null) {
			// Redireccionamos a cuestionarios
			navigate('/quiz/cuestionarios');
		}
		// Si existe un cuestionario
		if (cuestionario) {
			setForm({
				nombre: cuestionario.nombre,
				descripcion: cuestionario.descripcion
			});
		}
	}, [cuestionario, setForm, navigate]);

	// Función para enviar el formulario
	const onSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
		event.preventDefault();
		const result = await fetchData(`quiz/cuestionarios/${cuestionario._id}`, 'PUT', formValues);
		// Validamos el resultado de la petición
		if (validateFetchData(result)) {
			if (result.data) {
				// Reseteamos el formulario
				resetForm(initialForm);
				// Avisamos con un toast alert
				Toast.fire({
					icon: 'success',
					title: result.data.msg
				});
				// Redireccionamos a cuestionarios
				navigate('/quiz/cuestionarios');
			}
		}
	};

	// Renderizamos
	return (
		<Layout>
			<form onSubmit={onSubmit}>
				<Grid container spacing={2}>
					<Grid item xs={12} className={classes.title}>
						<Link to={'/quiz/cuestionarios'}>
							<Tooltip title="Regresar" placement="bottom-start" enterDelay={100}>
								<IconButton style={{ color: '#6F6F6F' }} aria-label="editar cuestionario">
									<ChevronLeftIcon />
								</IconButton>
							</Tooltip>
						</Link>
						<Typography className={classes.typography} variant="h5">
							Editar Cuestionario
						</Typography>
					</Grid>
					<Grid item xs={12} md={4}>
						<TextField
							type="text"
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="nombre"
							label="Nombre"
							value={nombre}
							onChange={handleInputChange}
							autoFocus
						/>
					</Grid>
					<Grid item xs={12} md={8}>
						<TextField
							type="text"
							variant="outlined"
							margin="normal"
							fullWidth
							name="descripcion"
							label="Descripción"
							value={descripcion}
							onChange={handleInputChange}
						/>
					</Grid>
					<Grid item xs={12} md={2}>
						<ColorButton
							className={classes.submit}
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							endIcon={<SaveIcon />}
						>
							Guardar
						</ColorButton>
					</Grid>
				</Grid>
			</form>
		</Layout>
	);
};

/*******************************************************************************************************/
// Exportamos el componente //
/*******************************************************************************************************/
export default CuestionariosEdit;
