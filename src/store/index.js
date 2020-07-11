import Vue from 'vue'
import Vuex from 'vuex'
// import * as actions from './actions'
// import * as getters from './getters'
// import state from './state'
// import mutations from './mutations'
// import createLogger from 'vuex/dist/logger'
// import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

// export default new Vuex.Store({
//   actions,
//   getters,
//   state,
//   mutations
// })


const state = {
  httpError:{
      hasError:false,
      status:'',
      statusText:''
  }
}

const mutations = {
  ON_HTTP_ERROR(state,payload){
      state.httpError = payload
  }
}

export default new Vuex.Store({
  state,
  mutations
})
