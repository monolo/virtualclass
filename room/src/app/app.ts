import express from 'express'
import registerRoutes from './routes'
import bodyParser from "body-parser";
import {registerSubscribers} from "./subscribers";

const app: express.Express = express();
app.set('port', process.env.PORT || 3000);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

registerRoutes(app);
registerSubscribers();

export default app;