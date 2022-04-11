/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { createStyles, Theme, withStyles, WithStyles, makeStyles } from '@material-ui/core/styles';
import { blue, green, red } from '@material-ui/core/colors';
import { IRootReducers } from 'redux/store';
import { fetchData } from 'services/fetch';
import shuffleArray from 'helpers/shuffleArray';

/*******************************************************************************************************/
// Estilos del Titulo de Diálogo //
/*******************************************************************************************************/
const styles = (theme: Theme) =>
	createStyles({
		root: {
			margin: 0,
			padding: theme.spacing(3)
		},
		closeButton: {
			position: 'absolute',
			right: theme.spacing(2),
			top: theme.spacing(2),
			color: theme.palette.grey[500]
		}
	});

/*******************************************************************************************************/
// Interface de las propiedades del Titulo del Diálogo //
/*******************************************************************************************************/
interface DialogTitleProps extends WithStyles<typeof styles> {
	id: string;
	children: React.ReactNode;
	onClose: () => void;
}

/*******************************************************************************************************/
// Titulo del Dialogo personalizado //
/*******************************************************************************************************/
const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="h5">{children}</Typography>
			{onClose ? (
				<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

/*******************************************************************************************************/
// Botón personalizado - Azul //
/*******************************************************************************************************/
const BlueButton = withStyles((theme: Theme) => ({
	root: {
		color: theme.palette.getContrastText(blue[700]),
		backgroundColor: blue[700],
		'&:hover': {
			backgroundColor: blue[800]
		}
	}
}))(Button);

/*******************************************************************************************************/
// Botón personalizado - Verde //
/*******************************************************************************************************/
const GreenButton = withStyles((theme: Theme) => ({
	root: {
		color: theme.palette.getContrastText(green[700]),
		backgroundColor: green[700],
		'&:hover': {
			backgroundColor: green[800]
		}
	}
}))(Button);

/*******************************************************************************************************/
// Definimos los estilos del componente //
/*******************************************************************************************************/
const useStyles = makeStyles(theme => ({
	pregunta: {
		marginTop: 10,
		marginBottom: 15
	},
	actions: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: theme.spacing(3)
	},
	preguntas: {
		marginRight: 20
	},
	correcta: {
		fontWeight: 'bold',
		color: green[600]
	},
	incorrecta: {
		fontWeight: 'bold',
		color: red[600]
	}
}));

/*******************************************************************************************************/
// Interface de las propiedades del componente //
/*******************************************************************************************************/
interface IProps {
	open: boolean;
	setOpen: (value: boolean) => void;
}

/*******************************************************************************************************/
// Interfaces del componente //
/*******************************************************************************************************/
interface IOption {
	opcion: string;
	isValid: boolean;
}
interface IData {
	nombre: string;
	opciones: IOption[];
}

/*******************************************************************************************************/
// Enums del componente //
/*******************************************************************************************************/
enum PreguntaStage {
	RESPONDER = 'Responder',
	SIGUIENTE = 'Siguiente',
	FINALIZAR = 'Finalizar'
}

/*******************************************************************************************************/
// Definimos el componente Cuesionarios - Jugar //
/*******************************************************************************************************/
const Jugar = (props: IProps) => {
	// Obtenemos las propiedades del componente
	const { open, setOpen } = props;

	// Obtenemos los datos del cuestionario
	const cuestionario = useSelector((state: IRootReducers) => state.cuestionario);

	// Instanciamos las clases para ls estilos
	const classes = useStyles();

	// Estado de la data de preguntas y opciones del cuestionario
	const [data, setData] = useState<IData[] | null>(null);

	// Estado de los datos de la pregunta
	const [pregunta, setPregunta] = useState<IData | null>(null);

	// Estado de número de pregunta
	const [nroPreg, setNroPreg] = useState<number>(1);

	// Estado de la etapa de proceso de la pregunta
	const [stage, setStage] = useState<PreguntaStage>(PreguntaStage.RESPONDER);

	// Estado del index seleccionado de respuesta a las opciones
	const [idxResp, setIdxResp] = useState<number | null>(null);

	// Estado que indica si la respuesta elegida fue la correcta
	const [isCorrect, setIsCorrect] = useState<boolean>(false);

	// Estado para habilitar el botón de responder
	const [btnValid, setBtnValid] = useState<boolean>(false);

	// Estado de número de respuestas correctas
	const [nroCorrects, setNroCorrects] = useState<number>(0);

	// Efecto para obtener las preguntas del cuestionario
	useEffect(() => {
		// Estado inicial de montaje
		let mounted = true;
		// Función para obtener las preguntas
		const getPreguntas = async () => {
			const result = await fetchData(`quiz/preguntas?cuestionario=${cuestionario._id}&page=1&pageSize=100`);
			// Si existe un resultado y el status es positivo
			if (result && mounted && result.data?.status) {
				// Establecemo la lista ordenada aleatoriamente
				const list = shuffleArray(result.data.list);
				// Establecemos la data
				setData(list);
				// Establecemos los datos de la pregunta inicial
				setPregunta(list[0]);
			}
		};
		// Si existe un cuestionario
		if (open && cuestionario) {
			// Obtenemos las preguntas
			getPreguntas();
		}
		// Limpiamos el montaje
		return () => {
			mounted = false;
		};
	}, [open, cuestionario]);

	// Efecto para cambiar el estado del botón responder
	useEffect(() => {
		if (idxResp !== null) {
			setBtnValid(true);
		}
	}, [idxResp]);

	// Función para evitar cerrar el modal ante Escape o presionar el backdrop
	const handleCloseDialog = (event: any, reason: string) => {
		if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
			setOpen(false);
		}
	};

	// Función para cerrar el modal
	const handleClose = () => {
		setOpen(false);
	};

	// Función para establecer el index de la respuesta
	const handleChangeRespuesta = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIdxResp(parseInt(event.target.value, 10));
	};

	// Función para revisar la pregunta y comparar la respuesta
	const revisarPregunta = () => {
		// Recorremos las opciones de la pregunta
		pregunta?.opciones.map((ele, index) => {
			// Si la opcion es la correcta
			if (ele.isValid) {
				// Comparamos con el marcado por el usuario
				if (index === idxResp) {
					// Si coincide es correcta
					setIsCorrect(true);
					// Incrementamos las respuestas correctas
					setNroCorrects(prev => prev + 1);
				} else {
					// Caso contrario es incorrecta
					setIsCorrect(false);
				}
			}
			return null;
		});
		// Establecemos el nuevo estado de la pregunta
		setStage(PreguntaStage.SIGUIENTE);
	};

	// Función para revisar la pregunta y comparar la respuesta
	const siguientePregunta = () => {
		// Establecemos los datos de la siguiente pregunta
		setPregunta(data && data[nroPreg]);
		// Establecemos el número de la siguiente pregunta
		setNroPreg(prev => prev + 1);
		// Establecemos el nuevo estado de la pregunta
		setStage(PreguntaStage.RESPONDER);
		// Reseteamos el index de la respuesta del usuario
		setIdxResp(null);
		// Reseteamos el estado de validación de la respuesta del usuario
		setIsCorrect(false);
		// Deshabilitamos el botón para responder
		setBtnValid(false);
	};

	// Función para evaluar el cuestionario
	const evaluarCuestionario = () => {
		// Establecemos el nuevo estado de la pregunta
		setStage(PreguntaStage.FINALIZAR);
	};

	// Renderizamos el componente
	return (
		<Dialog
			fullWidth
			maxWidth="md"
			open={open}
			onClose={(event, reason) => handleCloseDialog(event, reason)}
			aria-labelledby="cuestionario-list"
		>
			<DialogTitle id="customized-dialog-title" onClose={handleClose}>
				{`QUIZ: ${cuestionario.nombre}`}
			</DialogTitle>
			<DialogContent dividers>
				{stage === PreguntaStage.FINALIZAR ? (
					<FormControl component="fieldset">
						<Typography variant="h5" className={classes.pregunta}>
							{`Usted ha respondido ${nroCorrects} de ${data?.length} preguntas correctamente.`}
						</Typography>
						<Typography variant="h5" className={classes.pregunta}>
							{`Puntaje obtenido:`}
						</Typography>
						<Typography variant="h3" className={classes.pregunta}>
							{`${data && Math.round((nroCorrects / data.length) * 100).toFixed(2)} %`}
						</Typography>
					</FormControl>
				) : (
					pregunta && (
						<FormControl component="fieldset">
							<Typography variant="h6" className={classes.pregunta}>
								{`P${nroPreg}. ${pregunta.nombre}`}
							</Typography>
							<RadioGroup aria-label="opciones" value={idxResp} onChange={handleChangeRespuesta}>
								{pregunta.opciones.map((ele: IOption, index: number) => {
									return (
										<FormControlLabel
											key={index}
											value={index}
											control={<Radio color="default" />}
											label={ele.opcion}
											disabled={stage === PreguntaStage.RESPONDER ? false : index !== idxResp}
										/>
									);
								})}
							</RadioGroup>
						</FormControl>
					)
				)}
			</DialogContent>
			<DialogActions className={classes.actions}>
				{stage !== PreguntaStage.FINALIZAR && (
					<Typography variant="h6" className={classes.preguntas}>
						{`Pregunta ${nroPreg}/${data?.length}`}
					</Typography>
				)}
				{stage === PreguntaStage.SIGUIENTE && (
					<Typography variant="h6" className={isCorrect ? classes.correcta : classes.incorrecta}>
						{isCorrect ? '¡Respuesta correcta!' : '¡Respuesta incorrecta!'}
					</Typography>
				)}
				{stage === PreguntaStage.RESPONDER && btnValid && (
					<GreenButton onClick={revisarPregunta} color="primary">
						{stage}
					</GreenButton>
				)}
				{stage === PreguntaStage.SIGUIENTE && (
					<BlueButton
						onClick={nroPreg === data?.length ? evaluarCuestionario : siguientePregunta}
						color="primary"
					>
						{nroPreg === data?.length ? PreguntaStage.FINALIZAR : stage}
					</BlueButton>
				)}
			</DialogActions>
		</Dialog>
	);
};

/*******************************************************************************************************/
// Exportamos el componente //
/*******************************************************************************************************/
export default Jugar;
