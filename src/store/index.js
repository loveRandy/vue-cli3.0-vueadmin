import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import getters from './getters'
import modules from './modules'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules
})
