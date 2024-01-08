import fs from 'fs';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { getUser } from '../controller/user.controller.js';
import { sendHttpResponse } from '../utils/createResponse.js';

const localOpts = { usernameField: 'email' };
const privateKey = fs.readFileSync('private_key.pem', 'utf8');

const localAuthentication = new LocalStrategy(localOpts, async (email, password, done) => {
  try {
    const user = await getUser({ email });
    if (!user) {
      return done({ message: 'Email provided does not exist' }, false);
    }
    if (!user.authenticateUser(password)) {
      return done({ message: 'Password Does Not Match' }, false);
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: privateKey,
  issuer: 'Sourav',
  algorithm: ['RS256'],
};

const jwtAuthentication = new JWTStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await getUser({ _id: payload.aud });
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

passport.use(localAuthentication);
passport.use(jwtAuthentication);

export const authLocal = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err) {
      return sendHttpResponse(res, err.message, {}, 400, false);
    }
    return req.login(user, (error) => {
      if (error) {
        console.error(error);
        return sendHttpResponse(res, 'Failed to login, try again', {}, 500, false);
      }
      return next(null, user);
    });
  })(req, res, next);
};

export const authJwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user) => {
    if (err) {
      return sendHttpResponse(res, 'Failed to login, try again', {}, 500, false);
    }
    if (!user) {
      return sendHttpResponse(res, 'Please Login to move forward', {}, 401, false);
    }
    req.user = user;
    return next();
  })(req, res, next);
};

export const checkUser = async (req, res) => {
  try {
    const user = await getUser({ email: req.body.email });
    if (!user) {
      return sendHttpResponse(res, 'Email provided does not exist', {}, 400, false);
    }
    return sendHttpResponse(res, 'Success', {}, 200, true);
  } catch (err) {
    return sendHttpResponse(res, err.message, {}, 500, false);
  }
};

export const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return [
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        return sendHttpResponse(res, 'You are not authorized to use this resource', {}, 401, false);
      }
      return next();
    },
  ];
};
