import {Injectable} from '@angular/core';
import {Todo} from './model/todo.model';
import {HttpClient} from '@angular/common/http';
import {map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http: HttpClient) {
  }

  fetchTodos() {
    return this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos').pipe(map(res => res.slice(0, 10)));
  }

  deleteTodo(id: number) {
    return this.http.delete('https://jsonplaceholder.typicode.com/todos/' + id);
  }

  addTodo(payload: Todo) {
    return this.http.post<Todo>('https://jsonplaceholder.typicode.com/todos', payload);
  }

  updateTodo(payload: Todo, id: number) {
    return this.http.put<Todo>('https://jsonplaceholder.typicode.com/todos/' + id, payload);
  }
}
