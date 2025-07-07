import { effect, Signal, signal } from '@angular/core';
import { finalize, Observable } from 'rxjs';

abstract class Command<T> {
    private _running = signal(false);
    private _result = signal<Observable<T> | null>(null);
    private _error = signal<Error | null>(null);
    private _finalResult = signal<T|null>(null);

    get running(): Signal<boolean> {
        return this._running;
    }

    get result(): Signal<Observable<T> | null> {
        return this._result;
    }

    get error(): Signal<Error | null> {
        return this._error;
    }

    get finalResult(): Signal<T | null> {
        return this._finalResult;
    }

    constructor(){
        effect((onCleanup) => {
            const result = this._result();
            if (result) {
                const subscription = result
                .pipe(finalize(() => this._running.set(false)))
                .subscribe({
                    next: (value) => {
                        this._finalResult.set(value);
                    },
                    error: (err) => {
                        this._error.set(err);
                    }
                });
                onCleanup(() => subscription.unsubscribe());
            }
        });
    }

    clearResult(): void {
        this._result.set(null);
        this._error.set(null);
        this._finalResult.set(null);
    }

    protected _execute(action: () => Observable<T>): void {
        if (this._running()) return;

        this.clearResult();
        this._running.set(true);

        try{
            this._result.set(action());
        } catch (err:any){
            this._error.set(err);
        }
    }
}

export class Command0<T> extends Command<T> {
    constructor(private _action: () => Observable<T>) {
        super();
    }

    execute(): void {
        this._execute(() => this._action());
    }
}

export class Command1<T, A> extends Command<T> {
    constructor(private _action: (arg: A) => Observable<T>) {
        super();
    }

    execute(argument: A): void {
        this._execute(() => this._action(argument));
    }
}

export class Command2<T, A, B> extends Command<T> {
    constructor(private _action: (arg1: A, arg2: B) => Observable<T>) {
        super();
    }

    execute(argument1: A, argument2: B): void {
        this._execute(() => this._action(argument1, argument2));
    }
}