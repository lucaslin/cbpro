import crypto from 'crypto';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * Modified from https://docs.pro.coinbase.com/#signing-a-message
 */
function createSignature({
  config,
  timestamp,
  secret,
}: {
  config: AxiosRequestConfig;
  timestamp: number | string;
  secret: string;
}) {
  const { data: body, method = 'GET' } = config;
  const requestPath = axios.getUri(config);

  const bodyString = body ? JSON.stringify(body) : '';

  // create the prehash string by concatenating required parts
  const what = timestamp + method.toUpperCase() + requestPath + bodyString;

  // decode the base64 secret
  const key = Buffer.from(secret, 'base64');

  // create a sha256 hmac with the secret
  const hmac = crypto.createHmac('sha256', key);

  // sign the require message with the hmac
  // and finally base64 encode the result
  return hmac.update(what).digest('base64');
}

export default function createClient({
  secret,
  apiKey,
  passphrase,
}: {
  secret: string;
  apiKey: string;
  passphrase: string;
}): AxiosInstance {
  const instance = axios.create({
    baseURL: 'https://api.pro.coinbase.com',
    headers: {
      'Content-Type': 'application/json',
      'CB-ACCESS-KEY': apiKey,
      'CB-ACCESS-PASSPHRASE': passphrase,
    },
  });

  instance.interceptors.request.use((config: AxiosRequestConfig) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createSignature({ config, timestamp, secret });
    return {
      ...config,
      headers: {
        ...config.headers,
        'CB-ACCESS-SIGN': signature,
        'CB-ACCESS-TIMESTAMP': timestamp,
      },
    };
  });

  return instance;
}
