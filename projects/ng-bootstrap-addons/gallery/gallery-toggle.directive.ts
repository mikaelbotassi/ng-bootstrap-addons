import { Directive, HostListener, inject } from '@angular/core';
import { GalleryComponent } from './gallery.component';

@Directive({
  selector: '[galleryToggle]'
})
export class GalleryToggleDirective {

  private _galleryComponent = inject(GalleryComponent);

  @HostListener('click')
  show(): void {
    this._galleryComponent.showGallery();
  }
}
