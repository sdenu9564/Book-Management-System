import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import SignUp from './component/singup';
import SignInSide from './component/login';
import AddNewBook from './component/Book/NewBook';
import ColumnGroupingTable from './component/Book/BooksLIst';
import MyLibary from './component/Book/MyLibary';
import AccountProvider,{AccountContext} from './context/accountProvider';


const PrivateRoute = ({ children, ...rest }) => {
  const {account} = useContext(AccountContext)

  return (
    <Route
      {...rest}
      render={({ location }) =>
        account ? (
          children
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        )
      }
    />
  );
}; 


function App() {


  return (
    <Router>
      <AccountProvider>
        <Switch>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/login">
            <SignInSide />
          </Route>
          <PrivateRoute path="/add-book">
            <AddNewBook />
          </PrivateRoute>
          <PrivateRoute exact path="/">
            <ColumnGroupingTable />
          </PrivateRoute>
          <PrivateRoute path="/my-libary">
            <MyLibary />
          </PrivateRoute>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </AccountProvider>
    </Router>
  );
}

export default App;