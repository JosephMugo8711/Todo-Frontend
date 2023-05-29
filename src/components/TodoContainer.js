import React, { Component } from 'react';
import axios from 'axios';

class TodosContainer extends Component {
  state = {
    todos: [],
    inputValue: '',
    descriptionValue: '',
    editingTodoId: null,
    editingTodoName: '',
    editingTodoDescription: '',
  };

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
    if (inputValue.trim() === '') {
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
    this.setState({ editingTodoName: e.target.value });
  };

  handleEditDescriptionChange = (e) => {
    this.setState({ editingTodoDescription: e.target.value });
  };

  updateTodo = (id, updatedData) => {
    axios
      .put(`/todos/${id}`, { todo: updatedData })
      .then((response) => {
        const updatedTodo = response.data;
        const todos = this.state.todos.map((todo) => {
          if (todo.id === updatedTodo.id) {
            return updatedTodo;
          }
          return todo;
        });
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

    if (id && Object.keys(updatedData).length > 0) {
      this.updateTodo(id, updatedData);
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
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, done: e.target.checked };
      }
      return todo;
    });

    axios
      .put(`/todos/${id}`, { todo: { done: e.target.checked } })
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

  render() {
    const { todos, inputValue, descriptionValue } = this.state;

    return (
      <div className="container mx-auto max-w-md">
       <div className="flex mr-10 md:p-10 flex flex-col md:flex-row items-center">
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
              value={this.state.inputValue}
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
              value={this.state.descriptionValue}
              onChange={this.handleDescriptionChange}
            />
          </div>
          <button className="bg-blue-500 text-white ml-2 p-2 mt-3 md:mt-0">
            Add
          </button>
        </div>

        <div className="mt-4">
          <ul>
            {todos.map((todo) => (
              <li className="bg-white p-0.5" key={todo.id}>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={(e) => this.updateTodoStatus(e, todo.id)}
                  />
                  {this.state.editingTodoId === todo.id ? (
                    <div className="flex flex-row justify-between m-auto">
                      <div className="flex flex-col space-y-2 md:flex-row md:space-x-4">
                        <input
                          id="editName"
                          className="p-2 border border-gray-400 flex-grow"
                          type="text"
                          value={this.state.editingTodoName}
                          onChange={this.handleEditNameChange}
                        />
                        <input
                          id="editDescription"
                          className="p-2 border border-gray-400 w-full md:w-40 flex-grow-2"
                          type="text"
                          value={this.state.editingTodoDescription}
                          onChange={this.handleEditDescriptionChange}
                        />
                      </div>
                      <div className="ml-10 flex flex-row space-x-2 md:space-x-4">
                        <button onClick={() => this.handleSaveClick(todo.id)}>Save</button>
                        <button className="ml-10" onClick={this.handleCancelClick}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col ml-5 md:ml-15">
                        <label className={`mb-2 ${todo.done ? 'line-through' : ''}`}>
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
                          className="bg-blue ml-2"
                          onClick={() =>
                            this.setState({
                              editingTodoId: todo.id,
                              editingTodoName: todo.name,
                              editingTodoDescription: todo.description,
                            })
                          }
                        >
                          Edit
                        </button>
                        <span onClick={(e) => this.deleteTodo(todo.id)}>
                          Delete
                        </span>
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
