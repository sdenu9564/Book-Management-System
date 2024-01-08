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
  styled,
} from "@mui/material";
import Menu from "../Header/Menu.jsx";
import { AccountContext } from "../../context/accountProvider.jsx";
import { getBooksbyUserId } from "../../services/api.js";

const TableSize = styled(Box)`
  width: 90%;
  position: relative;
  top: 75px;
`;

export default function MyLibary() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { account } = useContext(AccountContext);
  const history = useHistory();
  const [bookData, setBookData] = useState([]);
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (!account) {
          history.push("/login");
        } else {
          const data = await getBooksbyUserId(account);
          console.log(data,'----------------')
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
  }, [history, account]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box style={{ display: "flex" }}>
      <Box>
        <Menu />
      </Box>
      <TableSize>
        <Paper sx={{ width: "100%" }}>
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
                  <TableCell
                    align="right"
                    style={{ minWidth: 50 }}
                    format={(value) => value.toLocaleString("en-US")}
                  >
                    Type
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
                        {row.publish ? "Published" : "Unpublished"}
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
    </Box>
  );
}
