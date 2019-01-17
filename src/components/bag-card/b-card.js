import React from "react";
import "./style.scss";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import {updateBag} from '../../services/actions';
import {
  CardMedia,
  CardContent,
  Typography,
  IconButton
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import firebase from "../../services/firebase";

const styles = theme => ({
  card: {
    display: "flex",
    margin: 5
  },
  details: {
    display: "flex",
    flexDirection: "row"
  },
  content: {
    flex: "1 0 auto"
  },
  cover: {
    width: 80,
    backgroundSize: "contain"
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  }
});

class BagCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleClick = event => {
    let item = this.props.item;
    let items = this.props.items;
    items = items.filter(e=> e.id !==item.id);
    var user = firebase.auth().currentUser;
    firebase
          .database()
          .ref("users/" + user.uid)
          .update({
            bag: items
          });
    this.props.updateBag(items,true);
   };

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.cover}
          image={require(`../../static/products/${
            this.props.item.sku
          }_1.jpg`)}
        />
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography className="title">
              {this.props.item.title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" >
            {this.props.item.currencyFormat}{this.props.item.price}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" >
            quantity:{this.props.item.quantity}
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            <IconButton onClick={this.handleClick}>
              <DeleteIcon/>
            </IconButton>
          </div>
        </div>
      </Card>
    );
  }
}
const mapStateToProps = (state) => {
  return { items: state.bagReducer.items }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateBag,
  }, dispatch)
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(BagCard));
