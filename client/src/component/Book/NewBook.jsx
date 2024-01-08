import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Menu from '../Header/Menu';
import { AccountContext } from '../../context/accountProvider';
import { addBook } from '../../services/api.js';

const defaultTheme = createTheme();

export default function AddNewBook() {
  const { account } = useContext(AccountContext);
  const history = useHistory();
  const [titleError, setTitleError] = useState('');
  const [authorError, setAuthorError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const title = data.get('bookName');
    const author = data.get('authorName');
    const description = data.get('description');

    // Title validation
    if (!title || title.length < 3) {
      setTitleError('Title must be at least 3 characters long.');
      return;
    } else {
      setTitleError('');
    }

    // Author validation
    if (!author || author.length < 5) {
      setAuthorError('Author name must be at least 5 characters long.');
      return;
    } else {
      setAuthorError('');
    }

    // Description validation
    if (!description || description.length < 10) {
      setDescriptionError('Description must be at least 10 characters long.');
      return;
    } else {
      setDescriptionError('');
    }

    // If all validation passes, proceed with form submission
    const bookData = {
      title,
      author,
      description,
    };
    await addBook(bookData, account);
    history.push('/');
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Menu />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          style={{ background: '#f4f4f4', padding: 20 }}
        >
          <Typography component="h1" variant="h5" style={{ color: '#919191' }}>
            Add a new Book
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="given-name"
                  name="bookName"
                  required
                  fullWidth
                  id="bookName"
                  label="Book Name"
                  autoFocus
                  error={Boolean(titleError)}
                  helperText={titleError}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  id="authorName"
                  label="Author Name"
                  name="authorName"
                  autoComplete="author-name"
                  error={Boolean(authorError)}
                  helperText={authorError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  maxRows={5}
                  id="description"
                  label="Description"
                  name="description"
                  error={Boolean(descriptionError)}
                  helperText={descriptionError}
                />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Add this book
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
