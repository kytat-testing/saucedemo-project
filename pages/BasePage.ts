import { Locator, Page, expect } from '@playwright/test';
import { HeaderComponent } from './components/HeaderComponent';

export abstract class BasePage {
  readonly header: HeaderComponent;
  readonly titulo: Locator;

  /** Ruta propia de la pantalla, p. ej. "/cart.html". */
  protected abstract readonly ruta: string;

  constructor(readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.titulo = page.getByTestId('title');
  }

  async abrir() {
    await this.page.goto(this.ruta);
  }

  async expectEstaAbierta(tituloEsperado?: string) {
    await expect(this.page).toHaveURL(new RegExp(`${this.ruta.replace('.', '\\.')}$`));
    if (tituloEsperado) await expect(this.titulo).toHaveText(tituloEsperado);
  }
}
