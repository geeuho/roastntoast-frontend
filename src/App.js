import React, {Component} from 'react';
import './App.css';
import api from './services/Api';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import NavBar from './components/NavBar';
import Gallery from './containers/Gallery';
import Home from './components/Home';
import ProfilePage from './containers/ProfilePage';
import PostPicture from './components/PostPicture';
import Login from './components/Login';
import SignUp from './components/SignUp';


class App extends Component {
  constructor() {
    super()
    this.state = {
      currentUser: {},
      pictures: [],
      comments: []
    }
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      api.auth.getCurrentUser().then(user => {
        this.setState({currentUser: user });
      });
    };
    api.pictures.getPictures().then( pictures => {
      this.setState({pictures: pictures.data})
      console.log(this.state.pictures)
    }
    )
  };

  handleLogin = json => {
    const currentUser = json;
    localStorage.setItem('token', currentUser.jwt );
    this.setState({ currentUser: {username: currentUser.user.data.attributes.username, id: currentUser.user.data.id }});
    console.log(currentUser)
  }

  handleLogout = () => {
    localStorage.removeItem('token');
    this.setState({ currentUser: {} });
  };
  
  render() {
    return (
      <Router>
      <div className="app">
        <NavBar handleLogout={this.handleLogout} currentUser={this.state.currentUser}/>
        <Route exact path="/" component={Home} />
        <Route exact path="/login"   render={(props) => <Login {...props} handleLogin={this.handleLogin}/>} />
        <Route exact path="/signup"   render={(props) => <SignUp {...props} handleLogin={this.handleLogin}/>} />
        <Route exact path="/gallery" render ={(props) => <Gallery {...props} pictures={this.state.pictures}/>} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/addpicture" component={PostPicture} />
      </div>
    </Router>
    );
  }
}


export default App;
