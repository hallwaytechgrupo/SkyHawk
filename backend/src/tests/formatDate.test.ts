import { formatDate } from '../utils/formatDate';

describe('formatDate', () => {
  it('deve formatar a data corretamente', () => {
    const result = formatDate(new Date('2024-10-21'));
    expect(result).toBe('21/10/2024');
  });
});
