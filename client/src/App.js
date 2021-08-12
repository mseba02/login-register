import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Header from "./components/header/header";
import AuthHandler from "./user/auth";
import NotFound from "./components/404/notfound";
import ActivateAccount from "./components/activate-account/activate-account";
import Login from "./user/login";

import './App.css';

// app
function App() {
    return (
        <Router>
            <div className="App position-relative">
                <Header />
                <Switch>
                    <Route path="/" exact>
                        <AuthHandler />
                    </Route>
                    <Route path="/activate">
                        <ActivateAccount/>
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>

                    {/* 404 */}
                    <Route path="*">
                        <NotFound />
                    </Route>


                </Switch>
            </div>
        </Router>
    )
}

// export app
export default App;
