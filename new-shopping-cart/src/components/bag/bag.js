import React from "react";
import "./style.scss";
import Typography from "@material-ui/core/Typography";
import BagCard from "../bag-card/b-card";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";

class Bag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <div className="Popover">
        <Typography className="Popover-header" component="h5" variant="h5">
          Review Bag
        </Typography>
        <div className="items">
          {this.props.items.map(item => (
            <BagCard item={item} />
          ))}
        </div>
        <Button variant="contained" color="primary">
          Check Out
        </Button>
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
