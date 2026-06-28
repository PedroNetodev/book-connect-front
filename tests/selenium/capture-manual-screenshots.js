const path = require('path');
const {
  By,
  baseUrl,
  createDriver,
  repoRoot,
  setInputValue,
  startApp,
  stopApp,
  takeScreenshot,
  waitForPageReady,
  waitVisible,
} = require('./helpers');

const screenshotFolder = path.join(repoRoot, 'docs', 'prints', 'manuais');

const shots = [
  {
    id: 'CTM01-login-inicial',
    run: async (driver) => {
      await driver.get(`${baseUrl}/login`);
      await waitForPageReady(driver);
      await waitVisible(driver, By.css('form'));
    },
  },
  {
    id: 'CTM02-login-vazio',
    run: async (driver) => {
      await driver.get(`${baseUrl}/login`);
      await waitForPageReady(driver);
      await driver.findElement(By.css('button[type="submit"]')).click();
      await waitVisible(driver, By.css('.error-message'));
    },
  },
  {
    id: 'CTM03-cadastro-livro',
    run: async (driver) => {
      await driver.get(`${baseUrl}/livros/cadastro`);
      await waitForPageReady(driver);
      await waitVisible(driver, By.css('[id="bookForm.title"]'));
    },
  },
  {
    id: 'CTM04-cadastro-livro-preenchido',
    run: async (driver) => {
      await driver.get(`${baseUrl}/livros/cadastro`);
      await waitForPageReady(driver);
      await driver.findElement(By.css('[id="bookForm.title"]')).sendKeys('Dom Casmurro');
      await driver.findElement(By.css('[id="bookForm.author"]')).sendKeys('Machado de Assis');
      await driver.findElement(By.css('[id="bookForm.synopsis"]')).sendKeys('Romance classico brasileiro.');
    },
  },
  {
    id: 'CTM05-cadastro-venda',
    run: async (driver) => {
      await driver.get(`${baseUrl}/livros/vendas/cadastro`);
      await waitForPageReady(driver);
      await waitVisible(driver, By.css('[id="vendaForm.titulo"]'));
    },
  },
  {
    id: 'CTM06-modal-endereco-venda',
    run: async (driver) => {
      await driver.get(`${baseUrl}/livros/vendas/cadastro`);
      await waitForPageReady(driver);
      const yesRadio = await waitVisible(driver, By.css('input[name="vendaOnline"][value="Sim"]'));
      await driver.executeScript('arguments[0].click();', yesRadio);
      await waitVisible(driver, By.css('.modal.show'));
    },
  },
  {
    id: 'CTM07-lista-contatos',
    run: async (driver) => {
      await driver.get(`${baseUrl}/contatos`);
      await waitForPageReady(driver);
      await waitVisible(driver, By.id('table-clientes'));
    },
  },
  {
    id: 'CTM08-cadastro-contato-validacao',
    run: async (driver) => {
      await driver.get(`${baseUrl}/contatos/cadastro`);
      await waitForPageReady(driver);
      const email = await driver.findElement(By.css('input[name="email"]'));
      const phone = await driver.findElement(By.css('input[name="phone"]'));
      await setInputValue(driver, email, 'email-invalido');
      await setInputValue(driver, phone, '31999');
      await waitVisible(driver, By.css('.error-message'));
    },
  },
  {
    id: 'CTM09-lista-vendas',
    run: async (driver) => {
      await driver.get(`${baseUrl}/livros/vendas`);
      await waitForPageReady(driver);
      await waitVisible(driver, By.id('table-vendas'), 30000);
    },
  },
  {
    id: 'CTM10-lista-trocas',
    run: async (driver) => {
      await driver.get(`${baseUrl}/livros/trocas`);
      await waitForPageReady(driver);
      await waitVisible(driver, By.id('table-trocas'), 30000);
    },
  },
];

async function main() {
  const app = await startApp();
  const driver = await createDriver();

  try {
    for (const shot of shots) {
      await shot.run(driver);
      const screenshot = await takeScreenshot(driver, screenshotFolder, shot.id);
      console.log(`${shot.id}: ${screenshot}`);
    }
  } finally {
    await driver.quit();
    await stopApp(app);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
