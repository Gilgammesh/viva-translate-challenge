/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import { Schema, model, Document, PopulatedDoc } from 'mongoose';
import { IUsuario } from '../auth/usuario';

/*******************************************************************************************************/
// Interface del Modelo //
/*******************************************************************************************************/
export interface ICuestionario extends Document {
	nombre: string;
	descripcion?: string;
	usuario: PopulatedDoc<IUsuario>;
	createdAt: Date;
	updatedAt: Date;
}

/*******************************************************************************************************/
// Creamos el schema y definimos los tipos de datos //
/*******************************************************************************************************/
const CuestionarioSchema: Schema = new Schema(
	{
		nombre: {
			type: String,
			required: [true, 'El nombre del cuestionario es requerido']
		},
		descripcion: String,
		usuario: {
			ref: 'Usuario',
			type: Schema.Types.ObjectId,
			required: [true, 'El usuario es requerido']
		}
	},
	{
		collection: 'cuestionarios',
		timestamps: true,
		versionKey: false
	}
);

/*******************************************************************************************************/
// Exportamos el modelo de datos //
/*******************************************************************************************************/
export default model<ICuestionario>('Cuestionario', CuestionarioSchema);
