import axios from 'axios';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

//initial state will be an empty object, state will always be a user
const authUser = {};

//action
const AUTH_USER = 'AUTH_USER';
const LOGOUT_USER = 'LOGOUT_USER';
const UPDATE_PERIOD = 'UPDATE_PERIOD'
const UPDATE_FINANCE = 'UPDATE_FINANCE'

//action creator
const authUserAction = (user) => ({
  type: AUTH_USER,
  user,
});

const logoutUser = () => ({
  type: LOGOUT_USER,
});

const updatePeriod = (user) => ({
  type: UPDATE_PERIOD,
  user
})

const updateFinance = (user) => ({
  type: UPDATE_FINANCE,
  user
})

//thunks
//auth user thunk for login or signup
export const authUserThunk = (user, type) => async (dispatch) => {
  let post;
  if (type === 'signup') {
    const {
      email,
      password,
      username,
      name,
      pronouns,
      avgLengthOfCycle,
    } = user;
    post = {
      email,
      password,
      username,
      name,
      pronouns,
      avgLengthOfCycle: avgLengthOfCycle ? avgLengthOfCycle : 28,
    };
  }
  if (type === 'login') {
    const { email, password } = user;
    post = {
      email,
      password,
    };
  }
  try {
    const { data } = await axios.post(`/auth/${type}`, post);
    console.log('data', data);
    const action = authUserAction(data);
    dispatch(action);
    // history.push('/me')
  } catch (e) {
    console.log(e);
  }
};

export const addPeriodData = (username, periodArr) => {
  return async (dispatch) => {
    try {
      const res = await axios.put(`/api/${username}`, {period: periodArr})
      dispatch(updatePeriod(res.data))
    } catch (e) {
      console.log(e)
    }
  }
}

export const addFiannceData = (username, financeArr) => {
  return async (dispatch) => {
    try {
      const res = await axios.put(`/api/${username}`, {financial: financeArr})
      dispatch(updateFinance(res.data))
    } catch (e) {
      console.log(e)
    }
  }
}


//get user if req.user
export const authMe = () => async (dispatch) => {
  try {
    const { data } = await axios.get('/auth/me');
    const action = authUserAction(data || authUser);
    dispatch(action);
  } catch (e) {
    console.log(e);
  }
};

export const logout = () => async (dispatch) => {
  try {
    await axios.post('/auth/logout');
    dispatch(logoutUser());
  } catch (err) {
    console.error(err);
  }
};

const reducer = (state = authUser, action) => {
  switch (action.type) {
    case AUTH_USER:
      return action.user;
    case LOGOUT_USER:
      return authUser;
    case UPDATE_PERIOD:
      return action.user
    case UPDATE_FINANCE:
      return action.user
    default:
      return state;
  }
};

const middleware = applyMiddleware(
  thunkMiddleware,
  createLogger({ collapsed: true })
);

export default createStore(reducer, middleware);
