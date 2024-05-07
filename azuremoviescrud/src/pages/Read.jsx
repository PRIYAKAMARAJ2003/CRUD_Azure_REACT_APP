import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Typography, Button, TextField, Grid, IconButton, makeStyles, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Person as PersonIcon, Email as EmailIcon, Chat as ChatIcon } from '@material-ui/icons';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(3),
    width: '80%',
  },
  title: {
    marginBottom: theme.spacing(2),
    color: '#3f51b5',
  },
  table: {
    minWidth: 650,
  },
  pagination: {
    marginTop: theme.spacing(2),
  },
  form: {
    marginBottom: theme.spacing(2),
  },
}));

function Read() {
    const classes = useStyles();
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(3); // Number of movies per page
    const [editMovieId, setEditMovieId] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    useEffect(() => {
        fetchMovies();
    }, [page]);

    const fetchMovies = async () => {
        try {
            const response = await fetch('https://us-central1-ep43moviecrud.cloudfunctions.net/ep43moviescrudfunc');
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            const data = await response.json();
            setMovies(data.movies);
        } catch (error) {
            console.error(error);
        }
    };

    // Calculate indexes for pagination
    const indexOfLastMovie = page * rowsPerPage;
    const indexOfFirstMovie = indexOfLastMovie - rowsPerPage;
    const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleUpdate = async (movie) => {
        try {
            const response = await axios.put(`https://us-central1-ep43moviecrud.cloudfunctions.net/ep43moviescrudfunc/${movie.id}`, {
                id: movie.id,
                firstName: movie.firstName,
                lastName: movie.lastName,
                email: movie.email,
                comments: movie.comments
            });
            console.log(response.data);
            // Refresh movies after update
            fetchMovies();
            setEditMovieId(null); // Close the edit form
            setDialogMessage('Movie updated successfully');
            setDialogOpen(true);
        } catch (error) {
            console.error(error);
            setDialogMessage('Failed to update movie');
            setDialogOpen(true);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://us-central1-ep43moviecrud.cloudfunctions.net/ep43moviescrudfunc/${id}`, {
                data: {
                    id: id
                }
            });
            // Refresh movies after deletion
            fetchMovies();
            setDialogMessage('Movie deleted successfully');
            setDialogOpen(true);
        } catch (error) {
            console.error(error);
            setDialogMessage('Failed to delete movie');
            setDialogOpen(true);
        }
    };

    const handleEdit = (id) => {
        setEditMovieId(id);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <div className={classes.root}>
            <Container maxWidth="md">
                <Typography variant="h4" className={classes.title} gutterBottom>View Movies</Typography>
                <TableContainer component={Paper}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Comments</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentMovies.map((movie) => (
                                <TableRow key={movie.id}>
                                    <TableCell>{movie.firstName}</TableCell>
                                    <TableCell>{movie.lastName}</TableCell>
                                    <TableCell>{movie.email}</TableCell>
                                    <TableCell>{movie.comments}</TableCell>
                                    <TableCell>
                                        {editMovieId === movie.id ? (
                                            <EditForm movie={movie} handleUpdate={handleUpdate} />
                                        ) : (
                                            <>
                                                <IconButton aria-label="edit" onClick={() => handleEdit(movie.id)}>
                                                    <EditIcon style={{ color: '#3f51b5' }} />
                                                </IconButton>
                                                <IconButton aria-label="delete" onClick={() => handleDelete(movie.id)}>
                                                    <DeleteIcon style={{ color: '#f50057' }} />
                                                </IconButton>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Pagination
                    count={Math.ceil(movies.length / rowsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    className={classes.pagination}
                    size="large"
                />
            </Container>
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Movie Action Status</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMessage}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const EditForm = ({ movie, handleUpdate }) => {
    const classes = useStyles();
    const [editedMovie, setEditedMovie] = useState(movie);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedMovie({ ...editedMovie, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdate(editedMovie);
    };

    return (
        <form onSubmit={handleSubmit} className={classes.form}>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <TextField name="firstName" label="First Name" value={editedMovie.firstName} onChange={handleChange} />
                </Grid>
                <Grid item>
                    <TextField name="lastName" label="Last Name" value={editedMovie.lastName} onChange={handleChange} />
                </Grid>
                <Grid item>
                    <TextField name="email" label="Email" value={editedMovie.email} onChange={handleChange} />
                </Grid>
                <Grid item>
                    <TextField name="comments" label="Comments" value={editedMovie.comments} onChange={handleChange} />
                </Grid>
                <Grid item>
                    <Button type="submit" variant="contained" color="primary">
                        Update
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default Read;
