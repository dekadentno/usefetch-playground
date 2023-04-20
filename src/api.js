import { def } from '@vue/shared';
import { createFetch } from '@vueuse/core';

var serialize = function (obj, prefix) {
  var str = [],
    p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p,
        v = obj[p];
      str.push((v !== null && typeof v === "object") ?
        serialize(v, k) :
        encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
}

var API = createFetch({
  baseUrl: 'https://pokeapi.co/api/v2/',
  options: {
    async beforeFetch({ options }) {
      console.log('before fetch');
      // request interceptor
      
      options.headers = {
        ...options.headers,
        // Authorization: `Bearer ${myToken}`,
        // withCredentials: true,
        // xsrfCookieName: 'XCSRF-TOKEN',
        // xsrfHeaderName: 'x-csrf-token',
      };
      return { options };
    },
    onFetchError(ctx) {
      // error response interceptor
      console.log('err response interceptor', ctx);

      const statusCode = ctx.response.status
      console.log('status code: ', statusCode);

      if (statusCode === 404) {
        // redirect to 404 page
      } 
      if (statusCode === 403) {
        // should not happen. something on frontend side is not validated correctly or the flow is bad
      } 
      if (statusCode === 401) {
        // trigger soft logout
        // redirect to login screen
      }
      if (statusCode >= 500) {
        // redirect to maintenance page
      }
      
      return ctx;
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
});

const useAPI = {
  async get(url, payload = undefined) {
    if (payload)
      url = `${url}?${serialize(payload)}`
    return await API(url)
  },
  async post(url, payload = undefined) {
    return await API(url).post(payload).json()
  },
  async put(url, payload = undefined) {
    return await API(url).put(payload).json()
  },
  async delete(url, payload = undefined) {
    return await API(url).delete(payload).json()
  },
}

export default useAPI
