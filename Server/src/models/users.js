import mongoose from "mongoose";
import  jwt  from "jsonwebtoken";
import bcrypt from 'bcrypt';
import constants from '../config/constans.js';
import fs from 'fs';


const privateKey = fs.readFileSync('private_key.pem', 'utf8');


const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name :{
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true,
        default : 'user'
    }
});


userSchema.methods.authenticateUser = function (password) {
    return bcrypt.compareSync(password, this.password);
};
userSchema.methods.createToken = function () {
    return jwt.sign(
      {
        email: this.email,
      },
      privateKey,
      {
        issuer: 'Sourav',
        audience: `${this._id}`,
        expiresIn: constants.JWT_EXPIRATION,
        algorithm: 'RS256'
      }
    );
};
userSchema.methods.toAuthJSON = function () {
    return `Bearer ${this.createToken()}`;
};

const User = mongoose.model('user',userSchema);


export default User;