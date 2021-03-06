import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {TodoState} from '../states/todo.state';
import {Observable} from 'rxjs';
import {Todo} from '../model/todo.model';
import {TodoActions} from '../actions/todo.action';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @Select(TodoState.getTodoList) todos: Observable<Todo[]>;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new TodoActions.Get());
  }

  deleteTodo(id: number): void {
    this.store.dispatch(new TodoActions.Delete(id));
  }

  editTodo(payload: Todo): void {
    this.store.dispatch(new TodoActions.SetSelected(payload));
  }


}
