import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Usuario } from '../data/users';

/** Clase "error" exacta (no confundir con "error-message-container"). */
const CLASE_ERROR = /(^|\s)error(\s|$)/;

export class LoginPage extends BasePage {
  protected readonly ruta = '/';
  readonly usuario: Locator;
  readonly clave: Locator;
  readonly botonIngresar: Locator;
  /** El contenedor no tiene data-test: siempre existe y recibe la clase "error" al mostrar un mensaje. */
  readonly contenedorError: Locator;
  readonly mensajeError: Locator;
  readonly botonCerrarError: Locator;

  constructor(page: Page) {
    super(page);
    this.usuario = page.getByTestId('username');
    this.clave = page.getByTestId('password');
    this.botonIngresar = page.getByTestId('login-button');
    this.contenedorError = page.locator('.error-message-container');
    this.mensajeError = this.contenedorError.getByTestId('error');
    this.botonCerrarError = this.mensajeError.getByTestId('error-button');
  }

  async login({ username, password }: Usuario) {
    await this.abrir();
    await this.usuario.fill(username);
    await this.clave.fill(password);
    await this.botonIngresar.click();
  }

  async cerrarError() {
    await this.botonCerrarError.click();
  }

  /** El mensaje se ve dentro del contenedor de error, con su botón de cierre. */
  async expectError(mensaje: string) {
    await expect(this.contenedorError).toHaveClass(CLASE_ERROR);
    await expect(this.mensajeError).toBeVisible();
    await expect(this.mensajeError).toHaveText(mensaje);
    await expect(this.botonCerrarError).toBeVisible();
  }

  async expectSinError() {
    await expect(this.mensajeError).toBeHidden();
    await expect(this.contenedorError).not.toHaveClass(CLASE_ERROR);
  }
}
