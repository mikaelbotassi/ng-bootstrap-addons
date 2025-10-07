import { Directive } from '@angular/core';

@Directive({
  selector: '[nbaPageState]',
})
export class PageStateDirective<T = any> {

  state: T = {} as T;

  constructor(){
    this.state = history.state;
  }

}
