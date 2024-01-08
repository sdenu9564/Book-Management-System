import { Router } from "express";
import { validate } from "express-validation";
import * as AuthenticationController from '../controller/authentication.controller.js'
import * as BookController from "../controller/books.controller.js";
import { authJwt } from "../services/auth.js";

const routes = new Router();


routes.post(
    '/publish',
    authJwt,
    validate(AuthenticationController.validation.book, {keyByField : true}, {abortEarly : false}),
    BookController.addBook
);
routes.get(
    '/search',
    authJwt,
    validate(AuthenticationController.validation.search, { keyByField: true }, { abortEarly: false }),
    BookController.searchBooksByTitle
);
routes.put(
    '/unpublish/:bookId',
    authJwt,
    BookController.unpublishBook
);
routes.get(
    '/user',
    authJwt,
    BookController.getBookByUserId

)
routes.get(
    '/published',
    authJwt,
    BookController.getAllPublishedBooks
)



export default routes;