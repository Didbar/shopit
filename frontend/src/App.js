import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./components/Home";
import { HelmetProvider } from "react-helmet-async";

import "./App.css";

const App = () => {
  const helmetContext = {};
  return (
    <HelmetProvider context={helmetContext}>
      <div className="App">
        <Header />
        <Router>
          <div className="container container-fluid">
            <Route path="/" component={Home} exact />
          </div>
        </Router>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default App;
