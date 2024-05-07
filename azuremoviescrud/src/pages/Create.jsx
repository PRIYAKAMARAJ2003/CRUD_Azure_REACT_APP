import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles, Typography } from '@material-ui/core';
import { Add as AddIcon, Person as PersonIcon, Email as EmailIcon, Chat as ChatIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  form: {
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textField: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  dialog: {
    minWidth: '300px',
  },
}));

const Create = () => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    comments: ''
  });
  const [open, setOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    comments: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    let error = '';
    
    if (name === 'firstName' || name === 'lastName') {
      // Only allow alphabets in first name and last name
      if (!/^[a-zA-Z]*$/.test(value)) {
        error = 'Only alphabets are allowed';
      }
    } else if (name === 'comments') {
      // Only allow alphabets and spaces in comments
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        error = 'Only alphabets and spaces are allowed';
      }
    }
    
    setFormData({
      ...formData,
      [name]: newValue
    });
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://us-central1-ep43moviecrud.cloudfunctions.net/ep43moviescrudfunc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setDialogMessage('Movie added successfully');
      } else {
        setDialogMessage('Failed to add movie');
      }
      setOpen(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        comments: ''
      });
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.form}>
        <Typography variant="h4" gutterBottom>
          Add Movie Review
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            className={classes.textField}
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              startAdornment: <PersonIcon />,
            }}
            required
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            className={classes.textField}
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              startAdornment: <PersonIcon />,
            }}
            required
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <TextField
            className={classes.textField}
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              startAdornment: <EmailIcon />,
            }}
            required
          />
          <TextField
            className={classes.textField}
            label="Comments"
            name="comments"
            multiline
            value={formData.comments}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              startAdornment: <ChatIcon />,
            }}
            error={!!errors.comments}
            helperText={errors.comments}
          />
          <Button type="submit" variant="contained" color="primary" className={classes.button} startIcon={<AddIcon />}>
            Add Review
          </Button>
        </form>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.dialog}
      >
        <DialogTitle id="alert-dialog-title">{"Movie Add Status"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Create;
