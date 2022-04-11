/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { drawerWidth } from 'configs/settings';
import { startLogout } from 'redux/actions/auth';
import { IRootReducers } from 'redux/store';
import logo from 'assets/images/logo.png';
import { Link } from 'react-router-dom';

/*******************************************************************************************************/
// Definimos los estilos del componente //
/*******************************************************************************************************/
const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex'
	},
	toolbar: {
		paddingRight: 24
	},
	toolbarIcon: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '0 8px',
		...theme.mixins.toolbar
	},
	toolbarButton: {
		textTransform: 'none'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	menuButton: {
		marginRight: 36
	},
	menuButtonHidden: {
		display: 'none'
	},
	title: {
		flexGrow: 1
	},
	drawerPaper: {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	drawerPaperClose: {
		overflowX: 'hidden',
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		width: theme.spacing(7),
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9)
		}
	},
	appBarSpacer: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		height: '100vh',
		overflow: 'auto'
	},
	container: {
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		paddingLeft: theme.spacing(3),
		paddingRight: theme.spacing(3)
	},
	paper: {
		padding: theme.spacing(2),
		display: 'flex',
		overflow: 'auto',
		flexDirection: 'column'
	},
	fixedHeight: {
		height: 240
	}
}));

/*******************************************************************************************************/
// Interface de las propiedades del componente //
/*******************************************************************************************************/
interface IProps {
	children: React.ReactChild;
}

/*******************************************************************************************************/
// Definimos el componente Layout de nuestra aplicacion //
/*******************************************************************************************************/
const Layout = (props: IProps) => {
	// Llamamos al dispatch de redux
	const dispatch = useDispatch();

	// Vemos si el usuario está logueado
	const { nombre } = useSelector((state: IRootReducers) => state.auth.usuario);

	// Instanciamos las clases para ls estilos
	const classes = useStyles();

	// Estado para apertura del drawer
	const [open, setOpen] = useState(true);

	// Estado del anchor del menu drop
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	// Función para abrir el drawer
	const handleDrawerOpen = () => {
		setOpen(true);
	};
	// Función para cerrar el drawer
	const handleDrawerClose = () => {
		setOpen(false);
	};

	// Función para abrir el menu
	const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	// Función para cerrar el menu
	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	// Función para cerrar sesión del usuario
	const handleLogout = () => {
		dispatch(startLogout());
	};

	// Renderizamos
	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
				<Toolbar className={classes.toolbar}>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
					>
						<MenuIcon />
					</IconButton>
					<Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
						Aplicación Quiz
					</Typography>
					<Button color="inherit" className={classes.toolbarButton} onClick={handleOpenMenu}>
						<PersonIcon />
						&nbsp;{nombre}
					</Button>
					<Menu
						elevation={1}
						getContentAnchorEl={null}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'center'
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'center'
						}}
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleCloseMenu}
					>
						<MenuItem onClick={handleLogout}>
							<ListItemIcon>
								<ExitToAppIcon fontSize="small" />
							</ListItemIcon>
							<ListItemText primary="Cerrar Sesión" />
						</MenuItem>
					</Menu>
				</Toolbar>
			</AppBar>
			<Drawer
				variant="permanent"
				classes={{
					paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
				}}
				open={open}
			>
				<div className={classes.toolbarIcon}>
					<img src={logo} alt="logo" width={46} height={46} />
					<IconButton onClick={handleDrawerClose}>
						<ChevronLeftIcon />
					</IconButton>
				</div>
				<Divider />
				<List>
					<Link to={'/quiz/cuestionarios'}>
						<ListItem button selected>
							<ListItemIcon>
								<AssignmentIcon />
							</ListItemIcon>
							<ListItemText primary="Cuestionarios" />
						</ListItem>
					</Link>
				</List>
			</Drawer>
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />
				<div className={classes.container}>{props.children}</div>
			</main>
		</div>
	);
};

/*******************************************************************************************************/
// Exportamos el componente memorizado //
/*******************************************************************************************************/
export default Layout;
