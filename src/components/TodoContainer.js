import React, {Component} from 'react';
import axios from 'axios';
import { Trash2 } from 'react-feather';
import { Edit2 } from 'react-feather';


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
            <div className="p-5 md:p-10 flex flex-col md:flex-row items-center">  
                <div className="flex flex-col mb-3 ">
                    <label htmlFor="taskName" className="text-lg font-bold mr-10">
                        Task name
                    </label>   
                    <input
                    id="taskName"
                    className="p-2 ml-4 border border-gray-400 w-64"
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
                    className="p-2 ml-4 border border-gray-400  w-80"
                    type="text"
                    placeholder="Task description"
                    maxLength="100"
                    value={this.state.descriptionValue}
                    onChange={this.handleDescriptionChange}
                    />
                </div>
                <label className='ml-10'>
                    <input type="checkbox"  />
                    Completed
                </label>
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white py-2 px-4 rounded ml-10" 
                    onClick={this.createTodo}>
                    +
                </button>
            </div>
            <div className="listWrapper p-10 m-2">
  <ul className="taskList grid grid-cols-1 gap-4 m-2">
    {this.state.todos.map((todo) => {
      return (
        <li className="bg-white p-0.5" todo={todo} key={todo.id}>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={(e) => this.updateTodo(e, todo.id)}
            />
            {this.state.editingTodoId === todo.id ? (
              <div className="flex flex-row justify-between m-auto">
                <div className="flex flex-row space-x-4 ">
                <input
                  id="editName"
                  className="p-2 border border-gray-400 flex-grow"
                  type="text"
                  value={this.state.editingTodoName}
                  onChange={this.handleEditNameChange}
                />
                <input
                  id="editDescription"
                  className="p-2 border border-gray-400 w-40 flex-grow-2"
                  type="text"
                  value={this.state.editingTodoDescription}
                  onChange={this.handleEditDescriptionChange}
                />
                </div>
                <div className='ml-10 flex flex-row'>
                <button onClick={() => this.handleSaveClick(todo.id)}>
                  Save
                </button>
                <button className='ml-10' onClick={this.handleCancelClick}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col ml-15">
                <label className="mb-2">{todo.name}</label>
                <label>{todo.description}</label>
                </div>
                <div className="flex ml-auto">
                <button
                    className="bg-blue ml-2"
                    onClick={() =>
                    this.setState({
                        editingTodoId: todo.id,
                        editingTodoName: todo.name,
                        editingTodoDescription: todo.description,
                    })
                    }
                >
                    <Edit2 size={16} />
                </button>
            <span onClick={(e) => this.deleteTodo(todo.id)}>  <Trash2 size={16} /></span>
  
</div>
              </>
            )}
          </div>
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