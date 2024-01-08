/* eslint-disable prettier/prettier */
import pkg from 'express-validation';
const { Joi, query } = pkg;



export const validation = {
  login: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        'string.empty': 'Email is required!',
        'string.email': 'Please provide a valid email!'
      }),
      password: Joi.string().min(8).max(20).required().messages({
        'string.empty': 'Password is required!',
        'string.min': 'Password should be between 8-20 characters',
        'string.max': 'Password should be between 8-20 characters'
      })
    })
  },

  signup: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        'string.empty': 'Email is required!',
        'string.email': 'Please provide a valid email!'
      }),
      password: Joi.string().min(8).max(20).required().messages({
        'string.empty': 'Password is required!',
        'string.min': 'Password should be between 8-20 characters',
        'string.max': 'Password should be between 8-20 characters'
      }),
      firstname: Joi.string().required().messages({
        'string.empty': 'Name is required!'
      }),
      lastname: Joi.string().required().messages({
        'string.empty': 'Name is required!'
      })
    })
  },
  role: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        'string.empty': 'Email is required!',
        'string.email': 'Please provide a valid email!'
      }),
      role: Joi.string().valid('admin', 'user').required(),
    })
  },
  book : {
    body : Joi.object({
      title: Joi.string().required().min(3).message({
        'string.empty' : 'Title is required',
        'string.min': 'minimum 3 words required'
      }),
      author : Joi.string().required().min(5).message({
        'string.empty' : 'author name is required',
        'string.min': 'author name at least required 5 characters'
      }),
      description : Joi.string().required().min(10).message({
        'string.empty' : 'description is required',
        'string.min': 'description should be required 10 character'
      })
    })
  },
  search: {
    query: Joi.object({
      title: Joi.string()
        .required()
        .min(3)
        .messages({
          'string.empty': 'Title is required',
          'string.min': 'minimum 3 words required',
        }),
    }),
  },
};

