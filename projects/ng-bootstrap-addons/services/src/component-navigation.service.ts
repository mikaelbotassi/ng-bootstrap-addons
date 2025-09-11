// component-navigation.service.ts
import { Location } from '@angular/common';
import { Injectable, Type } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class ComponentNavigationService {
    
    private _componentRouteMap = new Map<Type<any>, string>();

    constructor(private _router: Router, private _location: Location) {}

    async go(component: any, state?: any) {

        if(this._componentRouteMap.has(component)){
            this._router.navigate([`/${this._componentRouteMap.get(component)}`], { state: state });
            return;
        }

        await this.buildMap('', this._router.config)

        const path = this._componentRouteMap.get(component);

        if (!path) throw new Error('Rota não encontrada para componente ' + component.name);

        this._router.navigate([`/${path}`], { state: state });
    }

    async goBack() {
        this._location.back();
    }

    async buildMap(parentPath: string|undefined, routes: Route[]) {
        for(let route of routes) {
            let path = '';
            if(parentPath) path = parentPath;
            if(route.path) path += `/${route.path}`;

            if(route.component){
                this._componentRouteMap.set(route.component, `${path}`);
            }
            
            if(route.loadComponent) {
                const loadedComponent = await route.loadComponent();
                if(loadedComponent instanceof Type){
                    this._componentRouteMap.set(loadedComponent, `${path}`);
                }
                if(loadedComponent && typeof loadedComponent === 'object' && 'default' in loadedComponent) {
                    if(loadedComponent.default instanceof Type){
                        this._componentRouteMap.set(loadedComponent.default, `${path}`);
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

}