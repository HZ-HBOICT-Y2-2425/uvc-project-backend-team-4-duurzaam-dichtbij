# Duurzaam Dichtbij - Backend

In this backend example for a project, a folder is created for each micoservice. 

1. Install docker to your system
2. Run `docker compose up` and you are good to go

## Modules

We use ES6 module system to import and export modules.

## Ports

You can change the ports of your server via `variables.env`

- Apigateway: gateway running on port: 3010
- Recipes: microservice running on port: 3011
- Markets: microservice running on port: 3012
- Products: microservice running on port: 3013
- Shops: microservice running on port: 3015
- Events: microservice running on port: 3016

## API Documentation

1. ga naar events\code
2. doe npm run dev
3. http://localhost:3016/api-docs
