import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { green, red } from '@material-ui/core/colors';
import Layout from 'components/Layout';
import _ from 'lodash';
import { fetchData } from 'services/fetch';
import { Swal, Toast } from 'configs/settings';
import { validateFetchData } from 'helpers/validateFetchData';
import { IRootReducers } from 'redux/store';
import { startSetPregunta } from '../../../redux/actions/pregunta';

/*******************************************************************************************************/
// Definimos los estilos del componente //
/*******************************************************************************************************/
const useStyles = makeStyles(theme => ({
	container: {
		overflowY: 'auto'
	},
	rowHeader: {
		height: 32
	},
	rowHeaderCell: {
		fontWeight: 'bold',
		backgroundColor: '#D7D7D7'
	},
	rowBodyCell: {
		paddingTop: 2,
		paddingBottom: 2
	},
	button: {
		marginTop: 10,
		marginBottom: 15
	},
	pagination: {
		overflow: 'hidden',
		flexShrink: 0
	},
	progress: {
		paddingTop: 40,
		paddingBottom: 40,
		paddingLeft: 10,
		paddingRight: 10
	},
	title: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	typography: {
		margin: theme.spacing(1, 0, 1)
	}
}));

/*******************************************************************************************************/
// Botón personalizado //
/*******************************************************************************************************/
const ColorButton = withStyles((theme: Theme) => ({
	root: {
		color: theme.palette.getContrastText(green[700]),
		backgroundColor: green[700],
		'&:hover': {
			backgroundColor: green[800]
		}
	}
}))(Button);

/*******************************************************************************************************/
// Interfaces del componente //
/*******************************************************************************************************/
interface IOrder {
	direction: any;
	id: any;
}
interface IHeader {
	id: string;
	align: any;
	disablePadding: boolean;
	label: string;
	sort: boolean;
}
interface IOption {
	opcion: string;
	isValid: boolean;
}
interface IData {
	nombre: string;
	opciones: IOption[];
}

/*******************************************************************************************************/
// Columnas cabecera de la Tabla //
/*******************************************************************************************************/
const headers: IHeader[] = [
	{
		id: 'id',
		align: 'center',
		disablePadding: false,
		label: '#',
		sort: false
	},
	{
		id: 'nombre',
		align: 'left',
		disablePadding: false,
		label: 'Nombre',
		sort: true
	},
	{
		id: 'opciones',
		align: 'left',
		disablePadding: false,
		label: 'Opciones',
		sort: false
	},
	{
		id: 'botones',
		align: 'center',
		disablePadding: false,
		label: 'Acciones',
		sort: false
	}
];

/*******************************************************************************************************/
// Definimos el componente Cuesionarios - Preguntas //
/*******************************************************************************************************/
const Preguntas = () => {
	// Instanciamos la navegación
	let navigate = useNavigate();

	// Lamamos al dispatch de redux
	const dispatch = useDispatch();

	// Obtenemos los datos del cuestionario
	const cuestionario = useSelector((state: IRootReducers) => state.cuestionario);

	// Instanciamos las clases para ls estilos
	const classes = useStyles();

	// Datos de la tabla
	const [data, setData] = useState<IData | null>(null);

	// Estado de cambio de la data
	const [estado, setEstado] = useState<string>('');

	// Estado de carga de la tabla
	const [loading, setLoading] = useState<boolean>(false);

	// Estado para definir el número de página de la tabla
	const [page, setPage] = useState<number>(0);
	// Estado para definir el número de filas por página
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	// Total de registros de la tablas
	const [totalReg, setTotalReg] = useState<number>(0);

	// Estado inicial del ordenamiento de una columna
	const [order, setOrder] = useState<IOrder>({
		direction: 'asc',
		id: null
	});

	// Efecto para obtener la lista de preguntas de un cuestionario
	useEffect(() => {
		// Si no existe un cuestionario
		if (cuestionario === null) {
			// Redireccionamos a cuestionarios
			navigate('/quiz/cuestionarios');
		}
		// Estado inicial de montaje
		let mounted = true;
		// Función para obtener las preguntas
		const getPreguntas = async () => {
			// Iniciamos carga de la tabla
			setLoading(true);
			const result = await fetchData(
				`quiz/preguntas?cuestionario=${cuestionario._id}&page=${page + 1}&pageSize=${rowsPerPage}`
			);
			// Si existe un resultado y el status es positivo
			if (result && mounted && result.data?.status) {
				// Actualizamos el total de registros de la lista
				setTotalReg(result.data.totalRegistros);
				// Actualizamos la lista en la data local
				setData(result.data.list);
			}
			// Finalizamos carga de la tabla
			setLoading(false);
		};
		// Si existe un cuestionario
		if (cuestionario) {
			// Obtenemos las preguntas
			getPreguntas();
		}
		// Limpiamos el montaje
		return () => {
			mounted = false;
		};
	}, [navigate, cuestionario, estado, page, rowsPerPage]);

	// Función para ordenar una columna
	const handleRequestSort = (property: any) => {
		// Inicializamos la dirección
		let direction = 'desc';
		// Si la direccón es desc cambiamos
		if (order.id === property && order.direction === 'desc') {
			direction = 'asc';
		}
		// Establecemos el estado de la columna ordenada
		setOrder({
			direction,
			id: property
		});
	};

	// Función para cambiar la página de la tabla
	const handleChangePage = (value: any) => {
		// Guardamos el número de página
		setPage(value);
	};

	// Función para cambiar el número de fila de una página
	const handleChangeRowsPerPage = (evt: any) => {
		// Reiniciamos a la página inicial
		setPage(0);
		// Guardamos el número de registro por página
		setRowsPerPage(evt.target.value);
	};

	// Función para remover un cuestionario
	const handleRemoveRow = (id: string) => {
		Swal.fire({
			title: '¿Está seguro que quiere eliminar la pregunta?',
			showConfirmButton: true,
			showDenyButton: true,
			confirmButtonText: `SI`,
			denyButtonText: `NO`
		}).then(async result => {
			if (result.isConfirmed) {
				// Eliminamos el rol
				const result = await fetchData(`quiz/preguntas/${id}`, 'DELETE');
				// Validamos el resultado
				if (validateFetchData(result)) {
					// Cambiamos el estado de cambio de la data
					setEstado(`${new Date()}`);
					// Avisamos con un toast alert
					Toast.fire({
						icon: 'success',
						title: result.data?.msg
					});
				}
			}
		});
	};

	return (
		<Layout>
			<Grid>
				<Grid item xs={12} className={classes.title}>
					<Link to={'/quiz/cuestionarios'}>
						<Tooltip title="Regresar" placement="bottom-start" enterDelay={100}>
							<IconButton style={{ color: '#6F6F6F' }} aria-label="editar cuestionario">
								<ChevronLeftIcon />
							</IconButton>
						</Tooltip>
					</Link>
					<Typography className={classes.typography} variant="h5">
						Detalle de Cuestionario
					</Typography>
				</Grid>
				<Grid container spacing={2}>
					<Grid item xs={12} md={4}>
						<TextField
							type="text"
							variant="outlined"
							margin="normal"
							fullWidth
							label="Nombre"
							value={!loading && data ? cuestionario.nombre : ''}
							inputProps={{ readOnly: true }}
						/>
					</Grid>
					<Grid item xs={12} md={8}>
						<TextField
							type="text"
							variant="outlined"
							margin="normal"
							fullWidth
							label="Descripción"
							value={!loading && data ? cuestionario.descripcion : ''}
							inputProps={{ readOnly: true }}
						/>
					</Grid>
				</Grid>
				<br />
				<Typography className={classes.typography} variant="h5">
					Lista de Preguntas
				</Typography>
				<div className={classes.button}>
					<Link to={'/quiz/preguntas/nuevo'}>
						<ColorButton variant="contained" color="primary" endIcon={<AddIcon />}>
							Agregar Pregunta
						</ColorButton>
					</Link>
				</div>
				<Paper elevation={2}>
					<Table stickyHeader aria-labelledby="cuestionarios">
						<TableHead>
							<TableRow className={classes.rowHeader}>
								{headers.map((col: IHeader) => {
									return (
										<TableCell
											key={col.id}
											align={col.align}
											padding={col.disablePadding ? 'none' : 'normal'}
											className={classes.rowHeaderCell}
											sortDirection={order.id === col.id ? order.direction : false}
										>
											{col.sort ? (
												<TableSortLabel
													active={order.id === col.id}
													direction={order.direction}
													onClick={() => handleRequestSort(col.id)}
												>
													{col.label}
												</TableSortLabel>
											) : (
												col.label
											)}
										</TableCell>
									);
								}, this)}
							</TableRow>
						</TableHead>
						{!loading && data && (
							<TableBody>
								{_.orderBy(data, [order.id], [order.direction]).map((row: any, index) => {
									return (
										<TableRow hover tabIndex={-1} key={index}>
											<TableCell
												className={classes.rowBodyCell}
												component="td"
												scope="row"
												align="center"
											>
												{index + 1 + page * rowsPerPage}
											</TableCell>
											<TableCell className={classes.rowBodyCell} component="td" scope="row">
												{row.nombre}
											</TableCell>
											<TableCell className={classes.rowBodyCell} component="td" scope="row">
												<List dense={true}>
													{row.opciones.map((ele: any) => {
														return (
															<ListItem key={ele._id}>
																<ListItemIcon>
																	{ele.isValid ? (
																		<CheckIcon style={{ color: green[500] }} />
																	) : (
																		<CloseIcon style={{ color: red[500] }} />
																	)}
																</ListItemIcon>
																<ListItemText primary={ele.opcion} />
															</ListItem>
														);
													})}
												</List>
											</TableCell>
											<TableCell
												className={classes.rowBodyCell}
												component="td"
												scope="row"
												align="center"
												width={240}
												height={48}
											>
												<Link to={'/quiz/preguntas/editar'}>
													<Tooltip title="Editar" placement="bottom-start" enterDelay={100}>
														<IconButton
															style={{ color: '#6F6F6F' }}
															aria-label="editar pregunta"
															onClick={() => dispatch(startSetPregunta(row))}
														>
															<EditIcon />
														</IconButton>
													</Tooltip>
												</Link>
												<Tooltip title="Elimnar" placement="bottom-start" enterDelay={100}>
													<IconButton
														style={{ color: '#F44343' }}
														aria-label="eliminar pregunta"
														onClick={() => handleRemoveRow(row._id)}
													>
														<DeleteIcon />
													</IconButton>
												</Tooltip>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						)}
					</Table>
					{loading && (
						<div className={classes.progress}>
							<LinearProgress />
						</div>
					)}
				</Paper>
				{data && (
					<TablePagination
						className={classes.pagination}
						component="div"
						count={totalReg}
						rowsPerPage={rowsPerPage}
						page={page}
						backIconButtonProps={{
							'aria-label': 'Previous Page'
						}}
						nextIconButtonProps={{
							'aria-label': 'Next Page'
						}}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				)}
			</Grid>
		</Layout>
	);
};

/*******************************************************************************************************/
// Exportamos el componente //
/*******************************************************************************************************/
export default Preguntas;
