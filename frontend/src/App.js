import { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./components/Home";
import ProductDetails from "./components/product/productDetails";
import { HelmetProvider } from "react-helmet-async";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import { loadUser } from "./actions/userActions";
import store from "./store";

import "./App.scss";

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  const helmetContext = {};
  return (
    <HelmetProvider context={helmetContext}>
      <div className="App">
        <Router>
          <Header />
          <div className="container container-fluid">
            <Route path="/search/:keyword" component={Home} />
            <Route path="/product/:id" component={ProductDetails} exact />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/" component={Home} exact />
          </div>
          <Footer />
        </Router>
      </div>
    </HelmetProvider>
  );
};

export default App;
