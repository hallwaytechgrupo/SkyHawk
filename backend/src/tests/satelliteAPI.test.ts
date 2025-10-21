import request from 'supertest';
import app from '../app';

describe('GET /api/stac/search', () => {
  it('deve retornar lista de satélites próximos', async () => {
    const res = await request(app)
      .get('/api/stac/search?lat=-14.2350&lng=-51.9253')
      .expect(200);

    expect(res.body).toHaveProperty('satellites');
    expect(Array.isArray(res.body.satellites)).toBe(true);
  });
});
