import express from 'express';
import passport from 'passport';

const router = express.Router();

// Perform the login, after login Auth0 will redirect to callback
router.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile'
}), function (req, res) {
  res.redirect('/');
});

// Perform the final stage of authentication and redirect to previously requested url
router.get('/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect('/auth/login');
    }

    // record the user in the current session
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      const returnTo = req.session.originalUrl;

      req.session.originalUrl = '';

      res.redirect(301, returnTo || '/app');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();

  const { AUTH0_DOMAIN, AUTH0_CLIENT_ID } = process.env;
  res.redirect(`https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}`);
});

export default router;