import { NgModule } from "@angular/core";
import { EmptyDataComponent } from "ng-bootstrap-addons/components";
import { ClickOutsideDirective, ControlValueAccessorDirective, CurrencyDirective, InputPasswordDirective } from "ng-bootstrap-addons/directives";
import { DragDropUploadComponent } from "ng-bootstrap-addons/drag-drop-upload";
import { FormErrorMessageComponent } from "ng-bootstrap-addons/form-error-message";
import { AutoCompleteLovComponent, DatetimeRangePickerComponent, InputComponent, InputPlaceholderComponent, SwitchComponent } from "ng-bootstrap-addons/inputs";
import { NumericPipe } from "ng-bootstrap-addons/pipes";
import { MultiselectComponent, SelectComponent } from "ng-bootstrap-addons/selects";
import { TextAreaComponent, TextareaPlaceholderComponent } from "ng-bootstrap-addons/textarea";

@NgModule({
    imports: [
        //Pipes
        NumericPipe,
        //Directives
        ClickOutsideDirective,
        ControlValueAccessorDirective,
        CurrencyDirective,
        InputPasswordDirective,
        //Components
        DragDropUploadComponent,
        FormErrorMessageComponent,
        AutoCompleteLovComponent,
        DatetimeRangePickerComponent,
        InputComponent,
        InputPlaceholderComponent,
        SwitchComponent,
        SelectComponent,
        MultiselectComponent,
        TextAreaComponent,
        TextareaPlaceholderComponent,
        EmptyDataComponent
    ],
    exports: [
        //Pipes
        NumericPipe,
        //Directives
        ClickOutsideDirective,
        ControlValueAccessorDirective,
        CurrencyDirective,
        InputPasswordDirective,
        //Components
        DragDropUploadComponent,
        FormErrorMessageComponent,
        AutoCompleteLovComponent,
        DatetimeRangePickerComponent,
        InputComponent,
        InputPlaceholderComponent,
        SwitchComponent,
        SelectComponent,
        MultiselectComponent,
        TextAreaComponent,
        TextareaPlaceholderComponent,
        EmptyDataComponent
    ]
})
export class NgBootstrapAddonsModule{}