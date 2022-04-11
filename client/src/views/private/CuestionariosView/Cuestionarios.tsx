import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';
import { green } from '@material-ui/core/colors';
import Layout from 'components/Layout';
import _ from 'lodash';
import { fetchData } from 'services/fetch';
import { Swal, Toast } from 'configs/settings';
import { validateFetchData } from 'helpers/validateFetchData';
import { startSetCuestionario } from 'redux/actions/cuestionario';
import JugarView from 'views/private/JugarView';

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
interface IData {
	_id: string;
	nombre: string;
	descripcion?: string;
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
		id: 'descripcion',
		align: 'left',
		disablePadding: false,
		label: 'Descripción',
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
// Definimos el componente Cuesionarios //
/*******************************************************************************************************/
const Cuestionarios = () => {
	// Lamamos al dispatch de redux
	const dispatch = useDispatch();

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

	// Estado de apertura del Modal Jugar
	const [openMod, setOpenMod] = useState(false);

	// Efecto para obtener las lista de cuestionarios
	useEffect(() => {
		// Estado inicial de montaje
		let mounted = true;
		// Función para obtener los cuestionarios
		const getCuestionarios = async () => {
			// Iniciamos carga de la tabla
			setLoading(true);
			const result = await fetchData(`quiz/cuestionarios?page=${page + 1}&pageSize=${rowsPerPage}`);
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
		// Obtenemos los cuestionarios
		getCuestionarios();
		// Limpiamos el montaje
		return () => {
			mounted = false;
		};
	}, [estado, page, rowsPerPage]);

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

	// Función para abrir el Modal Jugar
	const handleOpenMod = (row: IData) => {
		dispatch(startSetCuestionario(row));
		setOpenMod(true);
	};

	// Función para remover un cuestionario
	const handleRemoveRow = (id: string) => {
		Swal.fire({
			title: '¿Está seguro que quiere eliminar el cuestionario?',
			showConfirmButton: true,
			showDenyButton: true,
			confirmButtonText: `SI`,
			denyButtonText: `NO`
		}).then(async result => {
			if (result.isConfirmed) {
				// Eliminamos el rol
				const result = await fetchData(`quiz/cuestionarios/${id}`, 'DELETE');
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
				<div className={classes.button}>
					<Link to={'/quiz/cuestionarios/nuevo'}>
						<ColorButton variant="contained" color="primary" endIcon={<AddIcon />}>
							Crear Cuestionario
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
								{_.orderBy(data, [order.id], [order.direction]).map(
									(row: IData | any, index: number) => {
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
												<TableCell
													className={classes.rowBodyCell}
													component="td"
													scope="row"
													align="justify"
												>
													{row.descripcion}
												</TableCell>
												<TableCell
													className={classes.rowBodyCell}
													component="td"
													scope="row"
													align="center"
													width={240}
													height={48}
												>
													<Tooltip title="Jugar" placement="bottom-start" enterDelay={100}>
														<IconButton
															style={{ color: green[600] }}
															aria-label="jugar a cuestionario"
															onClick={() => handleOpenMod(row)}
														>
															<PlayArrowIcon />
														</IconButton>
													</Tooltip>
													<Link to={'/quiz/preguntas'}>
														<Tooltip
															title="Preguntas"
															placement="bottom-start"
															enterDelay={100}
														>
															<IconButton
																color="primary"
																aria-label="preguntas de cuestionario"
																onClick={() => dispatch(startSetCuestionario(row))}
															>
																<LiveHelpIcon />
															</IconButton>
														</Tooltip>
													</Link>
													<Link to={'/quiz/cuestionarios/editar'}>
														<Tooltip
															title="Editar"
															placement="bottom-start"
															enterDelay={100}
														>
															<IconButton
																style={{ color: '#6F6F6F' }}
																aria-label="editar cuestionario"
																onClick={() => dispatch(startSetCuestionario(row))}
															>
																<EditIcon />
															</IconButton>
														</Tooltip>
													</Link>
													<Tooltip title="Elimnar" placement="bottom-start" enterDelay={100}>
														<IconButton
															style={{ color: '#F44343' }}
															aria-label="eliminar cuestionario"
															onClick={() => handleRemoveRow(row._id)}
														>
															<DeleteIcon />
														</IconButton>
													</Tooltip>
												</TableCell>
											</TableRow>
										);
									}
								)}
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
				{openMod && <JugarView open={openMod} setOpen={setOpenMod} />}
			</Grid>
		</Layout>
	);
};

/*******************************************************************************************************/
// Exportamos el componente //
/*******************************************************************************************************/
export default Cuestionarios;
