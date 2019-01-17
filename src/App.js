import React, { Component } from "react";
import "./App.scss";
import ViewCard from "./components/card/card.js";
import Bag from "./components/bag/bag";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import BagIcon from "@material-ui/icons/ShoppingBasket";
import AccountIcon from "@material-ui/icons/AccountCircle";
import Popover from "@material-ui/core/Popover";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateBag } from "./services/actions";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import Badge from "@material-ui/core/Badge";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import firebase from "./services/firebase.js";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

var provider = new firebase.auth.GoogleAuthProvider();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isUpdated: false,
      products: [],
      allproducts: [],
      anchorEl: null,
      sizes: ["XS", "S", "M", "ML", "L", "XL", "XXL"],
      color: [
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default"
      ],
      clicked: [],
      open: false,
      bag: [],
      userexist: false
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      open: false
    });
    this.props.updateBag(this.props.items, false);
  };

  readUserData() {
    var userid = firebase.auth().currentUser.uid;
    return new Promise(function(resolve, reject) {
      firebase
        .database()
        .ref("/users/" + userid)
        .once("value")
        .then(snapshot => {
          var bag = [];
          if (snapshot.val().bag !== undefined)
            snapshot.val().bag.forEach(i => bag.push(i));
          resolve(bag);
        });
    });
  }

  authUser() {
    return new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          resolve(user);
        } else {
          reject("User not logged in");
        }
      });
    });
  }

  componentDidMount() {
    import("./products.json").then(json => {
      this.setState({ products: json.products, allproducts: json.products });
    });
    this.authUser().then(
      user => {
        this.readUserData().then(bag => this.props.updateBag(bag, false));
      },
      error => {}
    );
  }

  handleFilterClick = (size, index) => event => {
    let newcolor = this.state.color;
    let ps = this.state.products;
    if (this.state.clicked.some(c => c === size)) {
      newcolor[index] = "default";
      let sindex = this.state.clicked.indexOf(size);
      this.state.clicked.splice(sindex, 1);
    } else {
      newcolor[index] = "secondary";
      this.state.clicked.push(size);
    }
    this.setState({
      color: newcolor
    });

    if (this.state.clicked.length !== 0) {
      ps = this.state.allproducts.filter(p =>
        p.availableSizes.some(s => this.state.clicked.some(c => c === s))
      );
    } else {
      ps = this.state.allproducts;
    }
    this.setState({ products: ps });
  };

  calculateNumber = () => {
    let num = 0;
    if (this.props.items.length !== 0) {
      this.props.items.forEach(item => {
        num += item.quantity;
      });
    }
    return num;
  };

  authSignIn() {
    return new Promise(function(resolve, reject) {
      firebase.auth().signInWithPopup(provider).then(function(result) {
        if (result.user) {
          resolve(result.user);
        } else {
          reject("User not logged in");
        }
      });
    });
  }
  signInNUp = () => {
    this.authSignIn().then(user => {
      firebase
      .database()
      .ref("users/" + user.uid)
      .update({
        username: user.displayName,
        email: user.email
      });
      this.readUserData().then(bag => {
        console.log(bag);
        this.props.updateBag(bag, false)
      } );
    })
    this.setState({ open: false });
  };

  signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.

        alert("Sign Out Successfully!");
      })
      .catch(function(error) {
        // An error happened.
      });
    this.setState({ open: false });
    var bag = [];
    this.props.updateBag(bag, false);
  };

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl) || this.props.show;

    return (
      <div className="App">
        <div className="App-header">
          <Paper className="App-paper">
            {this.state.sizes.map((size, index) => {
              return (
                <Chip
                  key={index}
                  label={size}
                  className="App-chip"
                  onClick={this.handleFilterClick(size, index)}
                  variant="default"
                  color={this.state.color[index]}
                />
              );
            })}
          </Paper>
          <div>
            <div className="App-icon">
              <IconButton
                aria-owns={open ? "simple-popper" : undefined}
                aria-label="bag"
                onClick={this.handleClick}
                color="primary"
              >
                <Badge badgeContent={this.calculateNumber()} color="secondary">
                  <BagIcon />
                </Badge>
              </IconButton>
            </div>
            <div className="App-icon">
              <IconButton color="primary" onClick={this.handleClickOpen}>
                <AccountIcon />
              </IconButton>
            </div>
          </div>
        </div>
        <div className="App-counter">
          {this.state.products.length} Product(s) found.
        </div>
        <Grid container spacing={24}>
          {this.state.products.map((product, index) => (
            <Grid item xs={3} key={index}>
              <ViewCard product={product} key={product.id} />
            </Grid>
          ))}
        </Grid>
        <Popover
          id="simple-popper"
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
        >
          <Bag />
        </Popover>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle id="draggable-dialog-title">User</DialogTitle>
          <DialogContent>
            {firebase.auth().currentUser != null ? (
              <div className="User-info">
                <Avatar
                  alt={firebase.auth().currentUser.displayName}
                  src={firebase.auth().currentUser.photoURL}
                />
                <Typography component={"span"} className="User-info-name">
                  {firebase.auth().currentUser.displayName}
                </Typography>
              </div>
            ) : (
              <DialogContentText />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            {firebase.auth().currentUser == null ? (
              <Button onClick={this.signInNUp} color="primary">
                Sign In
              </Button>
            ) : (
              <Button onClick={this.signOut} color="primary">
                Sign Out
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { items: state.bagReducer.items, show: state.bagReducer.show };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateBag
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
