import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[input-password]',
  standalone: true
})
export class InputPasswordDirective {
  private showPassword: boolean = false;
  private eyeIcon!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.eyeIcon = this.renderer.createElement('i');
    this.renderer.addClass(this.eyeIcon, 'password-eye-icon');
    this.renderer.addClass(this.eyeIcon, 'eye');
    this.renderer.listen(this.eyeIcon, 'mousedown', (event) => this.togglePasswordVisibility(event));
    this.renderer.appendChild(this.el.nativeElement.parentNode, this.eyeIcon);
  }

  @HostListener('focus') onFocus() {
    this.renderer.setStyle(this.eyeIcon, 'display', 'block');
  }

  @HostListener('blur') onBlur() {
    setTimeout(() => {
      if (!this.showPassword) {
        this.renderer.setStyle(this.eyeIcon, 'display', 'none');
      }
    }, 200);
  }

  private togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault();
    this.showPassword = !this.showPassword;
    const inputType = this.showPassword ? 'text' : 'password';
    this.renderer.setAttribute(this.el.nativeElement, 'type', inputType);
    this.renderer.removeClass(this.eyeIcon, this.showPassword ? 'eye' : 'eye-off');
    this.renderer.addClass(this.eyeIcon, this.showPassword ? 'eye-off' : 'eye');
  }
}