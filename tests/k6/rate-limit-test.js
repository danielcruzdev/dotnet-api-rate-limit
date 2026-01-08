import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    rate_limit_test: {
      executor: 'constant-vus',
      vus: 20,
      duration: '10s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'], // não deve falhar por erro técnico
    'checks{rate_limit:yes}': ['rate>0.1'], // pelo menos 10% devem ser 429
  },
};

export default function () {
  const url = 'http://localhost:5189/with-rate-limit/weather-forecast';

  const res = http.get(url);

  const isRateLimited = res.status === 429;

  check(res, {
    'status é 200 ou 429': (r) => r.status === 200 || r.status === 429,
    'rate limit aplicado': () => isRateLimited,
  }, { rate_limit: 'yes' });

  sleep(0.5);
}
