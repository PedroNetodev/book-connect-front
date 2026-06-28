const path = require('path');
const {
  By,
  Key,
  until,
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

const screenshotFolder = path.join(repoRoot, 'docs', 'prints', 'selenium');

const tests = [
  {
    id: 'CTA01',
    name: 'redireciona a raiz para a tela de login',
    run: async (driver) => {
      await driver.get(`${baseUrl}/`);
      await waitForPageReady(driver);
      await driver.wait(until.urlContains('/login'), 20000);
      await waitVisible(driver, By.css('form'));
    },
  },
  {
    id: 'CTA02',
    name: 'exibe erros ao enviar login vazio',
    run: async (driver) => {
      await driver.get(`${baseUrl}/login`);
      await waitForPageReady(driver);
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(async () => {
        const errors = await driver.findElements(By.css('.error-message'));
        return errors.length === 2;
      }, 10000);
    },
  },
  {
    id: 'CTA03',
    name: 'bloqueia senha curta no login',
    run: async (driver) => {
      await driver.get(`${baseUrl}/login`);
      await waitForPageReady(driver);
      await driver.findElement(By.id('email')).sendKeys('aluno@bookconnect.com');
      await driver.findElement(By.id('password')).sendKeys('123');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await waitVisible(driver, By.css('.error-message'));
    },
  },
  {
    id: 'CTA04',
    name: 'redireciona login valido para a Home',
    run: async (driver) => {
      await driver.get(`${baseUrl}/login`);
      await waitForPageReady(driver);
      await driver.findElement(By.id('email')).sendKeys('aluno@bookconnect.com');
      await driver.findElement(By.id('password')).sendKeys('123456');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.urlContains('/home'), 20000);
    },
  },
  {
    id: 'CTA05',
    name: 'envia busca pelo menu superior',
    run: async (driver) => {
      await driver.get(`${baseUrl}/livros/cadastro`);
      await waitForPageReady(driver);
      const search = await waitVisible(driver, By.css('input[aria-label="Search"]'));
      await setInputValue(driver, search, 'Clean Code');
      await driver.wait(async () => (await search.getAttribute('value')) === 'Clean Code', 10000);
      const searchButton = await driver.findElement(By.css('.input-group button[type="submit"]'));
      await driver.executeScript('arguments[0].click();', searchButton);
      await driver.wait(until.urlContains('/home?text='), 20000);
      const currentUrl = await driver.getCurrentUrl();

      if (!currentUrl.includes('Clean%20Code')) {
        throw new Error(`Busca nao manteve o texto esperado na URL: ${currentUrl}`);
      }
    },
  },
  {
    id: 'CTA06',
    name: 'renderiza formulario de cadastro de livro',
    run: async (driver) => {
      await driver.get(`${baseUrl}/livros/cadastro`);
      await waitForPageReady(driver);
      await waitVisible(driver, By.css('[id="bookForm.title"]'));
      await waitVisible(driver, By.css('[id="bookForm.author"]'));
      await waitVisible(driver, By.css('input[name="conservation"]'));
    },
  },
  {
    id: 'CTA07',
    name: 'abre modal de endereco na venda online',
    run: async (driver) => {
      await driver.get(`${baseUrl}/livros/vendas/cadastro`);
      await waitForPageReady(driver);
      const yesRadio = await waitVisible(driver, By.css('input[name="vendaOnline"][value="Sim"]'));
      await driver.executeScript('arguments[0].click();', yesRadio);
      await waitVisible(driver, By.css('.modal.show'));
      await waitVisible(driver, By.css('[id="endereco.rua"]'));
    },
  },
  {
    id: 'CTA08',
    name: 'preenche e fecha modal de endereco da venda',
    run: async (driver) => {
      await driver.get(`${baseUrl}/livros/vendas/cadastro`);
      await waitForPageReady(driver);
      const yesRadio = await waitVisible(driver, By.css('input[name="vendaOnline"][value="Sim"]'));
      await driver.executeScript('arguments[0].click();', yesRadio);
      await waitVisible(driver, By.css('.modal.show'));
      await driver.findElement(By.css('[id="endereco.rua"]')).sendKeys('Rua dos Livros');
      await driver.findElement(By.css('[id="endereco.numero"]')).sendKeys('123');
      await driver.findElement(By.css('[id="endereco.cep"]')).sendKeys('32000000');
      await driver.findElement(By.xpath("//button[contains(., 'Fechar')]")).click();
      await driver.wait(until.elementLocated(By.css('form')), 10000);
    },
  },
  {
    id: 'CTA09',
    name: 'valida campos de contato',
    run: async (driver) => {
      await driver.get(`${baseUrl}/contatos/cadastro`);
      await waitForPageReady(driver);
      const email = await driver.findElement(By.css('input[name="email"]'));
      const phone = await driver.findElement(By.css('input[name="phone"]'));
      await setInputValue(driver, email, 'email-invalido');
      await setInputValue(driver, phone, '31999998888');
      await driver.wait(async () => {
        const errors = await driver.findElements(By.css('.error-message'));
        const phoneValue = await phone.getAttribute('value');
        return errors.length >= 1 && phoneValue === '(31) 99999-8888';
      }, 10000);
    },
  },
  {
    id: 'CTA10',
    name: 'renderiza tabelas de vendas e trocas sem quebrar',
    run: async (driver) => {
      await driver.get(`${baseUrl}/livros/vendas`);
      await waitForPageReady(driver);
      await waitVisible(driver, By.id('table-vendas'), 30000);
      await driver.get(`${baseUrl}/livros/trocas`);
      await waitForPageReady(driver);
      await waitVisible(driver, By.id('table-trocas'), 30000);
    },
  },
];

async function main() {
  const app = await startApp();
  const driver = await createDriver();
  const results = [];

  try {
    for (const testCase of tests) {
      try {
        await testCase.run(driver);
        const screenshot = await takeScreenshot(driver, screenshotFolder, `${testCase.id}-passed`);
        results.push({ ...testCase, status: 'PASS', screenshot });
        console.log(`PASS ${testCase.id} - ${testCase.name}`);
      } catch (error) {
        const screenshot = await takeScreenshot(driver, screenshotFolder, `${testCase.id}-failed`);
        results.push({ ...testCase, status: 'FAIL', screenshot, error });
        console.error(`FAIL ${testCase.id} - ${testCase.name}`);
        console.error(error.message);
      }
    }
  } finally {
    await driver.quit();
    await stopApp(app);
  }

  const failures = results.filter((result) => result.status === 'FAIL');

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
