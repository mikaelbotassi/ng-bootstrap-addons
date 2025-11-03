import { Injectable, signal } from '@angular/core';

@Injectable()
export class FormStateService {

 value = signal<any>(null);
 
}
