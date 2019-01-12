import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateBag } from "../../services/actions";

const styles = theme => ({
  card: {
    maxWidth: 250
  },
  media: {
    height: 0,
    paddingTop: "100%", // 16:9
    backgroundSize: "contain"
  },
  actions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  price: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
});

class ViewCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleClick = event => {
    let items = this.props.items;
    let product = this.props.product;

    if (items.some(e => e.id === product.id)) {
      product["quantity"] += 1;
    } else {
      product["quantity"] = 1;
      items.push(product);
    }

    this.props.updateBag(items, true);
  };

  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          action={
            <IconButton aria-label="Add to favorites" color="secondary">
              <FavoriteIcon onClick={this.handleClick} />
            </IconButton>
          }
          subheader="Free shipping"
        />
        <CardMedia
          className={classes.media}
          image={require(`../../static/products/${
            this.props.product.sku
          }_1.jpg`)}
          title="clothes"
        />
        <CardContent>
          <Typography component="p">{this.props.product.title}</Typography>
          <div className={classes.price}>
            <Typography component="p">
              {this.props.product.currencyFormat}
            </Typography>
            <Typography variant="h6" color="secondary">
              {this.props.product.price}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }
}

ViewCard.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return { items: state.bagReducer.items };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateBag
    },
    dispatch
  );
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ViewCard)
);
