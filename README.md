### NodeJS + TS monorepo with 3 microservices and a shared libs module.

## Services

### Gateway microservice
- Runs on port 3000
- Used as a proxy to all other microservices.

### User microservice
- Runs on port 3001
- Has /auth API with tests
- Has /users CRUD API with tests

### Product microservice
- Runs on port 3002
- Has /products CRUD API with tests

## MySQL
- Has userService, productService users
## Prometheus
- Runs at http://localhost:9090
## Grafana
- Runs at http://localhost:3000 (user/pass = admin/admin)
## Jaeger
- Runs at http://localhost:16686

## Environments

### Local development
- Requires mysql, Jaeger (Optional).
- Can be started with `docker compose -f docker-compose-local.yml up`

### Dev environment
- Requires: mysql, prometheus, grafana, loki, promtail, nginx, microservices: gateway, user, product.
- Can be started with `docker compose -f docker-compose-dev.yml up --build`
- Services setup: 2 instances of both user and product with load balancer nginx
- Grafana setup: Loki integration, Dashbaords for each microservice that shows NodeJS and HTTP data.

