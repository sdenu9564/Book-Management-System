import { Router } from "express";
import { validate } from "express-validation";
import * as AuthenticationController from '../controller/authentication.controller.js'
import * as UserController from "../controller/user.controller.js";
import { authLocal } from "../services/auth.js";

const routes = new Router();


routes.post(
    '/singup',
    validate(AuthenticationController.validation.signup, {keyByField : true}, {abortEarly : false}),
    UserController.signup
)

routes.post(
    '/login',
    validate(AuthenticationController.validation.login, {keyByField : true}, {abortEarly : false}),
    authLocal,
    UserController.login
)



export default routes;