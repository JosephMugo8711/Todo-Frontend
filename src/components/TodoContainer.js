import React, {Component} from 'react';
import axios from 'axios';

class TodosContainer extends Component  {
    constructor(props) {
        super(props)
        this.state = {
            todos: [],
            inputValue: '',
            descriptionValue: '',
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

    createTodo = (e) => {
        e.preventDefault();
        const {inputValue, descriptionValue} = this.state;
        
        if (!inputValue.trim()){
            alert('Task name cannot be empty');
            return;
        }

        const newTodo = {
            name: inputValue,
            description: descriptionValue,
            completed: false,
        };

        axios.post('/todos', newTodo)
        .then((res) => {
            const createdTodo = res.data;
            const updatedTodo = [createdTodo, ...this.state.todos];
            this.setState({
                todos: updatedTodos,
                inputValue: '',
                descriptionValue: '',
            });
        })
        .catch((error) => console.log(error));
        
    };

    handleNameChange = (event) => {
        this.setState({inputValue: event.target.value})
    }

    handleDescriptionChange = (event) => {
        this.setState({descriptionValue: event.target.value})
    };

    render() {
        return (

            <div>
                <div className="p-15">
                    <input 
                        className="" 
                        type="text" 
                        placeholder="task name" 
                        maxLength="50" 
                        value={this.state.inputValue}
                        onChange={this.handleNameChange}
                        />
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
                                    <label>{todo.description}</label>
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