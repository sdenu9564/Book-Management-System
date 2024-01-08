import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  styled,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import Menu from "../Header/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import { AccountContext } from "../../context/accountProvider";
import { getAllBooks, unPublished,searchbyTitle } from "../../services/api.js";


const TableSize = styled(Box)`
  width: 90%;
  position: relative;
  top: 75px;
`;

export default function ColumnGroupingTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const { account } = useContext(AccountContext);
  const history = useHistory();
  const [bookData, setBookData] = useState([]);
  const [unPublish, setUnPublish] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    bookId: null,
  });

  const handleOpenDeleteConfirmation = (bookId) => {
    setDeleteConfirmation({ open: true, bookId });
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmation({ open: false, bookId: null });
  };

  const handleDeleteConfirmed = async () => {
    try {
      const bookId = deleteConfirmation.bookId;
      console.log(`Deleting book with ID: ${bookId}`);
      await unPublished(bookId, account);
      setUnPublish((prev) => !prev);
    } catch (error) {
      console.error("Error during delete:", error);
    } finally {
      handleCloseDeleteConfirmation();
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (!account) {
          history.push("/login");
        } else {
          const data = await getAllBooks(account);
          if (isMounted) {
            setBookData(data?.data || []);
          }
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [history, account, unPublish]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearch = async () => {
    try {
      const results = await searchbyTitle(searchQuery, account);
      console.log(results,'-----------------');
      setBookData(results?.data || []);
    } catch (error) {
      console.error("Error searching books:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box style={{ display: "flex" }}>
      <Box>
        <Menu />
      </Box>
      <TableSize>
        <Paper sx={{ width: "100%" }}>
          <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <TextField
              id="search"
              label="Search"
              variant="standard"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </Box>
          <TableContainer sx={{ maxHeight: "100%" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" style={{ minWidth: 100 }}>
                    Title
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: 100 }}>
                    Author
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ minWidth: 200 }}
                    format={(value) => value.toLocaleString("en-US")}
                  >
                    Description
                  </TableCell>
                  <TableCell align="right" style={{ minWidth: 50 }}>
                    UnPublish
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      role="checkTableSize"
                      tabIndex={-1}
                      key={row._id}
                    >
                      <TableCell align="left">{row.title}</TableCell>
                      <TableCell align="left">{row.author}</TableCell>
                      <TableCell align="right">{row.description}</TableCell>
                      <TableCell align="right">
                        {account?.id === row?.userId && (
                          <IconButton
                            onClick={() =>
                              handleOpenDeleteConfirmation(row._id)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={bookData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </TableSize>
      <Dialog
        open={deleteConfirmation.open}
        onClose={handleCloseDeleteConfirmation}
      >
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to unpublish this book?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation}>Cancel</Button>
          <Button onClick={handleDeleteConfirmed} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
