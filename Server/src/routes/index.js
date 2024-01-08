import { Router } from "express";
import express from 'express'
import HTTPStatus from "http-status";
import APIError from '../services/error.js'
import logErrorService from '../services/log.js';
import UserRouter from './users.routes.js';
import BooksRouter from "./books.routes.js";





const routes = new Router();
routes.get('/',(req,res)=> {
    res.send("hello")
});
routes.use('/auth',UserRouter);
routes.use('/books',BooksRouter);
routes.use(logErrorService);

routes.all('*',(req,res,next)=>
next(new APIError('Route Not Found!',HTTPStatus.NOT_FOUND,true)))

export default routes;