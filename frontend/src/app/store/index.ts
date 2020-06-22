import Vue from 'vue'
import Vuex from 'vuex'
import {authentication} from "@/app/store/authentication.module";
import {alert} from "@/app/store/alert.module";

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        authentication,
        alert
    }
});
