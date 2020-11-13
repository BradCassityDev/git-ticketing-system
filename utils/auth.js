const withAuth = (req, res, next) => {
    if (!req.session.user_id || req.session.user_state_id === 2) {
      res.redirect('/login');
    } else {
      next();
    }
};

module.exports = withAuth;