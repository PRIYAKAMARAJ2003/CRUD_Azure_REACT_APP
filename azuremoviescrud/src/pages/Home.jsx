import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Typography, makeStyles } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DescriptionIcon from '@material-ui/icons/Description';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h2" align="center">
        Home
      </Typography>
      <Grid container spacing={2} justify="center" className={classes.button}>
        <Grid item>
          <Link to="/create" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CreateIcon />}
            >
              Create
            </Button>
          </Link>
        </Grid>
        <Grid item>
          <Link to="/read" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DescriptionIcon />}
            >
              Read
            </Button>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
