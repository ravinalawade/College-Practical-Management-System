const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

var student = mongoose.model('Student');
var teacher= mongoose.model('Teacher');

passport.use(
    new localStrategy({ usernameField: 'login' },
        (username, password, done) => {
            student.findOne({ student_id: username },
                (err, user) => {
                    if (err)
                        return done(err);
                    // unknown user
                    else if (!user)
                    {   var t =teacher.findOne({ teacher_id : username },
                        (err, user) => {
                            if (err)
                                return done(err);
                            else if (!user)
                                return done(null, false, { message: 'Email is not registered' });
                            else if (!user.verifyPassword(password))
                                return done(null, false, { message: 'Wrong password.' });
                            else
                                return done(null, user);

                        });
                        return t;
                    }
                    // wrong password
                    else if (!user.verifyPassword(password))
                        return done(null, false, { message: 'Wrong password.' });
                    // authentication succeeded
                    else
                        return done(null, user);
                });
        })
);