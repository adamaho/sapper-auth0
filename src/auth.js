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
  res.redirect("https://dev-7bta6vwu.auth0.com/v2/logout?client_id=p0aDg38DESUStKi2UhrruLoluGr4hHPr");
});

export default router;