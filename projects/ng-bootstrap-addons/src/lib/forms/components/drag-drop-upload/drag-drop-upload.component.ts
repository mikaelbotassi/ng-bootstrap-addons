import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { stopEvent } from '../../../../utils/functions';

@Component({
    selector: 'nba-drag-drop-upload',
    imports: [CommonModule],
    templateUrl: './drag-drop-upload.component.html',
    styleUrls: ['./drag-drop-upload.component.scss']
})
export class DragDropUploadComponent implements OnDestroy{

  @Input() files: FileUpload[] = [];
  @Output() filesChange = new EventEmitter<FileUpload[]>();
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() accept: string = 'file/*';
  
  private _multiple: boolean = false;

  @Input()
  set multiple(value: boolean) {
    this._multiple = value !== null && `${value}` !== 'false';
  }

  get multiple(): boolean {
    return this._multiple;
  }

  constructor(private _sanitizer: DomSanitizer) {}

  onDragOver(event: Event): void {
    stopEvent(event);
    if(this.disabled) return;
    (event.target as HTMLElement).style.borderColor = 'var(--sm-primary)';
  }

  onDragLeave(event: Event): void {
    stopEvent(event);
    if(this.disabled) return;

    (event.target as HTMLElement).style.borderColor = 'var(--sm-secondary)';
  }

  onDrop(event: DragEvent): void {
    stopEvent(event);
    if(this.disabled) return;
    (event.target as HTMLElement).style.borderColor = 'var(--sm-primary)';
    if (event.dataTransfer) {
      const files = event.dataTransfer.files;
      this.processFiles(files);
    }
    (event.target as HTMLElement).style.borderColor = 'var(--sm-secondary)';
  }

  ngOnDestroy(): void {
    this.files.forEach(file => {
      URL.revokeObjectURL(file.url);
    });
  }

  onFileSelect = (event: any) => this.processFiles(event.target.files);

  processFiles(files: FileList): void {
    if(!this.multiple){
      this.files = [];
      if(files.item(0)) this.populateData(files.item(0)!);
    }else{
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if(file) this.populateData(file!);
      }
    }
    this.filesChange.emit(this.files);
  }

  populateData(file:File):void{
    if (file.type.match(/image.*/)) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const url = e.target.result;
        this.files.push({ data: file, safeUrl: this.getSafeUrl(url), name: file.name, isImage: true, url: url});
      };
      reader.readAsDataURL(file);
    } else {
      const url = window.URL.createObjectURL(file);
      this.files.push({ data: file, name: file.name, isImage: false, safeUrl:this.getSafeUrl(url), url: url});
    }
  }

  getSafeUrl(url:string):SafeUrl{
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }

  removeFile = (index: number) => {
    window.URL.revokeObjectURL(this.files[index].url);
    this.files.splice(index, 1);
    this.filesChange.emit(this.files);
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