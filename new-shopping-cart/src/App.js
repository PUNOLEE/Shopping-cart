import React, { Component } from "react";
import "./App.scss";
import ViewCard from "./components/card/card.js";
import Bag from "./components/bag/bag";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import BagIcon from "@material-ui/icons/ShoppingBasket";
import Popover from "@material-ui/core/Popover";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import {updateBag} from './services/actions';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      anchorEl: null
    };
  }

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
    this.props.updateBag(this.props.items,false);
  };

  componentDidMount() {
    import("./products.json").then(json => {
      this.setState({ products: json.products });
    });
  }

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl)|| this.props.show;

    return (
      <div className="App">
        <div className="App-header">
          <IconButton
            aria-owns={open ? "simple-popper" : undefined}
            aria-label="bag"
            onClick={this.handleClick}
            color="primary"
          >
            <BagIcon />
          </IconButton>
        </div>

        <Grid container spacing={24}>
          {this.state.products.map(product => (
            <Grid item xs={3}>
              <ViewCard product={product} />
            </Grid>
          ))}
        </Grid>
        <Popover
          id="simple-popper"
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          <Bag />
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { items: state.bagReducer.items, show: state.bagReducer.show };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateBag,
  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
