import { faker } from '@faker-js/faker';

/**
 * Gera dados de produto únicos a cada chamada.
 */
export const buildProduct = (overrides = {}) => ({
  nome: `Produto QA ${faker.commerce.productName()} ${Date.now()}`,
  preco: faker.number.int({ min: 10, max: 999 }),
  descricao: faker.commerce.productDescription(),
  quantidade: faker.number.int({ min: 50, max: 500 }),
  ...overrides,
});
