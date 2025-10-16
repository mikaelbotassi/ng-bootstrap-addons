import { Location } from '@angular/common';
import { computed, effect, inject, Injectable, signal, Type } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Route, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PageStateService {
    
    private _router = inject(Router);

    componentRouteMap = new Map<Type<any>, string>();
    private _stateBus = signal(new Map<Type<any>, any>());
    readonly stateBus = computed(() => this._stateBus());
    private readonly _navigationState = toSignal(
        this._router.events.pipe(
            filter((e): e is NavigationEnd => e instanceof NavigationEnd),
            map(() => history.state),
            startWith(history.state)
        ),
        { initialValue: history.state }
    );

    constructor(private _location: Location) {
        effect(async () => {
            const state = this._navigationState();
            const currentComponent = await this.currentComponentType();
            if (currentComponent) this._putStateBus(currentComponent, state);
        });
    }

    async go<T extends object = any>(component: Type<any>, state?: T) {
        
        if(this.componentRouteMap.has(component)){
            this._replaceStateOrNavigate<T>(component, state);
            return;
        }

        await this.buildMap('', this._router.config)

        const path = this.componentRouteMap.get(component);

        if (!path) throw new Error('Rota não encontrada para componente ' + component.name);
    
        this._replaceStateOrNavigate<T>(component, state);

    }

    async goBack() {
        this._location.back();
    }

    async setState<T extends object = any>(state?: T) {
        const currentComponent = await this.currentComponentType();
        if (!currentComponent) throw new Error('Nenhum componente ativo para definir o estado');
        this._putStateBus<T>(currentComponent, state);
    }

    private _replaceStateOrNavigate<T extends object = any>(component: Type<any>, state?: T) {
        if (this._isCurrentComponent(component)) {
            this._putStateBus(component, state);
            return;
        }
        this._router.navigate([`/${this.componentRouteMap.get(component)}`], { state: state });
    }

    private _putStateBus<T extends object = any>(component: Type<any>, state?: T) {
        this._replaceHistoryState(state, false);

        this._stateBus.update(prev => {
            const next = new Map(prev);
            next.set(component, state);
            return next;
        });
    }

    private _replaceHistoryState<T extends object = any>(patch: T | undefined, merge = true) {
        const current = window.history.state ?? {};
        const next = merge ? { ...current, ...(patch ?? {}) } : (patch ?? null);
        this._location.replaceState(this._location.path(), '', next as any);
    }

    async buildMap(parentPath: string|undefined, routes: Route[]) {
        for(let route of routes) {
            let path = '';
            if(parentPath) path = parentPath;
            if(route.path) path += `/${route.path}`;

            if(route.component){
                this.componentRouteMap.set(route.component, `${path}`);
            }
            
            if(route.loadComponent) {
                const loadedComponent = await route.loadComponent();
                if(loadedComponent instanceof Type){
                    this.componentRouteMap.set(loadedComponent, `${path}`);
                }
                if(loadedComponent && typeof loadedComponent === 'object' && 'default' in loadedComponent) {
                    if(loadedComponent.default instanceof Type){
                        this.componentRouteMap.set(loadedComponent.default, `${path}`);
                    }
                }
            }

            if(route.children) {
                await this.buildMap(`${path}`, route.children);
                continue;
            }

            if(route.loadChildren) {
                const loadedChildren = await route.loadChildren();
                if(loadedChildren instanceof Array){
                    await this.buildMap(`${path}`, loadedChildren);
                    continue;
                }
                if(loadedChildren && typeof loadedChildren === 'object' && 'default' in loadedChildren) {
                    await this.buildMap(`${path}`, (loadedChildren as { default: Route[] }).default);
                    continue;
                }
            }
        }
    }

    private _isCurrentComponent(target: Type<any>): boolean {
        const targetPath = this.componentRouteMap.get(target);
        if (!targetPath) return false;

        const currentUrl = this._router.url.split('?')[0].split('#')[0];
        return currentUrl === targetPath;
    }

    async currentComponentType(): Promise<Type<any> | null> {
        if(this.componentRouteMap.size === 0) {
            await this.buildMap('', this._router.config);
        }
        
        const currentUrl = this._router.url.split('?')[0].split('#')[0];
        const entries = Array.from(this.componentRouteMap.entries()).reverse();

        for (let [component, path] of entries) {
            if (currentUrl === path) return component;
        }
        return null;
    }

}