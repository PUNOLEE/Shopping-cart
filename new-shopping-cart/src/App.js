import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.scss";
import ViewCard from "./components/card/card.js";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: []
    };
  }

  componentDidMount() {
    import("./products.json").then(json => {
      this.setState({ products : json.products });
    });
  }

  render() {
    return (
      <div className="App">
       {this.state.products.map(product => (
            <ViewCard product={product} />
          ))}
      </div>
    );
  }
}

export default App;
