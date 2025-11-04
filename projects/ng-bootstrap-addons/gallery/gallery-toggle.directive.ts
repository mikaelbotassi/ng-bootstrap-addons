import { Directive, HostListener, inject } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { GalleryModalComponent } from './gallery-modal/gallery-modal.component';
import { GalleryComponent } from './gallery.component';

@Directive({
  selector: '[galleryToggle]'
})
export class GalleryToggleDirective {

  private _modalService = inject(BsModalService);
  private _galleryComponent = inject(GalleryComponent);

  @HostListener('click')
  show(): void {
    this._galleryComponent.shown.set(true);
    this._galleryComponent.modalRef = this._modalService.show(GalleryModalComponent, {
      initialState: {
        imagesPaths: this._galleryComponent.images(),
        index: this._galleryComponent.startIndex()
      }
    });
    this._galleryComponent.modalRef.content!.hidden.subscribe(() => {
      this._galleryComponent.shown.set(false);
    });
  }
}
