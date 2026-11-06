import { USUARIOS, Usuario } from './users';

/** Mensajes que SauceDemo muestra en `[data-test="error"]` de la pantalla de login. */
export const MENSAJES_LOGIN = {
  usuarioRequerido: 'Epic sadface: Username is required',
  claveRequerida: 'Epic sadface: Password is required',
  credencialesInvalidas: 'Epic sadface: Username and password do not match any user in this service',
  usuarioBloqueado: 'Epic sadface: Sorry, this user has been locked out.',
} as const;

export interface CasoLoginFallido {
  id: string;
  escenario: string;
  credenciales: Usuario;
  mensaje: string;
}

/** Credenciales incorrectas: clave errónea de un usuario válido y usuario inexistente. */
export const CASOS_CREDENCIALES_INVALIDAS: CasoLoginFallido[] = [
  {
    id: 'LOG-02',
    escenario: 'contraseña incorrecta',
    credenciales: { username: USUARIOS.estandar.username, password: 'clave_incorrecta' },
    mensaje: MENSAJES_LOGIN.credencialesInvalidas,
  },
  {
    id: 'LOG-03',
    escenario: 'usuario inexistente',
    credenciales: { username: 'usuario_inexistente', password: USUARIOS.estandar.password },
    mensaje: MENSAJES_LOGIN.credencialesInvalidas,
  },
];

/**
 * Campos vacíos: la app valida primero el usuario, así que con ambos vacíos
 * el mensaje es el de usuario requerido.
 */
export const CASOS_CAMPOS_VACIOS: CasoLoginFallido[] = [
  {
    id: 'LOG-05',
    escenario: 'usuario y contraseña vacíos',
    credenciales: { username: '', password: '' },
    mensaje: MENSAJES_LOGIN.usuarioRequerido,
  },
  {
    id: 'LOG-06',
    escenario: 'usuario vacío',
    credenciales: { username: '', password: USUARIOS.estandar.password },
    mensaje: MENSAJES_LOGIN.usuarioRequerido,
  },
  {
    id: 'LOG-07',
    escenario: 'contraseña vacía',
    credenciales: { username: USUARIOS.estandar.username, password: '' },
    mensaje: MENSAJES_LOGIN.claveRequerida,
  },
];
