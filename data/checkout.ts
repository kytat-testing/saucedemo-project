import { DATOS_CHECKOUT } from './users';

export interface DatosCheckout {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/** Mensajes que SauceDemo muestra en `[data-test="error"]` del paso 1. */
export const MENSAJES_CHECKOUT = {
  nombre: 'Error: First Name is required',
  apellido: 'Error: Last Name is required',
  codigoPostal: 'Error: Postal Code is required',
} as const;

export interface CasoObligatorio {
  id: string;
  escenario: string;
  datos: DatosCheckout;
  mensaje: string;
}

const sin = (campos: Partial<DatosCheckout>): DatosCheckout => ({ ...DATOS_CHECKOUT, ...campos });

/** Campos obligatorios del paso 1: cada uno vacío por separado, y los tres vacíos. */
export const CASOS_OBLIGATORIOS: CasoObligatorio[] = [
  { id: 'CHK-01', escenario: 'todos los campos vacíos', datos: sin({ firstName: '', lastName: '', postalCode: '' }), mensaje: MENSAJES_CHECKOUT.nombre },
  { id: 'CHK-02', escenario: 'First Name vacío', datos: sin({ firstName: '' }), mensaje: MENSAJES_CHECKOUT.nombre },
  { id: 'CHK-03', escenario: 'Last Name vacío', datos: sin({ lastName: '' }), mensaje: MENSAJES_CHECKOUT.apellido },
  { id: 'CHK-04', escenario: 'Zip/Postal Code vacío', datos: sin({ postalCode: '' }), mensaje: MENSAJES_CHECKOUT.codigoPostal },
];

export const CONFIRMACION = {
  titulo: 'Checkout: Complete!',
  encabezado: 'Thank you for your order!',
} as const;
