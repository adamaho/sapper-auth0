import http from 'http'
import sirv from 'sirv';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import Auth0Strategy from 'passport-auth0';
import authRouter from './auth';
import compression from 'compression';
import * as sapper from '@sapper/server';
import { config } from 'dotenv';

config();

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

// instantiate the express application
const app = express();

app.use(cookieParser());

// config express-session
var sess = {
  secret: 'CHANGE THIS TO A RANDOM SECRET',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  // Use secure cookies in production (requires SSL/TLS)
  sess.cookie.secure = true;

  // Uncomment the line below if your application is behind a proxy (like on Heroku)
  // or if you're encountering the error message:
  // "Unable to verify authorization request state"
  // app.set('trust proxy', 1);
}

app.use(session(sess));

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/auth/callback'
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
		// profile has all the information from the user
    return done(null, { profile, accessToken, idToken: extraParams.id_token });
  }
);

// tell passport what its configuration is
passport.use(strategy);

// init passport
app.use(passport.initialize());
app.use(passport.session());

// Serilizes the user object into the stuff we care about from auth0
passport.serializeUser(function ({ idToken, accessToken, profile: { user_id, _json } }, done) {
	done(null, {
		user_id,
		email: _json.email,
		email_verified: _json.email_verified,
		accessToken,
		idToken
	});
});

// Deserializes user from session
passport.deserializeUser(function (user, done) {
	done(null, user);
});

// configure routers
app.use('/auth', authRouter);

// configure sapper
app.use(compression({ threshold: 0 }));
app.use(sirv('static', { dev }));
app.use(sapper.middleware({
	session: (req) => {
		// record the entry point for the session
		if (!req.session.originalUrl) {
			req.session.originalUrl = req.path;
		}
		return {
			user: req.user
		};
	}
}));

const server = http.createServer(app);

server.listen(PORT, err => {
	if (err) console.log('error', err);
});

