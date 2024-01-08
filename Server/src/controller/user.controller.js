import {sendHttpResponse} from "../utils/createResponse.js";
import User from '../models/users.js';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";

export const login = async (req, res) => {
    console.log(req.user,'----------------------');
    const {id, name, email, role } = req.user;
    const token = req.user.toAuthJSON();
    
    // Use res.setHeader() to set the Authorization header in the response
    res.setHeader('Authorization', token);

    sendHttpResponse(res, 'Success', {
        id,
        name,
        email,
        role,
        token
    });
}
  

export const signup  = async (req,res) => {
    try {
        console.log("helo from singup")
        const {firstname , lastname, email, password} = req.body;
        const name = firstname+ " "+ lastname;
        const userExists = await User.findOne({ email});
        if(userExists) {
            return sendHttpResponse (res, 'user already exits');
        }else{
            const hashedPassword =  await bcrypt.hash(password, 10);
            const newUserId =new  mongoose.Types.ObjectId(); 
            const newUser = new User({ _id: newUserId, name, email, password: hashedPassword });
            const savedUser = await newUser.save();
            return sendHttpResponse(res, 'user created succesfully', savedUser );
        }

    } catch (err) {
        console.error(
            'err --------------------- user.controller.js-------singup',
            'Email already registered',
            err
        )
    }
}

export const getUser = async (obj) => {
    console.log('Querying for user with:', obj);
    const user = await User.findOne(obj);
    console.log('User found:', user);
    return user;
}
