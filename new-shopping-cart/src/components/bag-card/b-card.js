import React from "react";
import "./style.scss";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import {
  CardMedia,
  CardContent,
  Typography,
  IconButton
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
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
            {this.props.item.currencyFormat}{this.props.item.price}</Typography>
          </CardContent>
          <div className={classes.controls}>
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(BagCard);
