# IDH IPD

[![Build Status](https://akvo.semaphoreci.com/badges/idh-ipd/branches/main.svg?style=shields)](https://akvo.semaphoreci.com/projects/idh-ipd) [![Repo Size](https://img.shields.io/github/repo-size/akvo/idh-ipd)](https://img.shields.io/github/repo-size/akvo/idh-ipd) [![Languages](https://img.shields.io/github/languages/count/akvo/idh-ipd
)](https://img.shields.io/github/languages/count/akvo/idh-ipd
) [![Issues](https://img.shields.io/github/issues/akvo/idh-ipd
)](https://img.shields.io/github/issues/akvo/idh-ipd
) [![Last Commit](https://img.shields.io/github/last-commit/akvo/idh-ipd/main
)](https://img.shields.io/github/last-commit/akvo/idh-ipd/main)

# Development

```bash
docker-compose up -d
```

The app should be running at: [localhost:3000](http://localhost:3000). Any endpoints with prefix `/api` will be redirected to [localhost:5000](http://localhost:5000)

see: [setupProxy.js](https://github.com/akvo/idh-ipd/blob/main/frontend/src/setupProxy.js)

# Production

```bash
export CI_COMMIT='local'
./ci/build.sh
```
This will generate two docker images with prefix `eu.gcr.io/akvo-lumen/idh-ipd` for backend and frontend

```bash
docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d
```

Then visit: [localhost:8080](http://localhost:8080). Any endpoints with prefix `/api` is redirected to `http://backend:5000` inside the network container

see:
- [nginx](https://github.com/akvo/idh-ipd/blob/main/frontend/nginx/conf.d/default.conf) config
- [mainnetwork](https://github.com/akvo/idh-ipd/blob/cc7090a805898e6983761418828bf20806d15326/docker-compose.override.yml#L4-L7) container setup

# Database Seeder

Assuming you have `prod-company.csv` and `prod-driver-income.csv` inside `./backend/data` folder
you will be able to run

- Company Seeder
```
docker-compose exec backend python -m seeder.company
```

- Driver Income Seeder
```
docker-compose exec backend python -m seeder.driver_income
```
