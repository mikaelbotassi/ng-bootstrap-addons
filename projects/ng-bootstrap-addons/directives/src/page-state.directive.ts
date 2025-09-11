import { Directive, inject } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[nbaPageState]',
})
export class PageStateDirective<T = any> {

  state: T = {} as T;
  private _router = inject(Router);

  constructor(){
    this.state = history.state;
  }

}
