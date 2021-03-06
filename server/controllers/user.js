const User = require('../db/User');
const Bcrypt = require('bcryptjs');

module.exports = {
  findOneUser: async (req, res, next) => {
    try {
      const foundUser = await User.findOne({
        username: req.params.username,
      });
      res.json(foundUser);
    } catch (err) {
      next(err);
    }
  },

  bulkUpdateUser: async (req, res, next) => {
    try {
      await User.findOneAndUpdate({ username: req.params.username }, req.body);
      const updated = await User.findOne({ username: req.params.username });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const update = req.body;
      const { username } = req.body;
      const foundUser = await User.findOneAndUpdate({ username }, update, {
        upsert: true,
        runValidators: true,
      });
      await foundUser.save();
      const updatedUser = await User.findOne({ username });
      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  },
  updatePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const username = req.params.username;
      const foundUser = await User.findOne({ username });
      if (Bcrypt.compareSync(oldPassword, foundUser.password)) {
        foundUser.password = Bcrypt.hashSync(newPassword, 10);
        await foundUser.save();
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (e) {
      next(e);
    }
  },
  updateUser: async (req, res, next) => {
    try {
      const {
        date,
        username,
        financeUpdate,
        financeIdx,
        symptomUpdate,
        symptomsIdx,
        flowUpdate,
        flowIdx,
      } = req.body;
      const foundUser = await User.findOne({ username: req.params.username });
      if (financeIdx) {
        if (financeUpdate.length) {
          foundUser.financial[financeIdx].purchases = financeUpdate;
        } else {
          foundUser.financial.splice(financeIdx, 1);
        }
      } else if (financeUpdate.length) {
        const financeObj = {
          date,
          purchases: financeUpdate,
        };
        User.updateOne(
          {
            _id: foundUser._id,
          },
          {
            $push: {
              financial: financeObj,
            },
          }
        ).exec();
      }
      if (symptomsIdx) {
        if (symptomUpdate.length) {
          foundUser.symptomTags[symptomsIdx].symptoms = symptomUpdate;
        } else {
          foundUser.symptomTags.splice(symptomsIdx, 1);
        }
      } else if (symptomUpdate.length) {
        const symptomsObj = {
          date,
          symptoms: symptomUpdate,
        };
        User.updateOne(
          {
            _id: foundUser._id,
          },
          {
            $push: {
              symptomTags: symptomsObj,
            },
          }
        ).exec();
      }
      if (flowIdx) {
        if (flowUpdate !== undefined) {
          foundUser.period[flowIdx].typeOfFlow = flowUpdate;
        } else {
          foundUser.period.splice(flowIdx, 1);
        }
      } else if (flowUpdate) {
        const periodObj = {
          date,
          typeOfFlow: flowUpdate,
        };
        User.updateOne(
          {
            _id: foundUser._id,
          },
          {
            $push: {
              period: periodObj,
            },
          }
        ).exec();
      }
      await foundUser.save();
      const updatedUser = await User.findOne({
        username: req.params.username,
      });
      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  },

  updateViews: async (req, res, next) => {
    try {
      const { name, bool } = req.body;
      const username = req.params.username;
      const update = {};
      if (name === 'period') update.periodTracking = bool;
      if (name === 'symptom') update.symptomTracking = bool;
      if (name === 'finance') update.financialTracking = bool;
      const foundUser = await User.findOneAndUpdate({ username }, update, {
        upsert: true,
        runValidators: true,
      });
      await foundUser.save();
      const updatedUser = await User.findOne({ username });
      res.json(updatedUser);
    } catch (e) {
      next(e);
    }
  },

  //login?
  loginUser: async (req, res, next) => {
    const authUser = await User.findOne({
      email: req.body.email,
    });

    try {
      if (!authUser) {
        res.sendStatus(403);
      } else if (!Bcrypt.compareSync(req.body.password, authUser.password)) {
        res.sendStatus(400);
      } else {
        req.login(authUser, (err) => (err ? next(err) : res.json(authUser)));
      }
    } catch (err) {
      next(err);
    }
  },

  //signup?
  signUpUser: async (req, res, next) => {
    let {
      name,
      email,
      username,
      password,
      pronouns,
      avgLengthOfCycle,
    } = req.body;

    try {
      password = Bcrypt.hashSync(password, 10);
      const newUser = new User({
        name,
        email,
        username,
        password,
        pronouns,
        avgLengthOfCycle,
      });

      await newUser.save();
      res.json(newUser);
    } catch (err) {
      if (err.keyPattern.username) {
        err.status = 435;
      } else if (err.keyPattern.email) {
        err.status = 437;
      }
      next(err);
    }
  },

  authMe: async (req, res, next) => {
    res.json(req.user);
  },
  logoutUser: async (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
  },
};
