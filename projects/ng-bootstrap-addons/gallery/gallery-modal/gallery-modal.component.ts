import { Component, output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'nba-gallery-modal',
  imports: [CarouselModule],
  templateUrl: './gallery-modal.component.html',
})
export class GalleryModalComponent {

  imagesPaths: string[] = [];
  index: number = 0;
  hidden = output<void>();

  hide(){
    this.hidden.emit();
    this.modalRef.hide();
  }

  constructor(public modalRef: BsModalRef) {}

}
