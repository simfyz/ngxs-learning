import {State, Action, StateContext, Selector} from '@ngxs/store';
import {AddTodo, DeleteTodo, GetTodos, SetSelectedTodo, UpdateTodo} from '../actions/todo.action';
import {TodoService} from '../todo.service';
import {tap} from 'rxjs/operators';
import {Todo} from '../model/todo.model';
import {Injectable} from '@angular/core';

export class TodoStateModel {
  todoList: Todo[];
  selectedTodo: Todo;
}

@State<TodoStateModel>({
  name: 'todos',
  defaults: {
    todoList: [],
    selectedTodo: null
  }
})

@Injectable()
export class TodoState {

  constructor(private todoService: TodoService) {
  }

  @Selector()
  static getTodoList(state: TodoStateModel) {
    return state.todoList;
  }

  @Selector()
  static getSelectedTodo(state: TodoStateModel) {
    return state.selectedTodo;
  }

  @Action(GetTodos)
  getTodos({getState, setState}: StateContext<TodoStateModel>) {
    return this.todoService.fetchTodos().pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        todoList: result,
      });
    }));
  }

  @Action(AddTodo)
  addTodo({getState, patchState}: StateContext<TodoStateModel>, {payload}: AddTodo) {
    return this.todoService.addTodo(payload).pipe(tap((result) => {
      const state = getState();
      patchState({
        todoList: [...state.todoList, result]
      });
    }));
  }

  @Action(UpdateTodo)
  updateTodo({getState, setState}: StateContext<TodoStateModel>, {payload, id}: UpdateTodo) {
    return this.todoService.updateTodo(payload, id).pipe(tap((result) => {
      const state = getState();
      const todoList = [...state.todoList];
      const todoIndex = todoList.findIndex(item => item.id === id);
      todoList[todoIndex] = result;
      setState({
        ...state,
        todoList: todoList,
      });
    }));
  }


  @Action(DeleteTodo)
  deleteTodo({getState, setState}: StateContext<TodoStateModel>, {id}: DeleteTodo) {
    return this.todoService.deleteTodo(id).pipe(tap(() => {
      const state = getState();
      const filteredArray = state.todoList.filter(item => item.id !== id);
      setState({
        ...state,
        todoList: filteredArray,
      });
    }));
  }

  @Action(SetSelectedTodo)
  setSelectedTodoId({getState, setState}: StateContext<TodoStateModel>, {payload}: SetSelectedTodo) {
    const state = getState();
    setState({
      ...state,
      selectedTodo: payload
    });
  }
}
