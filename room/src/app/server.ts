import app from "./app";

const server = app.listen(app.get('port'), () => {
   console.log(`App is running in port ${app.get('port')} in ${app.get('env')}`);
});

export default server;