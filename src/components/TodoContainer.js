import React, { Component } from 'react';
import axios from 'axios';
import { Trash2 } from 'react-feather';
import { Edit2 } from 'react-feather';
import Swal from 'sweetalert2';


class TodosContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      inputValue: '',
      descriptionValue: '',
      editingTodoId: null,
      editingTodoName: '',
      editingTodoDescription: '',
    };
  }

  componentDidMount() {
    this.fetchTodos();
  }

  fetchTodos = () => {
    axios
      .get('/todos')
      .then((response) => {
        this.setState({ todos: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  createTodo = () => {
    const { inputValue, descriptionValue } = this.state;
    if (inputValue.trim() === '' || descriptionValue.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Name and description cannot be empty',
      });
      return;
    }
    const newTodo = {
      name: inputValue,
      description: descriptionValue,
      done: false,
    };
    axios
      .post('/todos', { todo: newTodo })
      .then((response) => {
        const todos = [...this.state.todos, response.data];
        this.setState({ todos, inputValue: '', descriptionValue: '' });
      })
      .catch((error) => console.log(error));
  };
  handleNameChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleDescriptionChange = (e) => {
    this.setState({ descriptionValue: e.target.value });
  };

  handleEditNameChange = (e) => {
    const editingTodoId = this.state.editingTodoId;
    const editingTodoName = e.target.value;
    this.setState((prevState) => ({
      todos: prevState.todos.map((todo) =>
        todo.id === editingTodoId ? { ...todo, name: editingTodoName } : todo
      ),
      editingTodoName: editingTodoName
    }));
  };

  handleEditDescriptionChange = (e) => {
    const editingTodoId = this.state.editingTodoId;
    const editingTodoDescription = e.target.value;
    this.setState((prevState) => ({
      todos: prevState.todos.map((todo) =>
        todo.id === editingTodoId ? { ...todo, description: editingTodoDescription } : todo
      ),
      editingTodoDescription: editingTodoDescription
    }));
  };

  updateTodo = (id, updatedData) => {
    const editedTodo = this.state.todos.find((todo) => todo.id === id);
  
    if (editedTodo.done) {
      Swal.fire({
        icon: 'error',
        title: 'Cannot Edit',
        text: 'This task is already marked as done and cannot be edited.',
      });
      return;
    }
  
    axios
      .put(`/todos/${id}`, { todo: updatedData })
      .then((response) => {
        const updatedTodo = response.data;
        const todos = this.state.todos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        );
        this.setState({
          todos,
          editingTodoId: null,
          editingTodoName: '',
          editingTodoDescription: '',
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  handleSaveClick = (id) => {
    const { editingTodoName, editingTodoDescription } = this.state;
    const updatedData = {
      name: editingTodoName,
      description: editingTodoDescription,
    };
  
    const editedTodo = this.state.todos.find((todo) => todo.id === id);
  
    if (id && Object.keys(updatedData).length > 0) {
      if (editedTodo.done) {
        Swal.fire({
          icon: 'error',
          title: 'Cannot Edit',
          text: 'This task is already marked as done and cannot be edited.',
        });
      } else {
        this.updateTodo(id, updatedData);
      }
    }
  };
  
  handleCancelClick = () => {
    this.setState({
      editingTodoId: null,
      editingTodoName: '',
      editingTodoDescription: '',
    });
  };

  updateTodoStatus = (e, id) => {
    const { todos } = this.state;
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, done: e.target.checked } : todo
    );
  
    axios
      .patch(`/todos/${id}/complete`)
      .then(() => {
        this.setState({ todos: updatedTodos });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  

  deleteTodo = (id) => {
    axios
      .delete(`/todos/${id}`)
      .then(() => {
        const todos = this.state.todos.filter((todo) => todo.id !== id);
        this.setState({ todos });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleChangeStatus = (e, todoId) => {
    const { todos } = this.state;
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        const updatedTodo = { ...todo, done: e.target.checked };
        localStorage.setItem(`todo_${todoId}`, JSON.stringify(updatedTodo));
        return updatedTodo;
      }
      return todo;
    });

    this.setState({ todos: updatedTodos });
  };

  render() {
    const { todos, inputValue, descriptionValue, editingTodoName, editingTodoDescription } = this.state;

    return (
      <div className="bg-gray-300 md:p-10">
        <div className="p-5 md:p-10 flex flex-col md:flex-row justify-center items-center">
          <div className="flex flex-col mb-2 md:mr-2">
            <label htmlFor="taskName" className="text-lg font-bold">
              Task name
            </label>
            <input
              id="taskName"
              className="p-2 border border-gray-400 w-full md:w-64"
              type="text"
              placeholder="Task name"
              maxLength="50"
              value={inputValue}
              onChange={this.handleNameChange}
            />
          </div>
          <div className="flex flex-col mb-2 md:ml-2 md:mr-2">
            <label htmlFor="taskDescription" className="text-lg font-bold">
              Task description
            </label>
            <input
              id="taskDescription"
              className="p-2 border border-gray-400 w-full md:w-80"
              type="text"
              placeholder="Task description"
              maxLength="100"
              value={descriptionValue}
              onChange={this.handleDescriptionChange}
            />
          </div>
          <div className="mt-5">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded ml-10"
              onClick={this.createTodo}
            >
              Add
            </button>
          </div>
        </div>
        <div className="w-full m-2">
          <ul className="grid grid-cols-1 gap-4 w-90 mb-5">
            {todos.map((todo) => (
              <li className={`bg-white px-2 w-full ${todo.done ? 'completed' : ''}`} key={todo.id}>
                <div className="flex items-center mb-2 px-3">
                  <input
                    id='checkbox'
                    type="checkbox"
                    checked={todo.done || false}
                    onChange={(e) => this.updateTodoStatus(e, todo.id)}
                    disabled={todo.done}
                  />
                  {this.state.editingTodoId === todo.id ? (
                   <div className=" ml-4 flex ">
                    <div className="md:flex-wrap md:space-x-4">
                        <textarea
                          id="editName"
                          className="p-2 mt-2 h-10 p-0 border border-gray-400 "
                          type="text"
                          value={editingTodoName}
                          onChange={this.handleEditNameChange}
                        />
                        <textarea
                          id="editDescription"
                          className="p-2 border border-gray-400 w-full md:w-80 h-10"
                          value={editingTodoDescription}
                          onChange={this.handleEditDescriptionChange}
                        />
                      </div>
                      <div className="ml-10 mt-2 flex flex-row space-x-4">
                        <button
                          className="bg-blue-500 text-white h-10 py-1 px-4 rounded ml-2"
                          onClick={() => this.handleSaveClick(todo.id)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-blue-500 text-white h-10 py-1 px-4 rounded ml-2"
                          onClick={this.handleCancelClick}
                        >
                          Cancel
                        </button>
                      </div>
                 </div>
                 
                  ) : (
                    <>
                      <div className="flex flex-col ml-5 md:ml-15">
                        <label
                          className={`mb-2 ${
                            todo.done ? 'line-through' : ''
                          }`}
                        >
                          {todo.name}
                        </label>
                        <label
                          className={`description-label ${
                            todo.done ? 'line-through' : ''
                          }`}
                        >
                          {todo.description}
                        </label>
                      </div>
                      <div className="flex ml-auto">
                        <button
                          className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
                          onClick={() =>
                            this.setState({
                              editingTodoId: todo.id,
                              editingTodoName: todo.name,
                              editingTodoDescription: todo.description,
                            })
                          }
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
                          onClick={(e) => this.deleteTodo(todo.id)}
                        >
                           <Trash2 size={20} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default TodosContainer;

