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

      // dohvatiti expiresAt i pinie
      // dobiti broj minuta od sada do expires at
      // ako je tj broj <= 2, zvati refresh token
      // zamka: refresh se mora odraditi, a zatim se pinia mora updateati s novim expiresAt
      // a drugi api call (zbog kojeg je do ovoga inicijalno i došlo) se nastavlja tek kada dođe response od refresha
      // moguća rješenja za to:
      // 1) otkazati prvi call --> zvati refresh --> ponoviti prvi call kada refresh zavrsi
      // 2) prvi call (i sve iduće) staviti na queue  ---> zvati refresh ---> ponoviti sve što se nalazi u queue, no tu postoje još neke zamke
      // 3) blokirati prvi call (tako da se u beforeFetch interceptoru awaita refresh, te zamijeni stari token i expiresAt s novima)

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
  async getaj(url, payload = undefined) {
    if (payload) {
      url = url + '?' + serialize(payload)
    }
    return await API(url)
  },
  async postaj(url, payload = undefined) {
    return await API(url, payload)
  },
  async putaj(url, payload = undefined) {
    return await API(url, payload)
  },
  async deletaj(url, payload = undefined) {
    return await API(url, payload)
  }
}

export default useAPI