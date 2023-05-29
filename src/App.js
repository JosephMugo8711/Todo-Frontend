import './App.css';
import React, {Component} from 'react'
import  TodoContainer from './components/TodoContainer';

class App extends Component {
  render(){
    return (
      <div className="App">
        <div className="flex justify-center">
        <h1 className="text-2xl font-bold mb-4 mt-4">Todo List</h1>
        </div>
        <TodoContainer />  
      </div>
    );
  }
  
}

export default App;
