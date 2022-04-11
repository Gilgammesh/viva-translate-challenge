/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import { Schema, model, Document, PopulatedDoc } from 'mongoose';
import { ICuestionario } from './cuestionario';

/*******************************************************************************************************/
// Interface del Modelo //
/*******************************************************************************************************/
interface IOpcion extends Document {
	opcion: string;
	isValid: boolean;
}
export interface IPregunta extends Document {
	nombre: string;
	opciones: IOpcion[];
	cuestionario: PopulatedDoc<ICuestionario>;
	createdAt: Date;
	updatedAt: Date;
}

/*******************************************************************************************************/
// Creamos el schema y definimos los tipos de datos //
/*******************************************************************************************************/
const PreguntaSchema: Schema = new Schema(
	{
		nombre: {
			type: String,
			required: [true, 'El nombre de usuario es requerido']
		},
		opciones: [
			{
				opcion: {
					type: String,
					required: [true, 'La opción de respuesta es requerida']
				},
				isValid: {
					type: Boolean,
					default: false,
					required: [true, 'La validación de opción respuesta es requerida']
				}
			}
		],
		cuestionario: {
			ref: 'Cuestionario',
			type: Schema.Types.ObjectId,
			required: [true, 'El id del cuestionario es requerido']
		}
	},
	{
		collection: 'preguntas',
		timestamps: true,
		versionKey: false
	}
);

/*******************************************************************************************************/
// Exportamos el modelo de datos //
/*******************************************************************************************************/
export default model<IPregunta>('Pregunta', PreguntaSchema);
