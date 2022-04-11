/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import React, { useEffect, useState, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { makeStyles } from '@material-ui/core/styles';
import bg from 'assets/images/background.jpg';
import logo from 'assets/images/logo.png';
import useForm from 'hooks/useForm';
import { fetchData } from '../../../services/fetch';
import { validateFetchData } from 'helpers/validateFetchData';
import { startLogin } from '../../../redux/actions/auth';

/*******************************************************************************************************/
// Definimos los estilos del componente //
/*******************************************************************************************************/
const useStyles = makeStyles(theme => ({
	root: {
		height: '100vh'
	},
	background: {
		backgroundImage: `url(${bg})`,
		backgroundRepeat: 'no-repeat',
		backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center'
	},
	grid: {
		height: '80vh',
		background: 'rgba(255,255,255,0.95)',
		borderRadius: 10,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center'
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(1)
	},
	formcontrol: {
		marginTop: '16px',
		marginBottom: '8px',
		marginLeft: 0,
		marginRight: 0
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}));

/*******************************************************************************************************/
// Definimos el componente Inicio de Sesión //
/*******************************************************************************************************/
const SignIn = () => {
	// Llamamos al dispatch de redux
	const dispatch = useDispatch();

	// Instanciamos las clases para ls estilos
	const classes = useStyles();

	// Estado para mostrar la contraseña
	const [showPassword, setShowPassword] = useState(false);

	// Estado para habilitar el botón de envio
	const [enableButton, setEnableButton] = useState(false);

	// Usamos el Hook personalizado de formularios
	const [formValues, handleInputChange] = useForm({
		nombre: '',
		password: ''
	});
	const { nombre, password } = formValues;

	// Efecto para cambiar el estado del botón de envio
	useEffect(() => {
		// Si todos los campos no están vacios
		if (formValues.nombre !== '' && formValues.password !== '') {
			setEnableButton(true);
		}
	}, [formValues]);

	// Función para cambiar el estado de mostrar la contraseña
	const handleClickShowPassword = () => {
		setShowPassword(prev => !prev);
	};

	// Función para enviar el formulario
	const onSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
		event.preventDefault();
		const result = await fetchData('auth/login', 'POST', formValues);
		// Validamos el resultado de la petición
		if (validateFetchData(result)) {
			if (result.data) {
				// Iniciamos evento login de usuario
				dispatch(startLogin(result.data.token, result.data.usuario));
			}
		}
	};

	// Renderizamos
	return (
		<Grid container component="main" className={classes.root}>
			<CssBaseline />
			<Grid container item xs={false} className={classes.background}>
				<Grid item component={Paper} xs={12} sm={8} md={4} className={classes.grid} elevation={6}>
					<div className={classes.paper}>
						<img src={logo} alt={'logo'} width={240} height={240} />
						<br />
						<Typography component="h1" variant="h5">
							Inicio de Sesión
						</Typography>
						<form className={classes.form} onSubmit={onSubmit}>
							<TextField
								type="text"
								variant="outlined"
								margin="normal"
								required
								fullWidth
								name="nombre"
								label="Usuario"
								value={nombre}
								onChange={handleInputChange}
								autoFocus
							/>
							<FormControl className={classes.formcontrol} variant="outlined" fullWidth required>
								<InputLabel htmlFor="form-password">Contraseña</InputLabel>
								<OutlinedInput
									id="form-password"
									type={showPassword ? 'text' : 'password'}
									name="password"
									value={password}
									onChange={handleInputChange}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												edge="end"
											>
												{showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										</InputAdornment>
									}
									labelWidth={100}
								/>
							</FormControl>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								disabled={!enableButton}
							>
								Ingresar
							</Button>
							<Grid container>
								<Grid item>
									<Link href="/auth/registro" variant="body2">
										{'¿No tienes una cuenta? Regístrate'}
									</Link>
								</Grid>
							</Grid>
						</form>
					</div>
				</Grid>
			</Grid>
		</Grid>
	);
};

/*******************************************************************************************************/
// Exportamos el componente //
/*******************************************************************************************************/
export default SignIn;
