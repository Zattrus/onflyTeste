const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://onfly-rpa-forms-62njbv2kbq-uc.a.run.app/');

  // Função genérica para preencher campos por placeholder
  const fillInputByLabel = async (labelText, value) => {
  const labelHandle = await page.$x(`//label[contains(text(), "${labelText}")]`);//Localiza a label pelo texto
  if (labelHandle.length > 0) {
    // Localiza o input como irmão ou dentro do label
    const inputHandle = await page.evaluateHandle(el => {
      let input = el.nextElementSibling;
      if (!input) {
        input = el.querySelector('input, textarea');
      }
      return input;
    }, labelHandle[0]);

    if (inputHandle) {
      await inputHandle.type(value);
    } else {
      console.error(`Não foi possível localizar um campo associado ao label: "${labelText}".`);
    }
  } else {
    console.error(`Label com texto "${labelText}" não encontrado.`);
  }
};

  // Primeira página: Nome, Telefone, E-mail
  console.log('Preenchendo primeira página...');
  await page.waitForSelector('form'); // Aguarda o formulário carregar
  await fillInputByLabel('Nome Completo', 'João da Silva');
  await fillInputByLabel('Telefone', '(11) 98765-4321');

  // Validação do email
  const email = 'joao.silva@example.com';
  function validarEmail(email) {
    // Regex para validar o formato de e-mail
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  if (!validarEmail(email)) {
    mensage.error('E-mail inválido.');
    await browser.close();
    return;
  }
  await fillInputByLabel('E-mail', email.toString());

  // Avançar para a próxima página
  await new Promise(resolve => setTimeout(resolve, 2000));
  await page.click('button[id="next-btn"]');

  // Segunda página: CEP, Endereço, Cidade, Estado
  console.log('Preenchendo segunda página...');
  await fillInputByLabel('CEP', '01234-567');
  await fillInputByLabel('Endereço', 'Rua das Flores, 123');
  await fillInputByLabel('Cidade', 'São Paulo');
  await fillInputByLabel('Estado', 'SP');

  // Avançar para a próxima página
  await new Promise(resolve => setTimeout(resolve, 2000));
  await page.click('button[id="next-btn"]');

  // Terceira página: Nome do titular, Número do cartão, Data de validade, CVV
  console.log('Preenchendo terceira página...');
  await fillInputByLabel('Nome do Titular', 'João da Silva');
  await fillInputByLabel('Número do Cartão', '4111111111111111');
  await fillInputByLabel('Data de Validade', '12/2025');
  await fillInputByLabel('CVV', '123');

  // Submete o formulário final
  await new Promise(resolve => setTimeout(resolve, 2000));
  await page.click('button[id="next-btn"]');

  await page.evaluate(() => {
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(p => {
      p.textContent = 'Texto alterado';
    });
  });  
  await page.waitForNavigation(); // Aguarda a confirmação ou página final

  console.log('Formulário preenchido com sucesso!');
  await browser.close();
})();
