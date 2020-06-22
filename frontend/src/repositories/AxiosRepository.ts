import axios from "axios";
import {authHeader} from "@/app/helpers/authHeader";

const baseDomain = process.env.VUE_APP_URL;
const baseURL = `${baseDomain}/api`;

const client = function (){
    return axios.create({
        baseURL,
        headers: authHeader()
    });
}

export default client;

export function httpGet(route: string, params = {}): Promise<any> {
    return new Promise((resolve, reject) => {
        client()
            .get(route, {
                params: params
            })
            .then((data) => {
                resolve(data.data);
            })
            .catch((e) => {
                if (e.response && e.response.data && e.response.data.error) {
                    reject(e.response.data.error);
                }
                else reject(e);
            });
    });
}

export function httpPost(route: string, data = {}): Promise<any> {
    return new Promise((resolve, reject) => {
        client()
            .post(route, data, )
            .then((data) => {
                resolve(data.data);
            })
            .catch((e) => {
                if (e.response && e.response.data) {
                    if(Object.keys(e.response.data).length > 1)
                        reject(e.response.data);
                    else
                        reject(e.response.data.error);
                }
                else reject(e);
            });
    });
}