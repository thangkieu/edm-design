import { caching } from '@services/caching';
import objectHash from 'object-hash';
import { clientRequest, request } from './base-api';

export { request };

async function genGetRequest(rq: any, url: string, options?: RequestInit) {
  if (options?.cache === 'no-cache') {
    return await rq(url, {
      method: 'GET',
      ...options,
    });
  }

  const { signal, ...optToHash } = options || {};
  const hash = objectHash.MD5({ url, options: optToHash });

  const localValue = await caching.get(hash);

  if (localValue) return Promise.resolve(localValue);

  const resp = await rq(url, {
    method: 'GET',
    ...options,
  });

  await caching.set(hash, resp);

  return Promise.resolve(resp);
}

async function getRequest(url: string, options?: RequestInit) {
  return genGetRequest(request, url, options);
}

async function clientGetRequest(url: string, options?: RequestInit) {
  return genGetRequest(clientRequest, url, options);
}

async function postRequest(url: string, options?: RequestInit) {
  return await request(url, {
    method: 'POST',
    ...options,
  });
}

export const apiHelpers = {
  get: async (url: string, options?: RequestInit) => {
    return getRequest(`/pidove${url}`, options);
  },
  post: async (url: string, options?: RequestInit) => {
    return postRequest(`/pidove${url}`, options);
  },
  authGet: async (url: string, options?: RequestInit) => {
    return getRequest(`/auth${url}`, options);
  },
  authPost: async (url: string, options?: RequestInit) => {
    return postRequest(`/auth${url}`, options);
  },
  clientGet: async (url: string, options?: RequestInit) => {
    return clientGetRequest(url, options);
  },
};
