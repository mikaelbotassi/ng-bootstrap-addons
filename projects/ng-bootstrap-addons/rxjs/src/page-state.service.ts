import { Location } from '@angular/common';
import { computed, effect, inject, Injectable, signal, Type } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Route, Router, RoutesRecognized } from '@angular/router';
import { filter, firstValueFrom, map, startWith, take } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PageStateService {
    
    private _router = inject(Router);

    componentRouteMap = signal(new Map<Type<any>, string>());
    private _stateBus = signal(new Map<Type<any>, any>());
    readonly stateBus = computed(() => this._stateBus());
    private _isMapBuilt = signal(false);
    private _replaceState:boolean = true;
    
    private readonly _navigationState = toSignal(
        this._router.events.pipe(
            filter((e): e is NavigationEnd => e instanceof NavigationEnd),
            map(() => history.state),
            startWith(history.state)
        ),
        { initialValue: history.state }
    );

    currentUrl = toSignal(
        this._router.events.pipe(
            filter((e): e is NavigationEnd => e instanceof NavigationEnd),
            map(e => e.urlAfterRedirects),
            startWith(this._router.url)
        ),
        { initialValue: this._router.url }
    );

    currentComponent = computed(() => {
        const url = this.currentUrl();
        this.componentRouteMap();
        return this.getComponentByUrl(url);
    });

    constructor(private _location: Location) {
        this._buildMapSync();

        effect(() => {
            const state = this._navigationState();
            const currentComponent = this.currentComponent();
            if(!currentComponent) return;
            if(this._replaceState) {
                this._putStateBus(currentComponent, state);
                return;
            }
            const currentState = this.getStateByComponent(currentComponent);
            this._replaceHistoryState(currentState, true);
            this._replaceState = true;
        });
    }

    async init(): Promise<void> {
        if (this._isMapBuilt()) return Promise.resolve();

        return firstValueFrom(
            this._router.events.pipe(
            filter((e): e is RoutesRecognized => e instanceof RoutesRecognized),
            take(1),
        )).then(() => this._buildMapSync())
        .catch(() => this._buildMapSync());
    }

    go<T extends object = any>(component: Type<any>, state?: T): void {
        this._ensureMapBuilt();
        
        const path = this.componentRouteMap().get(component);
        if (!path) throw new Error('Rota não encontrada para componente ' + component.name);
        
        this._replaceStateOrNavigate<T>(component, state);
    }

    navigate(component: Type<any>): void {
        this._ensureMapBuilt();
        
        const path = this.componentRouteMap().get(component);
        if (!path) throw new Error('Rota não encontrada para componente ' + component.name);
        this._replaceState = false;
        this._router.navigate([`/${path}`]);
    }

    goBack(): void {
        this._location.back();
    }

    setState<T extends object = any>(state?: T, component?: Type<any>): void {
        const currentComponent = component ?? this.currentComponent();
        if (!currentComponent || !this.componentRouteMap().has(currentComponent)) throw new Error('Nenhum componente ativo para definir o estado');
        this._putStateBus<T>(currentComponent, state);
    }

    getStateByComponent<T extends object = any>(component: Type<any>): T | null {
        const map = this._stateBus();
        return (map.get(component) as T | null) ?? (window.history.state as T ?? null);
    }

    private _replaceStateOrNavigate<T extends object = any>(component: Type<any>, state?: T): void {
        if (this.currentComponent() == component) {
            this._putStateBus(component, state);
            return;
        }
        this._replaceState = true;
        this._router.navigate([`/${this.componentRouteMap().get(component)}`], { state: state });
    }

    private _putStateBus<T extends object = any>(component: Type<any>, state?: T): void {
        this._replaceHistoryState(state, false);

        this._stateBus.update(prev => {
            const next = new Map(prev);
            next.set(component, state);
            return next;
        });
    }

    private _replaceHistoryState<T extends object = any>(patch: T | undefined, merge = true): void {
        const current = window.history.state ?? {};
        const next = merge ? { ...current, ...(patch ?? {}) } : (patch ?? null);
        this._location.replaceState(this._location.path(), '', next as any);
    }

    private _buildMapSync(): void {
        try {
            this._buildMapRecursive('', this._router.config);
            this._isMapBuilt.set(true);
        } catch (error) {
            console.warn('Erro ao construir mapa de rotas:', error);
        }
    }

    private _setRouteMap(component: Type<any>, path: string): void {
        this.componentRouteMap.update(prev => {
            const next = new Map(prev);
            next.set(component, path);
            return next;
        });
    }

    private _buildMapRecursive(parentPath: string, routes: Route[]): void {
        for(let route of routes) {
            let path = '';
            if(parentPath) path = parentPath;
            if(route.path) path += `/${route.path}`;

            if(route.component){
                this._setRouteMap(route.component, path);
            }
            
            if(route.loadComponent) {
                this._registerLazyComponent(route.loadComponent, path);
            }

            if(route.children) {
                this._buildMapRecursive(path, route.children);
            }

            if(route.loadChildren) {
                this._registerLazyChildren(route.loadChildren, path);
            }
        }
    }

    private _registerLazyComponent(loadComponent: () => any, path: string): void {
        try {
            const result = loadComponent();
            if (result && typeof result.then === 'function') {
                result.then((loadedComponent: any) => {
                    this._processLoadedComponent(loadedComponent, path);
                });
            } else {
                this._processLoadedComponent(result, path);
            }
        } catch (error) {
            console.warn('Erro ao carregar componente lazy:', error);
        }
    }

    private _processLoadedComponent(loadedComponent: any, path: string): void {
        if(loadedComponent instanceof Function){
            this._setRouteMap(loadedComponent, path);
            return;
        }
        if(loadedComponent?.default instanceof Function) {
            this._setRouteMap(loadedComponent.default, path);
        }
    }

    private _registerLazyChildren(loadChildren: () => any, path: string): void {
        try {
            const result = loadChildren();
            if (result && typeof result.then === 'function') {
                result.then((loadedChildren: any) => {
                    this._processLoadedChildren(loadedChildren, path);
                });
            } else {
                this._processLoadedChildren(result, path);
            }
        } catch (error) {
            console.warn('Erro ao carregar children lazy:', error);
        }
    }

    private _processLoadedChildren(loadedChildren: any, path: string): void {
        if(Array.isArray(loadedChildren)){
            this._buildMapRecursive(path, loadedChildren);
        } else if(loadedChildren?.default && Array.isArray(loadedChildren.default)) {
            this._buildMapRecursive(path, loadedChildren.default);
        }
    }

    private _ensureMapBuilt(): void {
        if (!this._isMapBuilt()) {
            this._buildMapSync();
        }
    }

    getComponentByUrl(url: string): Type<any> | null {
        this._ensureMapBuilt();
        const entries = Array.from(this.componentRouteMap().entries()).reverse();
        for (let [component, path] of entries) {
            if (url === path) return component;
        }
        return null;
    }
}