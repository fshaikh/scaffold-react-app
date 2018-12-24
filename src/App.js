import React from 'react';
import { hot } from 'react-hot-loader/root'

class App extends React.Component {
    constructor(props){
        super(props);
    }

    // Define state using Property Initialzer syntax.
    state = {
        counter: 0
    }

    // Define event handlers without a need for explicit bind
    increment = () => {
        this.setState(prevState => ({counter: prevState.counter + 1}));
    }
    decrement = () => {
        this.setState(prevState => ({counter: prevState.counter - 1}));
    }
    render(){
        return (
            <React.Fragment>
                <div>Counter Demo</div>
                <h3>{this.state.counter}</h3>
                <button onClick={this.increment}>+</button>
                <button onClick={this.decrement}>-</button>
            </React.Fragment>
            
        )
    }
}
export default hot(App);
