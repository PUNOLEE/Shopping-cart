import React, { Component } from "react";
import "./App.scss";
import ViewCard from "./components/card/card.js";
import Bag from "./components/bag/bag";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import BagIcon from "@material-ui/icons/ShoppingBasket";
import Popover from "@material-ui/core/Popover";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateBag } from "./services/actions";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import Badge from "@material-ui/core/Badge";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
      clicked: []
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
    this.props.updateBag(this.props.items, false);
  };

  componentDidMount() {
    import("./products.json").then(json => {
      this.setState({ products: json.products, allproducts: json.products });
    });
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
        </div>
        <div className="App-counter">
          {this.state.products.length} Product(s) found.
        </div>
        <Grid container spacing={24}>
          {this.state.products.map((product,index)=> (
            <Grid item xs={3} key={index}>
              <ViewCard product={product} key={product.id}/>
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
