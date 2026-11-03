import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Usuario } from '../data/users';

export class LoginPage extends BasePage {
  protected readonly ruta = '/';
  readonly usuario: Locator;
  readonly clave: Locator;
  readonly botonIngresar: Locator;

  constructor(page: Page) {
    super(page);
    this.usuario = page.getByTestId('username');
    this.clave = page.getByTestId('password');
    this.botonIngresar = page.getByTestId('login-button');
  }

  async login({ username, password }: Usuario) {
    await this.abrir();
    await this.usuario.fill(username);
    await this.clave.fill(password);
    await this.botonIngresar.click();
  }
}
