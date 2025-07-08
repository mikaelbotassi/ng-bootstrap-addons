import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DragDropUploadComponent,
  FileUpload,
} from 'ng-bootstrap-addons/drag-drop-upload';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { By } from '@angular/platform-browser';

describe('DragDropUploadComponent', () => {
  let fixture: ComponentFixture<DragDropUploadComponent>;
  let component: DragDropUploadComponent;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DragDropUploadComponent],
      providers: [
        {
          provide: DomSanitizer,
          useValue: jasmine.createSpyObj('DomSanitizer', [
            'bypassSecurityTrustUrl',
          ]),
        },
      ],
    });

    fixture = TestBed.createComponent(DragDropUploadComponent);
    component = fixture.componentInstance;
    sanitizer = TestBed.inject(DomSanitizer);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize inputs with default values', () => {
    expect(component.accept()).toBe('file/*');
    expect(component.multiple()).toBeFalse();
    expect(component.disabled()).toBeFalse();
    expect(component.required()).toBeFalse();
  });

  it('should process files (single) and populateData', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:test-url');
    const bypassSpy = sanitizer.bypassSecurityTrustUrl as jasmine.Spy;
    bypassSpy.and.callFake((url) => url as SafeUrl);

    component.processFiles({
      length: 1,
      item: () => file,
      [Symbol.iterator]: function* () {
        yield file;
      },
    } as FileList);

    const files = component.files();
    expect(files.length).toBe(1);
    expect(files[0].url).toBe('blob:test-url');
    expect(bypassSpy).toHaveBeenCalledWith('blob:test-url');
  });

  it('should process multiple files when multiple() is true', () => {
    (component as any).multiple = () => true;

    const file1 = new File(['a'], 'a.txt', { type: 'text/plain' });
    const file2 = new File(['b'], 'b.txt', { type: 'text/plain' });

    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');

    const bypassSpy = sanitizer.bypassSecurityTrustUrl as jasmine.Spy;
    bypassSpy.and.callFake((url) => url as SafeUrl);

    component.processFiles({
      length: 2,
      item: (i: number) => (i === 0 ? file1 : file2),
      [Symbol.iterator]: function* () {
        yield file1;
        yield file2;
      },
    } as FileList);

    expect(component.files().length).toBe(2);
  });

  it('should remove file and revoke URL', () => {
    const revokeSpy = spyOn(window.URL, 'revokeObjectURL');
    component.files.set([
      { name: 'file.txt', isImage: false, url: 'blob:url' },
    ]);

    component.removeFile(0);
    expect(component.files().length).toBe(0);
    expect(revokeSpy).toHaveBeenCalledWith('blob:url');
  });

  it('should call downloadFile and create link', () => {
    const file = new File(['data'], 'download.txt', { type: 'text/plain' });
    const fileUpload: FileUpload = {
      data: file,
      name: 'download.txt',
      isImage: false,
      url: 'blob:url',
    };

    const createObjectURLSpy = spyOn(
      window.URL,
      'createObjectURL'
    ).and.returnValue('blob:download-url');
    const revokeSpy = spyOn(window.URL, 'revokeObjectURL');
    const clickSpy = jasmine.createSpy('click');
    spyOn(document, 'createElement').and.returnValue({
      set href(value: string) {},
      set download(value: string) {},
      click: clickSpy,
    } as any);

    component.downloadFile(fileUpload);

    expect(createObjectURLSpy).toHaveBeenCalledWith(file);
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalledWith('blob:download-url');
  });

  it('should call stopEvent and change border on drag over', () => {
    const event = {
      preventDefault: jasmine.createSpy(),
      stopPropagation: jasmine.createSpy(),
      target: document.createElement('div'),
    } as any;

    component.onDragOver(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.target.style.borderColor).toBe('var(--sm-primary)');
  });

  it('should reset border on drag leave', () => {
    const event = {
      preventDefault: jasmine.createSpy(),
      stopPropagation: jasmine.createSpy(),
      target: document.createElement('div'),
    } as any;

    component.onDragLeave(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.target.style.borderColor).toBe('var(--sm-secondary)');
  });

  it('should process files on drop', () => {
    const file = new File(['x'], 'drop.txt');
    const dataTransfer = {
      files: {
        length: 1,
        item: () => file,
      } as unknown as FileList,
    };

    spyOn(component, 'processFiles');

    const event = {
      preventDefault: jasmine.createSpy(),
      stopPropagation: jasmine.createSpy(),
      target: document.createElement('div'),
      dataTransfer,
    } as any;

    component.onDrop(event);
    expect(component.processFiles).toHaveBeenCalledWith(dataTransfer.files);
  });

  it('should revoke object URLs on destroy', () => {
    const revokeSpy = spyOn(window.URL, 'revokeObjectURL');
    component.files.set([
      { name: 'a', url: 'url1', isImage: false },
      { name: 'b', url: 'url2', isImage: false },
    ]);
    component.ngOnDestroy();
    expect(revokeSpy).toHaveBeenCalledWith('url1');
    expect(revokeSpy).toHaveBeenCalledWith('url2');
  });
});
