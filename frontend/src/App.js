import React from "react";
import { Switch, Route } from "react-router-dom";

import Navbar from "./components/navbar.component"
import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";



function App() { 
    return (
      <div>
        
        
          <Navbar/>
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/user" component={BoardUser} />
            <Route path="/mod" component={BoardModerator} />
            <Route path="/admin" component={BoardAdmin} />
          </Switch>
        

        { /*<AuthVerify logOut={this.logOut}/> */ }
      </div>
    );
}
  


export default App;
    

