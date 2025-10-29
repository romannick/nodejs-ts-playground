import client, { Histogram } from 'prom-client'

export const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 200, 300, 400, 500, 1000, 2000, 3000, 5000, 10000],
})

export const dbQueryHistogram = new Histogram({
  name: 'db_query_duration_ms',
  help: 'Duration of DB queries in ms',
  labelNames: ['query_type'],
  buckets: [1, 5, 10, 50, 100, 200, 500, 1000, 3000, 5000, 10000],
});

export const categorizeQuery = (query: string): string => {
  const q = query.trim().toUpperCase();

  if (q.startsWith('SELECT')) return 'SELECT';
  else if (q.startsWith('INSERT')) return 'INSERT';
  else if (q.startsWith('UPDATE')) return 'UPDATE';
  else if (q.startsWith('DELETE')) return 'DELETE';
  else if (q.startsWith('START')) return 'TRANSACTION';

  return 'OTHER';
}

export default client
