/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import { Schema, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

/*******************************************************************************************************/
// Interface del Modelo //
/*******************************************************************************************************/
export interface IUsuario extends Document {
	nombre: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
}

/*******************************************************************************************************/
// Creamos el schema y definimos los tipos de datos //
/*******************************************************************************************************/
const UsuarioSchema: Schema = new Schema(
	{
		nombre: {
			type: String,
			unique: true,
			required: [true, 'El nombre de usuario es requerido']
		},
		password: {
			type: String,
			required: [true, 'La contraseña es requerida']
		}
	},
	{
		collection: 'usuarios',
		timestamps: true,
		versionKey: false
	}
);

/*******************************************************************************************************/
// Validamos los campos que son únicos, con mensaje personalizado //
/*******************************************************************************************************/
UsuarioSchema.plugin(uniqueValidator, { message: '{VALUE}, ya se encuentra registrado' });

/*******************************************************************************************************/
// Exportamos el modelo de datos //
/*******************************************************************************************************/
export default model<IUsuario>('Usuario', UsuarioSchema);
