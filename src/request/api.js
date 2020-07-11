import Http from './http'
export function get(apiRoute,data) {
    return Http({
      url: apiRoute,
      method: 'get',
      params:data
    })
  }
  export function post(apiRoute,data) {
    return Http({
      url: apiRoute,
      method: 'post',
      params:data
    })
  }