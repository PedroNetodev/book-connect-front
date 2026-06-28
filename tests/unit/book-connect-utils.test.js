import { getConservacaoLabel, safeArray } from '../../src/utils/book';
import { formatBrazilianPhone, isValidBrazilianCellphone, isValidContactEmail } from '../../src/utils/contactValidation';
import { parseCurrencyValue } from '../../src/utils/currency';
import { formatDateForMySQL } from '../../src/utils/date';
import { isValidLoginEmail, validateLoginCredentials } from '../../src/utils/loginValidation';

describe('Book Connect - testes unitarios', () => {
  test('CTU01 - retorna rotulo Novo para conservacao 0', () => {
    expect(getConservacaoLabel(0)).toBe('Novo');
  });

  test('CTU02 - retorna texto vazio para conservacao desconhecida', () => {
    expect(getConservacaoLabel(99)).toBe('');
  });

  test('CTU03 - mantem arrays validos recebidos da API', () => {
    const books = [{ id: 1, titulo: 'Dom Casmurro' }];

    expect(safeArray(books)).toBe(books);
  });

  test('CTU04 - transforma resposta invalida da API em lista vazia', () => {
    expect(safeArray({ erro: 'sem conexao' })).toEqual([]);
  });

  test('CTU05 - aceita e-mail de login em formato valido', () => {
    expect(isValidLoginEmail('aluno.teste+book@example.com')).toBe(true);
  });

  test('CTU06 - bloqueia login sem e-mail e sem senha', () => {
    expect(validateLoginCredentials('', '')).toEqual({
      email: 'O campo de e-mail e obrigatorio',
      password: 'O campo de senha e obrigatorio',
    });
  });

  test('CTU07 - bloqueia senha com menos de seis caracteres', () => {
    expect(validateLoginCredentials('aluno@example.com', '12345')).toHaveProperty('password');
  });

  test('CTU08 - converte valor monetario brasileiro para numero', () => {
    expect(parseCurrencyValue('R$ 1.250,75')).toBe(1250.75);
  });

  test('CTU09 - formata data para padrao MySQL', () => {
    const date = new Date(2026, 4, 27, 9, 5, 7);

    expect(formatDateForMySQL(date)).toBe('2026-05-27 09:05:07');
  });

  test('CTU10 - valida dados de contato brasileiros', () => {
    const phone = formatBrazilianPhone('31999998888');

    expect(phone).toBe('(31) 99999-8888');
    expect(isValidBrazilianCellphone(phone)).toBe(true);
    expect(isValidContactEmail('contato@bookconnect.com')).toBe(true);
  });
});
