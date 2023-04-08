import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ufwLDisablePullToRefresh]',
  standalone: true,
})
export class DisablePullToRefreshDirective implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.disablePullToRefresh();
  }

  private disablePullToRefresh(): void {
    let lastTouchY = 0;
    const touchstartHandler = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        lastTouchY = event.touches[0].clientY;
      }
    };

    const touchmoveHandler = (event: TouchEvent) => {
      const touchY = event.touches[0].clientY;
      const touchYDelta = touchY - lastTouchY;

      if (window.pageYOffset === 0 && touchYDelta > 0) {
        event.preventDefault();
      }

      lastTouchY = touchY;
    };

    this.renderer.listen(
      this.el.nativeElement,
      'touchstart',
      touchstartHandler
    );
    this.renderer.listen(this.el.nativeElement, 'touchmove', touchmoveHandler);
  }
}
