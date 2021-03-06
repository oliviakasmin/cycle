import React, { useState } from 'react';
import { connect } from 'react-redux';
import ProfileUpdate from '../forms/ProfileUpdate';
import PasswordUpdate from '../forms/PasswordUpdate';
import UserSwitch from '../forms/UserSwitches';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import {
  Dialog,
  DialogContent,
  Grid,
  Button,
  makeStyles,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { logout } from '../store';

const UserProfile = (props) => {
  const { user, message } = props;
  const [open, setOpen] = useState(false);
  const [openPW, setOpenPW] = useState(false);
  const [scroll, setScroll] = React.useState('paper');
  const classes = useStyles();

  const dispatch = useDispatch()

  const handleClose = () => {
    setOpen(false);
  };

  const handleClosePW = () => {
    setOpenPW(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    props.history.push('/');
    handleClose();
  };

  return (
    <Grid
      container
      alignItems="center"
      direction="column"
      className={classes.root}
    >
      <Typography variant="h4">
        Hi, {user.name[0].toUpperCase()}
        {user.name.slice(1)}
      </Typography>
      <br />
      <Typography variant="h6">Currently Tracking</Typography>
      <Grid container direction="row" justify="center">
        <UserSwitch user={user} />
      </Grid>
      <br />
      <Typography variant="h6">Profile Information</Typography>
      <Typography variant="body2">Email: {user.email}</Typography>
      <Typography variant="body2">Username: {user.username}</Typography>
      <Typography variant="body2">Pronouns: {user.pronouns}</Typography>
      <Typography variant="body2">
        Average Cycle Length: {user.avgLengthOfCycle} days
      </Typography>
      <Grid
        container
        direction="column"
        justify="center"
        className={classes.buttonContainer}
      >
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={() => {
            setOpen(true);
          }}
        >
          update profile info
        </Button>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={() => {
            setOpenPW(true);
          }}
        >
          update password
        </Button>
        <Button variant="outlined" color="primary" className={classes.button} onClick={handleLogout}>Logout</Button>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        classes={classes.dialogBox}
      >
        <DialogContent className={classes.paper}>
          <Button
            color="primary"
            className={classes.button}
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon fontSize={'small'} />
          </Button>
          <ProfileUpdate user={user} message={message} />
        </DialogContent>
      </Dialog>
      {/* dialog for update password */}
      <Dialog
        open={openPW}
        onClose={handleClosePW}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        classes={classes.dialogBox}
      >
        <DialogContent className={classes.paper}>
          <Button
            color="primary"
            className={classes.button}
            onClick={() => {
              setOpenPW(false);
            }}
          >
            <CloseIcon fontSize={'small'} align={'right'} />
          </Button>
          <PasswordUpdate user={user} message={message} />
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: '2em',
  },
  dialogBox: {
    padding: '2em',
  },
  paper: {
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  buttonContainer: {
    margin: '0.5em',
    alignItems: 'center',
    padding: '0.5em'
  },
  button: {
    margin: '0.5em',
    backgroundColor: 'white',
    color: '#545454',
    flexShrink: 3,
    width: '20%',
    '@media(max-width: 1000px)': {
      width: '30%'
    },
    '@media(max-width: 800px)': {
      width: '40%'
    },
    '@media(max-width: 600px)': {
      width: '50%'
    },
    '@media(max-width: 400px)': {
      width: '60%'
    },
  },
}));

const mapState = (state) => {
  return {
    user: state.authUser,
    isLoggedIn: !!state.authUser._id,
    message: state.statusMessage,
  };
};

export default withRouter(connect(mapState)(UserProfile));
