export function authHeader() {
    const localUser = localStorage.getItem('user');
    if(!localUser)
        return {};

    const user = JSON.parse(localUser);
    if (user && user.token) {
        return { 'Authorization': user.token };
    } else {
        return {};
    }
}