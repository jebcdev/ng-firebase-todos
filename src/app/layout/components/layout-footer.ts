import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'layout-footer',
  imports: [],
  template: `<span>&copy;2025</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'w-full bg-gray-800 text-gray-400 h-12 flex items-center justify-center mt-auto shadow-inner' }
})
export class LayoutFooter {

}
