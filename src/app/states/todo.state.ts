import {State, Action, StateContext, Selector} from '@ngxs/store';
import {TodoService} from '../todo.service';
import {tap} from 'rxjs/operators';
import {Todo} from '../model/todo.model';
import {Injectable} from '@angular/core';
import {TodoActions} from '../actions/todo.action';
import {Observable} from 'rxjs';

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
  static getTodoList(state: TodoStateModel): Todo[] {
    return state.todoList;
  }

  @Selector()
  static getSelectedTodo(state: TodoStateModel): Todo {
    return state.selectedTodo;
  }

  @Action(TodoActions.Get)
  getTodos({getState, setState}: StateContext<TodoStateModel>): Observable<Todo[]> {
    return this.todoService.fetchTodos().pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        todoList: result,
      });
    }));
  }

  @Action(TodoActions.Add)
  addTodo({getState, patchState}: StateContext<TodoStateModel>, {payload}: TodoActions.Add): Observable<Todo> {
    return this.todoService.addTodo(payload).pipe(tap((result) => {
      const state = getState();
      patchState({
        todoList: [...state.todoList, result]
      });
    }));
  }

  @Action(TodoActions.Update)
  updateTodo({getState, setState}: StateContext<TodoStateModel>, {payload, id}: TodoActions.Update): Observable<Todo> {
    return this.todoService.updateTodo(payload, id).pipe(tap((result) => {
      const state = getState();
      const todoList = [...state.todoList];
      const todoIndex = todoList.findIndex(item => item.id === id);
      todoList[todoIndex] = result;
      setState({
        ...state,
        todoList,
      });
    }));
  }


  @Action(TodoActions.Delete)
  deleteTodo({getState, setState}: StateContext<TodoStateModel>, {id}: TodoActions.Delete): Observable<any> {
    return this.todoService.deleteTodo(id).pipe(tap(() => {
      const state = getState();
      const filteredArray = state.todoList.filter(item => item.id !== id);
      setState({
        ...state,
        todoList: filteredArray,
      });
    }));
  }

  @Action(TodoActions.SetSelected)
  setSelectedTodoId({getState, setState}: StateContext<TodoStateModel>, {payload}: TodoActions.SetSelected): void {
    const state = getState();
    setState({
      ...state,
      selectedTodo: payload
    });
  }
}
