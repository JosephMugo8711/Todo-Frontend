import React, {Component} from 'react';
import axios from 'axios';

class TodosContainer extends Component  {
    constructor(props) {
        super(props)
        this.state = {
            todos: [],
            inputValue: '',
            descriptionValue: '',
            editingTodoId: null,
            editingTodoName: '',
            editingTodoDescription: ''
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
            const updatedTodos = [createdTodo, ...this.state.todos];
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

    updateTodo = async (e, id) => {
        try{
            const response = await axios.put('/todos/${id', {todo: {done: e.target.checked}})
            const updatedTodo = response.data;

            this.setState(prevState => {
                const todos = prevState.todos.map(todo => {
                    if (todo.id === updatedTodo.id){
                        return updatedTodo
                    }
                    return todo;
                });

                return {
                    todos: todos
                };
            });
        } catch (error) {
            console.log(error)
        }
    };
    handleUpdateClick = (id) => {
        const updatedData = {};
      
        const name = prompt('Enter the new name:');
        if (name) {
          updatedData.name = name;
        }
      
        const description = prompt('Enter the new description:');
        if (description) {
          updatedData.description = description;
        }
      
        const completed = window.confirm('Is the task completed?');
        if (completed) {
          updatedData.completed = completed;
        }
      
        if (Object.keys(updatedData).length > 0) {
          this.updateTodo(id, updatedData);
        }
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
              <input
                className=""
                type="text"
                placeholder="task description"
                maxLength="50"
                value={this.state.descriptionValue}
                onChange={this.handleDescriptionChange}
              />
              <label>
                <input type="checkbox" />
                Completed
              </label>
              <button type="submit" onClick={this.createTodo}>
                +
              </button>
            </div>
            <div className="listWrapper">
              <ul className="taskList">
                {this.state.todos.map((todo) => {
                  return (
                    <li className="" todo={todo} key={todo.id}>
                      <input
                        type="checkbox"
                        checked={todo.done}
                        onChange={(e) => this.updateTodo(e, todo.id)}
                      />
                      <label>{todo.name}</label>
                      <label>{todo.description}</label>
                      <span>X</span>
                      <button
                        className="bg-blue"
                        onClick={() => this.handleUpdateClick(todo.id)}
                      >
                        Update
                      </button>
                      {this.state.editingTodoId === todo.id && (
                        <div>
                          <input
                            type="text"
                            value={this.state.editingTodoName}
                            onChange={(e) =>
                              this.setState({ editingTodoName: e.target.value })
                            }
                          />
                          <input
                            type="text"
                            value={this.state.editingTodoDescription}
                            onChange={(e) =>
                              this.setState({ editingTodoDescription: e.target.value })
                            }
                          />
                          <button onClick={() => this.handleSaveClick(todo.id)}>
                            Save
                          </button>
                          <button onClick={this.handleCancelClick}>Cancel</button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      }
      
   
}
 
export default TodosContainer