import { booleanAttribute, Component, EventEmitter, input, Input, model, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { createRandomString, stopEvent } from 'ng-bootstrap-addons/utils';
import { LabelComponent } from 'ng-bootstrap-addons/label';

@Component({
    selector: 'nba-drag-drop-upload',
    imports: [CommonModule, LabelComponent],
    templateUrl: './drag-drop-upload.component.html',
    styleUrls: ['./drag-drop-upload.component.scss'],
    host: { 'collision-id': `drag-drop-upload-${createRandomString(20)} ` },
})
export class DragDropUploadComponent implements OnDestroy{

  readonly files = model<FileUpload[]>([]);
  readonly label = input<string>();
  readonly required = input(false, {transform: booleanAttribute});
  readonly disabled = input(false, {transform: booleanAttribute});
  readonly accept = input<string>('file/*');
  readonly multiple = input(false, {transform: booleanAttribute});

  constructor(private _sanitizer: DomSanitizer) {}

  onDragOver(event: Event): void {
    stopEvent(event);
    if(this.disabled()) return;
    (event.target as HTMLElement).style.borderColor = 'var(--sm-primary)';
  }

  onDragLeave(event: Event): void {
    stopEvent(event);
    if(this.disabled()) return;

    (event.target as HTMLElement).style.borderColor = 'var(--sm-secondary)';
  }

  onDrop(event: DragEvent): void {
    stopEvent(event);
    if(this.disabled()) return;
    (event.target as HTMLElement).style.borderColor = 'var(--sm-primary)';
    if (event.dataTransfer) {
      const files = event.dataTransfer.files;
      this.processFiles(files);
    }
    (event.target as HTMLElement).style.borderColor = 'var(--sm-secondary)';
  }

  ngOnDestroy(): void {
    this.files().forEach(file => {
      URL.revokeObjectURL(file.url);
    });
  }

  onFileSelect = (event: any) => this.processFiles(event.target.files);

  processFiles(files: FileList): void {
    if(!this.multiple){
      this.files.set([]);
      if(files.item(0)) this.populateData(files.item(0)!);
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if(file) this.populateData(file!);
    }
  }

  populateData(file:File):void{
    if (file.type.match(/image.*/)) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const url = e.target.result;
        this.files.update((files) => [...files, { data: file, safeUrl: this.getSafeUrl(url), name: file.name, isImage: true, url: url}]);
      };
      reader.readAsDataURL(file);
      return;
    }
    const url = window.URL.createObjectURL(file);
    this.files.update(files => [...files, { data: file, name: file.name, isImage: false, safeUrl:this.getSafeUrl(url), url: url}]);
  }

  getSafeUrl(url:string):SafeUrl{
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }

  removeFile = (index: number) => {
    window.URL.revokeObjectURL(this.files()[index].url);
    this.files.update(files => files.filter((_, i) => i !== index));
  }

  downloadFile(file:FileUpload): void {
    const data = window.URL.createObjectURL(file.data!);
    const link = document.createElement("a");
    link.href = data;
    link.download = file.name;
    link.click();
    window.URL.revokeObjectURL(data);
  }

}

export class FileUpload{
  data?: File;
  safeUrl?: SafeUrl;
  url!: string;
  name: string;
  isImage: boolean;

  constructor(parameters: FileUpload){
    this.data = parameters.data;
    this.name = parameters.name;
    this.isImage = parameters.isImage;
    this.safeUrl = parameters.safeUrl;
    this.url = parameters.url;
  }

}

export const loadFiles = (list: Array<File>, sanitizer:DomSanitizer): FileUpload[] => {
  return list.map((file:File) => {
    const url = window.URL.createObjectURL(file);
    return new FileUpload({
        data: file,
        safeUrl: sanitizer.bypassSecurityTrustUrl(url),
        name: file.name,
        isImage: !!file.type.match(/image.*/),
        url: url
    });
  });
}