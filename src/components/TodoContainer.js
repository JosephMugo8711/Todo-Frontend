import React, {Component} from 'react';
import axios from 'axios';

class TodosContainer extends Component  {
    constructor(props) {
        super(props)
        this.state = {
            todos: []
        }
    }

    getTodos() {
        axios.get('/todos')
        .then(res => {
            this.setState({todos: res.data})
        })
        .catch(error => console.log(error))
    }

    componentDidMount(){
        this.getTodos()
    }



    render() {
        return (

            <div>
                <div className="p-15">
                    <input className="" type="text" placeholder="task name" maxLength="50" />
                    <input className="" type="text" placeholder="task description" maxLength="50" />
                    <label>
                        <input
                        type="checkbox"
                        />
                        Completed
                    </label>
                    <button type="submit" onSubmit={this.createTodo}>+</button>
                </div>  	    
                <div className="listWrapper">
                    <ul className="taskList">
                        {this.state.todos.map((todo) => {
                            return (
                                <li className='' todo={todo} key={todo.id}>
                                    <input  type="checkbox"/>
                                    <label>{todo.name}</label>
                                    <span>X</span>

                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
    
        )

    }
   
}
 
export default TodosContainer