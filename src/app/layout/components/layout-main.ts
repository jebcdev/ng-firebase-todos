import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'layout-main',
  imports: [RouterOutlet],
  template: `<router-outlet/>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-1 w-full flex items-start justify-center px-4 py-4' }
})
export class LayoutMain {

}
