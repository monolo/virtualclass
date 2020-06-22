import {ActionTree, MutationTree} from "vuex";

const state = {
    type: null,
    message: null
}

const actions: ActionTree<any, any> = {
    success({commit}, message) {
        commit('success', message);
    },
    error({commit}, message) {
        commit('error', message);
    },
    clear({commit}) {
        commit('clear');
    }
}
const mutations: MutationTree<any> = {
    success(state, message) {
        state.type = 'alert-success';
        state.message = message;
    },
    error(state, message) {
        state.type = 'alert-danger';
        state.message = message;
    },
    clear(state) {
        state.type = null;
        state.message = null;
    }
}

export const alert = {
    namespaced: true,
    state: state,
    actions: actions,
    mutations: mutations
}