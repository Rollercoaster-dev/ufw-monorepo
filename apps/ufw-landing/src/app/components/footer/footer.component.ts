import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ufw-l-footer',
  standalone: true,
  imports: [CommonModule],
  template: ` <footer>
    <div class="flex justify-center p-4">
      <div class="text-sm">© 2023 Gorjeoux Moon & Rollercoaster.dev</div>
    </div>
  </footer>`,
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  @HostBinding('class') class = 'fixed inset-x-0 bottom-0';
}
