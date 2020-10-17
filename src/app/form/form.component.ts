import {Component, OnInit} from '@angular/core';
import {Todo} from '../model/todo.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TodoActions} from '../actions/todo.action';
import {Select, Store} from '@ngxs/store';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {TodoState} from '../states/todo.state';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  @Select(TodoState.getSelectedTodo) selectedTodo: Observable<Todo>;
  todoForm: FormGroup;
  editTodo = false;
  private formSubscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private store: Store, private route: ActivatedRoute, private router: Router) {
    this.createForm();
  }

  ngOnInit(): void {
    this.formSubscription.add(
      this.selectedTodo.subscribe(todo => {
        if (todo) {
          this.todoForm.patchValue({
            id: todo.id,
            userId: todo.userId,
            title: todo.title
          });
          this.editTodo = true;
        } else {
          this.editTodo = false;
        }
      })
    );
  }

  createForm(): void {
    this.todoForm = this.fb.group({
      id: [''],
      userId: ['', Validators.required],
      title: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.editTodo) {
      this.formSubscription.add(
        this.store.dispatch(new TodoActions.Update(this.todoForm.value, this.todoForm.value.id)).subscribe(() => {
          this.clearForm();
        })
      );
    } else {
      this.formSubscription.add(
        this.formSubscription = this.store.dispatch(new TodoActions.Add(this.todoForm.value)).subscribe(() => {
          this.clearForm();
        })
      );
    }
  }

  clearForm(): void {
    this.todoForm.reset();
    this.store.dispatch(new TodoActions.SetSelected(null));
  }
}
