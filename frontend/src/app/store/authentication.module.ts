import {ActionTree, MutationTree} from 'vuex';
import AxiosUserRepository from "@/repositories/AxiosUserRepository";
import router from "@/app/router";

const userLocal = localStorage.getItem('user');
let user = null;
if(userLocal)
    user = JSON.parse(userLocal);

const initialState = user
    ? { status: { loggedIn: true }, user }
    : { status: { loggedIn: false }, user: null };

const actions: ActionTree<any, any> = {
    async login({ dispatch, commit }, { email, password }) {
        commit('loginRequest', { email });
        try {
            const user = await AxiosUserRepository.login(email, password);
            commit('loginSuccess', user);
            await router.push({path: '/'})
        }
        catch (e) {
            commit('loginFailure', e);
            dispatch('alert/error', e, {root: true})
        }
    },
    logout({ commit }) {
        AxiosUserRepository.logout();
        commit('logout');
    }
}

const mutations: MutationTree<any> = {
    loginRequest(state, user) {
        state.status = { loggingIn: true };
        state.user = user;
    },
    loginSuccess(state, user) {
        state.status = { loggedIn: true };
        state.user = user;
    },
    loginFailure(state) {
        state.status = {};
        state.user = null;
    },
    logout(state) {
        state.status = {};
        state.user = null;
    }
}

export const authentication = {
    namespaced: true,
    state: initialState,
    actions: actions,
    mutations: mutations
}