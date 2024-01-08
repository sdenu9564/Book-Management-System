import express from "express";
import {createServer} from "http";
import constans from "./config/constans.js";
import configMiddleware from "./config/middleware.js";
import mongoose from "mongoose";
import 'dotenv/config';
import ApiRoutes from './routes/index.js';



const app = express();
const httpServer = createServer(app);

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;


configMiddleware(app);

app.use('/api',ApiRoutes);

mongoose.connect(`mongodb://${USERNAME}:${PASSWORD}@cluster0-shard-00-00.otll1.mongodb.net:27017,cluster0-shard-00-01.otll1.mongodb.net:27017,cluster0-shard-00-02.otll1.mongodb.net:27017/?ssl=true&replicaSet=atlas-gxo9d2-shard-0&authSource=admin&retryWrites=true&w=majority`,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => {
    console.log("database is connected")
    httpServer.listen(constans.PORT, async err => {
        if(err) {
            console.log('cannot run');
        }
        console.log(`server is running on port: ${constans.PORT}`)
    })
}).catch(err => {
    console.log("can not connect with your databse",err);
});




export default app;


