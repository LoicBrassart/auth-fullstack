const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const { db, jwt_secret } = require('./conf');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'mail',
      passwordField: 'password',
    },
    async (formMail, formPassword, done) => {
      try {
        const [sqlRes] = await db.query(
          `SELECT id, mail, firstname, lastname, password FROM user WHERE mail=?`,
          [formMail]
        );
        if (!sqlRes.length) return done(null, false, 'Wrong username!');
        const { id, mail, firstname, lastname, password } = sqlRes[0];
        const isPasswordOK = bcrypt.compareSync(formPassword, password);
        if (!isPasswordOK) return done(null, false, 'Wrong password!');

        const user = { id, mail, firstname, lastname };
        return done(null, user);
      } catch (e) {
        console.log(e);
        return done(e);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwt_secret,
    },
    (jwtPayload, done) => {
      const user = jwtPayload;
      return done(null, user);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
