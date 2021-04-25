import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./components/Home";
import ProductDetails from "./components/product/productDetails";

import { HelmetProvider } from "react-helmet-async";

import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";

import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Profile from "./components/user/Profile";
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";

import { loadUser } from "./actions/userActions";
import ProtectedRoute from "./routes/ProtectedRoute";
import store from "./store";

import { axios } from "axios";
import "./App.scss";

const App = () => {
  const [stripeApiKey, setStripeApiKey] = useState("");

  useEffect(() => {
    store.dispatch(loadUser());
    async function getStripeApiKey() {
      const { data } = await axios.get("/api/v1/stripeapi");
      setStripeApiKey(data.stripeApiKey);
    }
    getStripeApiKey();
  }, []);
  const helmetContext = {};
  return (
    <HelmetProvider context={helmetContext}>
      <div className="App">
        <Router>
          <Header />
          <div className="container container-fluid">
            <ProtectedRoute path="/me" component={Profile} exact />
            <ProtectedRoute path="/me/update" component={UpdateProfile} exact />
            <ProtectedRoute
              path="/password/update"
              component={UpdatePassword}
              exact
            />
            <Route path="/cart" component={Cart} exact />
            <ProtectedRoute path="/shipping" component={Shipping} />
            <ProtectedRoute path="/order/confirm" component={ConfirmOrder} />

            <Route path="/search/:keyword" component={Home} />
            <Route path="/product/:id" component={ProductDetails} exact />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/password/forgot" component={ForgotPassword} exact />
            <Route
              path="/password/reset/:token"
              component={NewPassword}
              exact
            />
            <Route path="/" component={Home} exact />
          </div>
          <Footer />
        </Router>
      </div>
    </HelmetProvider>
  );
};

export default App;
