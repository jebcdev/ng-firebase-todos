import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutHeader, LayoutMain, LayoutFooter } from "@app/layout/components"
@Component({
  selector: 'app-layout',
  imports: [LayoutHeader, LayoutMain, LayoutFooter],
  template: `
<layout-header />
<layout-main />
<layout-footer />
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "flex flex-col min-h-screen bg-gray-900"
  }
})
export class Layout {

}
