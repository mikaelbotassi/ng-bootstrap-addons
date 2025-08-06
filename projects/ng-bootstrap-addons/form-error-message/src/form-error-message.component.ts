import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { CustomValidatorService } from 'ng-bootstrap-addons/services';
import { createRandomString } from 'ng-bootstrap-addons/utils';

@Component({
  selector: 'nba-form-error-message',
  imports: [],
  templateUrl: './form-error-message.component.html',
  host: { 'collision-id': `ac-search-sample-${createRandomString(20)} ` },
})
export class FormErrorMessageComponent implements OnInit {

  control = input.required<FormControl | undefined>();
  message:string|null = null;
  customValidators = inject(CustomValidatorService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.message = this._getMessage();
    this.control()?.statusChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.message = this._getMessage();
    });
  }

  private _getMessage():string|null{
    const control = this.control();
    if (control && control.invalid) 
      return this.customValidators.getValidatorMessages(control.errors)?.shift() ?? null;
    return null;
  }

}