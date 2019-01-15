import React from "react";
import "./style.scss";
import Typography from "@material-ui/core/Typography";
import BagCard from "../bag-card/b-card";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";

class Bag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  calculateTotal = () => {
    let money = 0;
    if (this.props.items.length !== 0) {
      this.props.items.forEach(item => {
        money += item.quantity * item.price;
      });
    }
    return money;
  };

  render() {
    return (
      <div className="Popover">
        <Typography className="Popover-header" component="h5" variant="h5">
          Review Bag
        </Typography>
        <div className="items">
          {this.props.items.map((item,index)=> (
            <BagCard item={item} key={index}/>
          ))}
        </div>
        <div className="actions">
          <Button variant="contained" color="primary">
            Check Out
          </Button>
          <div className="actions-total">
            <Typography variant="h6">
              Total: ${this.calculateTotal()}{" "}
            </Typography>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { items: state.bagReducer.items };
};

export default connect(
  mapStateToProps,
  null
)(Bag);
