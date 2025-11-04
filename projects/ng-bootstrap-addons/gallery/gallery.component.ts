import { booleanAttribute, Component, effect, inject, input, model, output, viewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GalleryModalComponent } from './gallery-modal/gallery-modal.component';
import { GalleryToggleDirective } from './gallery-toggle.directive';

@Component({
  selector: '[nba-gallery]',
  imports: [],
  templateUrl: './gallery.component.html',
})
export class GalleryComponent {

  private _modalService = inject(BsModalService);

  onShown = effect(() => {
    const show = this.shown();
    if(this.modalRef && show) return;
    if(show) {
      this.showGallery();
    }
  });
  
  images = input<string[]>([]);
  startIndex = input<number>(0);
  modalRef?: BsModalRef

  shown = model(false);
  hidden = output<void>();

  showGallery(): void {
    this.shown.set(true);
    this.modalRef = this._modalService.show(GalleryModalComponent, {
      initialState: {
        imagesPaths: this.images(),
        index: this.startIndex()
      }
    });
    this.modalRef.content!.hidden.subscribe(() => {
      this.shown.set(false);
      this.hidden.emit();
      this.modalRef = undefined;
    });
  }

}