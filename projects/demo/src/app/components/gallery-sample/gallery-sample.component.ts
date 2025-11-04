import { Component } from '@angular/core';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { GalleryComponent } from 'project/gallery/gallery.component';
import { GalleryToggleDirective } from 'project/gallery/gallery-toggle.directive';

@Component({
  selector: 'app-gallery-sample',
  imports: [SampleContainerComponent, GalleryComponent, GalleryToggleDirective],
  templateUrl: './gallery-sample.component.html',
})
export class GallerySampleComponent {

  images = [1,2,3,4,5,6,7,8,9,10].map(i => `images/gallery/${i}.png`);

}
