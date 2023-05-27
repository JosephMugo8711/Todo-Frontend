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
        try {
          const { editingTodoName, editingTodoDescription } = this.state;
          const updatedData = {};
      
          if (editingTodoName) {
            updatedData.name = editingTodoName;
          }
      
          if (editingTodoDescription) {
            updatedData.description = editingTodoDescription;
          }
      
          const response = await axios.put(`/todos/${id}`, { todo: updatedData })
          const updatedTodo = response.data;
      
          this.setState((prevState) => {
            const todos = prevState.todos.map((todo) => {
              if (todo.id === updatedTodo.id) {
                return updatedTodo;
              }
              return todo;
            });
      
            return {
              todos,
              editingTodoId: null,
              editingTodoName: '',
              editingTodoDescription: '',
            };
          });
        } catch (error) {
          console.log(error);
        }
      };
      
    handleEditNameChange = (event) => {
        this.setState({ editingTodoName: event.target.value });
      };
    
      handleEditDescriptionChange = (event) => {
        this.setState({ editingTodoDescription: event.target.value });
      };
    
      handleSaveClick = (id) => {
        const { editingTodoName, editingTodoDescription } = this.state;
        const updatedData = {};
      
        if (editingTodoName) {
          updatedData.name = editingTodoName;
        }
      
        if (editingTodoDescription) {
          updatedData.description = editingTodoDescription;
        }
      
        if (id && Object.keys(updatedData).length > 0) {
          this.updateTodo(id.toString(), updatedData); 
          this.setState({
            editingTodoId: null,
            editingTodoName: '',
            editingTodoDescription: '',
          });
        }
      };
      
    
      handleCancelClick = () => {
        this.setState({
          editingTodoId: null,
          editingTodoName: '',
          editingTodoDescription: '',
        });
      };

      deleteTodo = (id) => {
        axios.delete(`/todos/${id}`)
        .then(response => {
            const todoIndex = this.state.todos.findIndex(x => x.id === id);
            const todos = [...this.state.todos];
            todos.splice(todoIndex, 1);
            this.setState({ todos });
        })
        .catch(error => console.log(error));
      }

      

      render() {
        return (
          <div className="bg-gray-300 mx-1 p-1">
            <div className="p-15 flex flex-row items-center">  
                <div className="flex flex-col mb-3">
                    <label htmlFor="taskName" className="text-lg font-bold mr-10">
                        Task name
                    </label>   
                    <input
                    id="taskName"
                    className="p-2 ml-4 border border-gray-400"
                    type="text"
                    placeholder="Task name"
                    maxLength="50"
                    value={this.state.inputValue}
                    onChange={this.handleNameChange}
                    />
                </div>
                <div className="flex flex-col mb-3">
                    <label htmlFor="taskDescription" className="text-lg font-bold mr-10">
                        Task description
                    </label>
                    <input
                    id="taskDescription"
                    className="p-2 ml-4 border border-gray-400"
                    type="text"
                    placeholder="Task description"
                    maxLength="50"
                    value={this.state.descriptionValue}
                    onChange={this.handleDescriptionChange}
                    />
                </div>
                <label className='mr-10'>
                    <input type="checkbox"  />
                    Completed
                </label>
                <button type="submit" className='mr-10' onClick={this.createTodo}>
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
                  {this.state.editingTodoId === todo.id ? (
                    <div>
                      <input
                        type="text"
                        value={this.state.editingTodoName}
                        onChange={this.handleEditNameChange}
                      />
                      <input
                        type="text"
                        value={this.state.editingTodoDescription}
                        onChange={this.handleEditDescriptionChange}
                      />
                      <button onClick={() => this.handleSaveClick(todo.id)}>
                        Save
                      </button>
                      <button onClick={this.handleCancelClick}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <label>{todo.name}</label>
                      <label>{todo.description}</label>
                      <span onClick={(e) => this.deleteTodo(todo.id)}>X</span>
                      <button
                        className="bg-blue"
                        onClick={() =>
                          this.setState({
                            editingTodoId: todo.id,
                            editingTodoName: todo.name,
                            editingTodoDescription: todo.description,
                          })
                        }
                      >
                        Update
                      </button>
                    </>
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