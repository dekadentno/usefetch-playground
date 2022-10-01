import { createFetch } from '@vueuse/core';

export const useAPI = createFetch({
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
