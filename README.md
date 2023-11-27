# Dai

Dai is a decentralized AI chatbot built on ICP.

## Setup

### Frontend canister

- Credientials
  Create a `credential.js` file in `/src/dfinity_js_frontend/src/utils` set in your Open AI API as follow:

```js
export const OPEN_AI_API_KEY = ...
```

After settins up the frontend creadentials, make sure to setup `dfx` in your computer by follwing this [doc](https://demergent-labs.github.io/azle/installation.html#build-dependencies)

## Run the app locally

Before everything you will need to run the local replica with the following command:

```bash
    dfx start --clean
```

To run the app locally, it's simple after installing `dfx` (Definity CDK) installed and running, just run the following command:

```sh
    dfx deploy
```

This command will deploy to your local network the frontend and the backend canisters. But You can also have them deployed separately.

- Deploy only the backend

```sh
    dfx deploy dfinity_js_backend
```

- Deploy only the frontend

```sh
    dfx deploy dfinity_js_frontend
```

You can also test the frontend locally by running:

```sh
  npm start
```

## Troubleshooting

If you face any issue, refer to this [doc](https://demergent-labs.github.io/azle/deployment.html#common-deployment-issues) or just reach out to [me](https://github.com/Jonath-z).
