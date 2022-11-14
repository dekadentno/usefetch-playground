# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)


#### refresh token akcija

```
  refreshToken({ commit }) {
    let invalidRoutes = ['login', 'identity', 'login', 'validate-2fa', 'verification', 'signup', '2fa'];
    // console.log('Trying to refresh...', router.history.current.name);
    if (store.state.refreshPending || invalidRoutes.includes(router.history.current.name)) return;
    commit('setRefreshPending', true, {
      root: true
    });
    return new Promise((resolve) => {
      API.post('user/refresh').then((response) => {
        if (response && response.data) {
          let inTenMinutes = new Date(new Date().getTime() + 20 * 60 * 1000); // changed from 10 to 20 min
          Cookie.set(API.defaults.xsrfCookieName, response.data.csrf, {
            expires: inTenMinutes
          });
          commit('setSessionEndAt', response.data.expiresAt);
          commit('setRouteTimestamp', format(new Date()));
          commit('setRefreshPending', false, {
            root: true
          });
          setTimeout(() => {
            ServiceQueue.retryAll();
            resolve();
          }, 100);
        }
      });
    });
  },
```


#### retry-queue.js

```
const service = {
  retryQueue: [],
  onItemAddedCallbacks: [],
  hasMore() {
    return this.retryQueue.length > 0;
  },
  push(retryItem) {
    this.retryQueue.push(retryItem);
    this.onItemAddedCallbacks.forEach((cb) => {
      cb(retryItem);
    });
  },
  pushRetryFn({ reason, config, retryFn }) {
    return new Promise((resolve, reject) => {
      const retryItem = {
        reason,
        retry() {
          return Promise.resolve(
            retryFn().then(function() {
              resolve(config);
            })
          );
        },
        cancel() {
          return reject();
        }
      };
      this.push(retryItem);
    });
  },
  retryAll() {
    return new Promise((resolve) => {
      while (this.hasMore()) {
        this.retryQueue.shift().retry();
      }
      resolve();
    });
  }
};

export default service;

```



#### request interceptor

```
 if (store.state.refreshPending) {
      const promise = ServiceQueue.pushRetryFn({
        reason: 'failed-request',
        config: API_CONFIG,
        retryFn: () => {
          return API(API_CONFIG); // axios
        }
      });
      return promise;
    }
```