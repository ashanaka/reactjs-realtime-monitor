import logo from './logo.svg';
import './App.css';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Line} from 'react-chartjs-2';

import firebase from 'firebase';
import {DB_CONFIG} from './Config';

class App extends Component {

  constructor(){
    super();

    if (!firebase.apps.length) {
        this.app = firebase.initializeApp(DB_CONFIG);
    }else {
        this.app = firebase.app(); // if already initialized, use that one
    }

    // this.app = firebase.initializeApp(DB_CONFIG);
    this.database = this.app.database().ref().child('Machine1');

    this.state = {
      input: 10,
      labels: ['January', 'February', 'March',
        'April', 'May'],
      datasets: [
        {
          label: 'Rainfall',
          backgroundColor: 'rgba(75,192,192,1)',
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 2,
          data: [65, 59, 80, 81, 56]
        }
      ]
    }

  }

  componentDidMount(){
    this.database.on('value', snap => {
        let vals = snap.val();
        console.log(vals);
        let valsArr = [];
        let keysArr = [];
        for (let [key, value] of Object.entries(vals)) {
            // console.log(value);
            valsArr.push(key.split(': '));
            keysArr.push(value);
        }

        this.setState({
            // input: snap.val(),
            labels: valsArr,
            datasets: [
                {
                    label: 'Rainfall',
                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 2,
                    data: keysArr
                }
            ]
        });
    });
  }
  render() {
    return (
      <div className="App">
        <h1>Hello, {this.state.input}</h1>
          <Line
              data={this.state}
              options={{
                  title:{
                      display:true,
                      text:'Average Rainfall per month',
                      fontSize:20
                  },
                  legend:{
                      display:true,
                      position:'right'
                  },
                  maintainAspectRatio: true,
                  redraw: true
              }}
          />
      </div>
    );
  }
}

export default App;
