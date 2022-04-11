/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { blue, green } from '@material-ui/core/colors';
import Layout from 'components/Layout';
import useForm from 'hooks/useForm';
import { fetchData } from 'services/fetch';
import { validateFetchData } from 'helpers/validateFetchData';
import { Swal, Toast } from 'configs/settings';
import { useSelector } from 'react-redux';
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
	subtitle: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10
	},
	typography: {
		margin: theme.spacing(1, 0, 1)
	},
	submit: {
		margin: theme.spacing(1, 0, 1)
	},
	rowHeader: {
		height: 32
	},
	rowHeaderCell: {
		fontWeight: 'bold',
		backgroundColor: '#D7D7D7'
	},
	rowBody: {
		height: 40
	},
	rowBodyCell: {
		paddingTop: 2,
		paddingBottom: 2
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
// Checkbox personalizado //
/*******************************************************************************************************/
const GreenCheckbox = withStyles({
	root: {
		color: green[400],
		'&$checked': {
			color: green[600]
		}
	},
	checked: {}
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

/*******************************************************************************************************/
// Interfaces del componente //
/*******************************************************************************************************/
interface IOpcion {
	opcion: string;
	isValid: boolean;
}

/*******************************************************************************************************/
// Definimos el componente Cuesionarios - Preguntas - Nuevo //
/*******************************************************************************************************/
const PreguntasNew = () => {
	// Instanciamos la navegación
	let navigate = useNavigate();

	// Obtenemos los datos del cuestionario
	const cuestionario = useSelector((state: IRootReducers) => state.cuestionario);

	// Obtenemos los datos de la pregunta
	const pregunta = useSelector((state: IRootReducers) => state.pregunta);

	// Instanciamos las clases para ls estilos
	const classes = useStyles();

	// Variables de mínimos y máximos para la lista de opciones
	const minRows: number = 2;
	const maxRows: number = 10;

	// Estado imicial de la data de opciones
	const [opciones, setOpciones] = useState<IOpcion[]>([
		{
			opcion: '',
			isValid: false
		},
		{
			opcion: '',
			isValid: false
		}
	]);

	// Estado para habilitar el botón de agregar opción
	const [disableAdd, setDisableAdd] = useState<boolean>(false);

	// Estado que indicado que index de la opcíon se ha marcado como correcta
	const [idx, setIdx] = useState<number | null>(null);

	// Usamos el Hook personalizado de formularios
	const [formValues, handleInputChange] = useForm({
		nombre: ''
	});
	const { nombre } = formValues;

	// Efecto para habilitar o deshabilitar agregar nueva opción
	useEffect(() => {
		// Si no existe un cuestionario
		if (cuestionario === null && pregunta === null) {
			// Redireccionamos a cuestionarios
			navigate('/quiz/cuestionarios');
		}
		if (opciones.length === maxRows) {
			setDisableAdd(true);
		} else {
			setDisableAdd(false);
		}
	}, [navigate, cuestionario, pregunta, opciones]);

	// Función para validar previamente el formulario de envio de pregunta y opciones
	const validateOpciones = async () => {
		if (opciones.length < minRows) {
			Swal.fire({
				title: `Debe haber un mínimo de ${minRows} opciones`,
				icon: 'error'
			});
			return false;
		}
		let indexMap: number[] = [];
		const promises = opciones.map((ele, index) => {
			if (ele.opcion === '') {
				indexMap.push(index + 1);
			}
			return null;
		});
		await Promise.all(promises);
		if (indexMap.length > 0) {
			if (indexMap.length === 1) {
				Swal.fire({
					title: `La opción ${indexMap[0]}, no puede estar vacia`,
					icon: 'error'
				});
				return false;
			} else {
				Swal.fire({
					title: `Las opciones ${indexMap.join(', ')}; no pueden estar vacias`,
					icon: 'error'
				});
				return false;
			}
		}
		if (idx === null) {
			Swal.fire({
				title: `Debe marcar una opción que sea correcta!!`,
				icon: 'error'
			});
			return false;
		}
		return true;
	};

	// Función para enviar el formulario
	const onSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
		event.preventDefault();
		// Si pasa la validaciones
		if (await validateOpciones()) {
			// Guardamos los datos de la pregunta y sus opciones
			const result = await fetchData('quiz/preguntas', 'POST', {
				...formValues,
				opciones,
				cuestionario: cuestionario._id
			});
			// Validamos el resultado de la petición
			if (validateFetchData(result)) {
				if (result.data) {
					// Avisamos con un toast alert
					Toast.fire({
						icon: 'success',
						title: result.data.msg
					});
					// Redireccionamos a preguntas
					navigate('/quiz/preguntas');
				}
			}
		}
	};

	// Función para añadir una opción
	const addOpcion = () => {
		setOpciones([
			...opciones,
			{
				opcion: '',
				isValid: false
			}
		]);
	};

	// Función para remover una opción
	const removeOpcion = (i: number) => {
		let opciones_ = opciones.slice();
		opciones_.splice(i, 1);
		setOpciones(opciones_);
		if (idx === i) {
			setIdx(null);
		}
	};

	// Función para cambiar el valor de los inputs de nombres de opciones
	const handleInputChangeOpciones = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, i: number) => {
		let opciones_ = opciones.slice();
		opciones_[i] = { opcion: event.target.value, isValid: opciones_[i].isValid };
		setOpciones(opciones_);
	};

	// Función para cambiar el estado de los checkbox de las opciones
	const handleCheckChangeOpciones = (event: ChangeEvent<HTMLInputElement>, i: number) => {
		let opciones_ = opciones.slice();
		opciones_[i] = { opcion: opciones_[i].opcion, isValid: event.target.checked };
		if (event.target.checked && idx !== null && idx !== i) {
			opciones_[idx] = { opcion: opciones_[idx].opcion, isValid: false };
		}
		setOpciones(opciones_);
		if (event.target.checked) {
			setIdx(i);
		} else {
			setIdx(null);
		}
	};

	// Renderizamos
	return (
		<Layout>
			<form onSubmit={onSubmit}>
				<Grid container spacing={2}>
					<Grid item xs={12} className={classes.title}>
						<Link to={'/quiz/preguntas'}>
							<Tooltip title="Regresar" placement="bottom-start" enterDelay={100}>
								<IconButton style={{ color: '#6F6F6F' }} aria-label="regresa a preguntas">
									<ChevronLeftIcon />
								</IconButton>
							</Tooltip>
						</Link>
						<Typography className={classes.typography} variant="h5">
							Crear Nueva Pregunta
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<TextField
							type="text"
							variant="outlined"
							margin="normal"
							multiline={true}
							required
							fullWidth
							name="nombre"
							label="Nombre"
							value={nombre}
							onChange={handleInputChange}
							autoFocus
						/>
					</Grid>
					<Grid item xs={12}>
						<Grid item xs={12} className={classes.subtitle}>
							<Typography className={classes.typography} variant="h5">
								Lista de Opciones
							</Typography>
							<Tooltip title="Agrear" placement="bottom-start" enterDelay={100}>
								<IconButton
									style={{ color: green[500] }}
									aria-label="agregar opcion"
									onClick={addOpcion}
									disabled={disableAdd}
								>
									<AddCircleIcon fontSize="large" />
								</IconButton>
							</Tooltip>
						</Grid>
						<Table stickyHeader aria-labelledby="cuestionarios">
							<TableHead>
								<TableRow className={classes.rowHeader}>
									<TableCell
										width={60}
										align="center"
										padding="normal"
										className={classes.rowHeaderCell}
									>
										#
									</TableCell>
									<TableCell align="left" padding="normal" className={classes.rowHeaderCell}>
										Opción
									</TableCell>
									<TableCell
										width={140}
										align="center"
										padding="normal"
										className={classes.rowHeaderCell}
									>
										¿Es correcta?
									</TableCell>
									<TableCell
										width={90}
										align="center"
										padding="normal"
										className={classes.rowHeaderCell}
									>
										Remover
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{opciones.map((row: any, index) => {
									return (
										<TableRow className={classes.rowBody} hover tabIndex={-1} key={index}>
											<TableCell
												className={classes.rowBodyCell}
												component="td"
												scope="row"
												align="center"
											>
												{index + 1}
											</TableCell>
											<TableCell className={classes.rowBodyCell} component="td" scope="row">
												<TextField
													type="text"
													variant="outlined"
													margin="normal"
													multiline={true}
													maxRows={2}
													placeholder={`Ingrese opcion ${index + 1}`}
													value={row.opcion}
													fullWidth
													onChange={evt => handleInputChangeOpciones(evt, index)}
												/>
											</TableCell>
											<TableCell
												className={classes.rowBodyCell}
												component="td"
												scope="row"
												align="center"
											>
												<GreenCheckbox
													checked={row.isValid}
													onChange={evt => handleCheckChangeOpciones(evt, index)}
												/>
											</TableCell>
											<TableCell
												className={classes.rowBodyCell}
												component="td"
												scope="row"
												align="center"
												height={40}
											>
												<IconButton
													style={{ color: '#F44343' }}
													aria-label="eliminar opcion"
													onClick={() => removeOpcion(index)}
												>
													<CancelIcon />
												</IconButton>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
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
export default PreguntasNew;
