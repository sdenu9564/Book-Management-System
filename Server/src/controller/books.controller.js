import {sendHttpResponse} from "../utils/createResponse.js";
import Book from "../models/books.js";




export const addBook = async (req, res) => {
    try {
        const { title, author, description } = req.body;
        const { _id: userId } = req.user;

        const bookExist = await Book.findOne({ title });

        if (bookExist) {
            return sendHttpResponse(res, 'Book already added', {}, 400, false);
        } else {
            const newBook = new Book({ title, author, description, userId });
            const savedBook = await newBook.save();
            return sendHttpResponse(res, 'Book added successfully', savedBook);
        }
    } catch (err) {
        console.error('Error adding book:', err);
        return sendHttpResponse(res, 'Internal Server Error', {}, 500, false);
    }
};

export const searchBooksByTitle = async(req,res)=>{

    try {
        const {title} = req.query;
        const books = await Book.find({title: {$regex : new RegExp(title, 'i')}});
        return sendHttpResponse(res, 'Books retrived successfully',books)
    } catch (err) {
        console.error(
            'err ---------------- books.controller.js --------search book'
        )
        
    }
}


export const unpublishBook = async (req, res) => {
    try {
      const { bookId } = req.params;
      if (!isValidObjectId(bookId)) {
        return sendHttpResponse(res, 'Invalid bookId', {}, 400, false);
      }
  
      const book = await Book.findById(bookId);
  
      if (!book) {
        return sendHttpResponse(res, 'Book not found', {}, 404, false);
      }
      book.publish = false;
      await book.save();
  
      return sendHttpResponse(res, 'Book unpublished successfully', book);
    } catch (err) {
      console.error('err ---------------- books.controller.js --------search book', err);
      return sendHttpResponse(res, 'Internal Server Error', {}, 500, false);
    }
};

//checking objectId function start
function isValidObjectId(id) {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
}
//function end


export const getBookByUserId = async(req, res) => {
    try {

        const {_id : userId} = req.user;
        console.log(userId,'----------------')

        const books = await Book.find({userId});
        return sendHttpResponse(res, 'Books fetched succesfully',books);
    } catch (error) {
        console.error(
            'err-------------------------------books.controller.js---------getBookByUserId',
            error
        )
        return sendHttpResponse(res, 'Internal server Error',{},500,false);
    }
}


export const getAllPublishedBooks = async(req, res) => {
    try {
        const books = await Book.find({
            publish : true
        });
        return sendHttpResponse(res, 'Books fetched successfully',books);
    } catch (error) {
        console.error(
            'err--------------books.controller.js-----------getAllPublishedBooks',
            err
        )
        return sendHttpResponse(res, 'Inter server Error',{},500,false);
    }
}