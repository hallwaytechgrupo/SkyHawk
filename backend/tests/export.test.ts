import request from 'supertest';
import app from '../src/app';

describe('Export Endpoint', () => {
  it('returns JSON export when format=json', async () => {
    const res = await request(app)
      .get('/api/export')
      .query({ format: 'json', collections: 'S2-16D-2', lat: -23.4, lng: -46.5 });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/json');
    expect(res.body).toHaveProperty('series');
  });

  it('returns CSV export when format=csv', async () => {
    const res = await request(app)
      .get('/api/export')
      .query({ format: 'csv', collections: 'S2-16D-2', lat: -23.4, lng: -46.5 });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.text.startsWith('date,satellite,variable,value,latitude,longitude,source')).toBe(true);
  });
});
