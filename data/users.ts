export interface Usuario {
  username: string;
  password: string;
}

// Credenciales publicas que la propia pagina de login muestra.
export const USUARIOS = {
  estandar: { username: 'standard_user', password: 'secret_sauce' },
  bloqueado: { username: 'locked_out_user', password: 'secret_sauce' },
} satisfies Record<string, Usuario>;

export const DATOS_CHECKOUT = {
  firstName: 'QA',
  lastName: 'Automatizacion',
  postalCode: '110111',
};
