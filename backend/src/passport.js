const passport = require('passport');
let FortyTwoStrategy;
try {
  // require only if installed; passport-42 is not on npm in some environments
  // so this will fail gracefully if it's not present
  FortyTwoStrategy = require('passport-42').Strategy;
} catch (err) {
  FortyTwoStrategy = null;
}
const { User } = require('./models');

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

if (FortyTwoStrategy && process.env.FORTY_TWO_CLIENT_ID && process.env.FORTY_TWO_CLIENT_SECRET) {
  passport.use(new FortyTwoStrategy({
    clientID: process.env.FORTY_TWO_CLIENT_ID,
    clientSecret: process.env.FORTY_TWO_CLIENT_SECRET,
    callbackURL: process.env.FORTY_TWO_CALLBACK_URL || 'http://localhost:3000/api/auth/42/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const [user] = await User.findOrCreate({
        where: { forty_two_id: profile.id },
        defaults: {
          username: profile.username,
          last_post_timestamp: null
        }
      });
      return done(null, user);
    } catch (err) {
      console.error('42 Strategy verification error:', err);
      return done(err);
    }
  }));
  console.log('42 OAuth strategy configured successfully');
} else {
  if (!FortyTwoStrategy) {
    console.warn('passport-42 is not installed; 42 OAuth strategy will be disabled.');
  } else {
    console.warn('42 OAuth environment variables not set (FORTY_TWO_CLIENT_ID, FORTY_TWO_CLIENT_SECRET). Strategy disabled.');
  }
}

module.exports = passport;
