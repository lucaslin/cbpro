# cb-pro-api
This package is a thin wrapper around the popular HTTP client, [Axios](https://www.npmjs.com/package/axios), that abstracts the basic request authentication needed for the [Coinbase Pro REST API](https://docs.pro.coinbase.com/#api).

## Installing

Using npm:

```bash
$ npm install cb-pro-api
```

Using yarn:

```bash
$ yarn add cb-pro-api
```

## Usage
Import the `createClient` function and pass it your API keys to create an Axios HTTP client that will send authenticated requests. 
```js
const { createClient } = require('cb-pro-api');

const cb = createClient({
  apiKey: process.env.CB_API_KEY,
  secret: process.env.CB_API_SECRET,
  passphrase: process.env.CB_API_PASSPHRASE,
});
```

Use the [Coinbase Pro REST API docs](https://docs.pro.coinbase.com/#api) to see the available methods.

## Example

```js
const { createClient } = require('cb-pro-api');

const cb = createClient({
  apiKey: process.env.CB_API_KEY,
  secret: process.env.CB_API_SECRET,
  passphrase: process.env.CB_API_PASSPHRASE,
});

// Place a market order for $5 worth of BTC
await cb.post('/orders', {
  type: 'market',
  funds: 5,
  side: 'buy',
  product_id: 'BTC-USD',
});

// Get the latest ETH-USD ticker
const { data: ticker } = await cb.get('/products/ETH-USD/ticker');
console.log(ticker);
// {
//   ticker: {
//     trade_id: 99415874,
//     price: '2478.9',
//     size: '0.01419161',
//     time: '2021-04-17T06:35:30.077144Z',
//     bid: '2478.69',
//     ask: '2478.86',
//     volume: '243742.21783082'
//   }
// }

```