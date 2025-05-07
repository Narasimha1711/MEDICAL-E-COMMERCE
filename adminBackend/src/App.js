import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import ProductList from "./pages/productList/ProductList";

import NewProduct from "./pages/newProduct/NewProduct";
import SellerList from "./pages/sellerList/SellerList";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Router>
        <Route exact path="/logout">
          <Login />
        </Route>
      </Router>

      <Router>
        {/* <Route exact path="/logout">
          <Login />
        </Route> */}
        <Topbar />
        <div className="container">
          <Sidebar />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/users">
              <UserList />
            </Route>
            {/* <Route path="/sellers">
            <SellerList />
          </Route> */}
            <Route path="/user/:userId">
              <User />
            </Route>
            <Route path="/newUser">
              <NewUser />
            </Route>
            <Route path="/products">
              <ProductList />
            </Route>

            <Route path="/seller">
              <SellerList />
            </Route>

            {/* <Route path="/product/:productId">
            <Product />
          </Route> */}
            <Route path="/newproduct">
              <NewProduct />
            </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
