import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShowcaseCode } from '../../shared/showcase-code';

@Component({
  selector: 'app-tables',
  imports: [RouterLink, ShowcaseCode],
  templateUrl: './tables.html',
  styleUrl: './tables.scss',
})
export class Tables {
  protected readonly snippets = {
    basic: `import { Component } from '@angular/core';

@Component({
  selector: 'app-basic-table-example',
  template: \`
    <div class="table-wrapper">
      <table class="table">
        <caption>Recent invoices</caption>
        <thead>
          <tr>
            <th scope="col" class="text-start">Invoice</th>
            <th scope="col" class="text-start">Customer</th>
            <th scope="col" class="text-start">Status</th>
            <th scope="col" class="text-end">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-start">INV-2048</td>
            <td class="text-start">Northwind Studio</td>
            <td class="text-start">Paid</td>
            <td class="text-end">$4,200.00</td>
          </tr>
          <tr>
            <td class="text-start">INV-2049</td>
            <td class="text-start">Acme Supply</td>
            <td class="text-start">Pending</td>
            <td class="text-end">$1,180.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  \`,
})
export class BasicTableExample {}`,
    compact: `import { Component } from '@angular/core';

@Component({
  selector: 'app-compact-table-example',
  template: \`
    <div class="table-wrapper">
      <table class="table table-compact">
        <caption>Compact queue</caption>
        <thead>
          <tr>
            <th scope="col" class="text-start">Task</th>
            <th scope="col" class="text-start">Owner</th>
            <th scope="col" class="text-start">Due</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-start">Review copy</td>
            <td class="text-start">Mina</td>
            <td class="text-start">Today</td>
          </tr>
          <tr>
            <td class="text-start">Publish notes</td>
            <td class="text-start">Omar</td>
            <td class="text-start">Tomorrow</td>
          </tr>
        </tbody>
      </table>
    </div>
  \`,
})
export class CompactTableExample {}`,
    stripedHover: `import { Component } from '@angular/core';

@Component({
  selector: 'app-striped-hover-table-example',
  template: \`
    <div class="table-wrapper">
      <table class="table table-striped table-hover">
        <caption>Team availability</caption>
        <thead>
          <tr>
            <th scope="col" class="text-start">Name</th>
            <th scope="col" class="text-start">Role</th>
            <th scope="col" class="text-start">Availability</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-start">Layla</td>
            <td class="text-start">Design</td>
            <td class="text-start">Available</td>
          </tr>
          <tr>
            <td class="text-start">Samir</td>
            <td class="text-start">Engineering</td>
            <td class="text-start">In review</td>
          </tr>
          <tr>
            <td class="text-start">Nadia</td>
            <td class="text-start">Research</td>
            <td class="text-start">Focused</td>
          </tr>
        </tbody>
      </table>
    </div>
  \`,
})
export class StripedHoverTableExample {}`,
    numeric: `import { Component } from '@angular/core';

@Component({
  selector: 'app-numeric-table-example',
  template: \`
    <div class="table-wrapper">
      <table class="table">
        <caption>Plan usage</caption>
        <thead>
          <tr>
            <th scope="col" class="text-start">Plan</th>
            <th scope="col" class="text-end">Seats</th>
            <th scope="col" class="text-end">Usage</th>
            <th scope="col" class="text-end">Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-start">Starter</td>
            <td class="text-end">12</td>
            <td class="text-end">68%</td>
            <td class="text-end">$240</td>
          </tr>
          <tr>
            <td class="text-start">Business</td>
            <td class="text-end">48</td>
            <td class="text-end">81%</td>
            <td class="text-end">$1,920</td>
          </tr>
        </tbody>
      </table>
    </div>
  \`,
})
export class NumericTableExample {}`,
    empty: `import { Component } from '@angular/core';

@Component({
  selector: 'app-empty-table-example',
  template: \`
    <div class="table-wrapper">
      <table class="table">
        <caption>Invitations</caption>
        <thead>
          <tr>
            <th scope="col" class="text-start">Email</th>
            <th scope="col" class="text-start">Role</th>
            <th scope="col" class="text-start">Sent</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="table-empty" colspan="3">No invitations have been sent.</td>
          </tr>
        </tbody>
      </table>
    </div>
  \`,
})
export class EmptyTableExample {}`,
    loading: `import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-table-example',
  template: \`
    <div class="table-wrapper">
      <table class="table">
        <caption>Sync history</caption>
        <thead>
          <tr>
            <th scope="col" class="text-start">Source</th>
            <th scope="col" class="text-start">Status</th>
            <th scope="col" class="text-start">Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="table-loading" colspan="3">Loading sync history...</td>
          </tr>
        </tbody>
      </table>
    </div>
  \`,
})
export class LoadingTableExample {}`,
    rtl: `import { Component } from '@angular/core';

@Component({
  selector: 'app-rtl-table-example',
  template: \`
    <div class="table-wrapper" dir="rtl">
      <table class="table">
        <caption>الفواتير الأخيرة</caption>
        <thead>
          <tr>
            <th scope="col" class="text-start">الفاتورة</th>
            <th scope="col" class="text-start">العميل</th>
            <th scope="col" class="text-end">المبلغ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-start">INV-2050</td>
            <td class="text-start">استوديو الدوحة</td>
            <td class="text-end">ر.ق ٣٬٤٠٠</td>
          </tr>
          <tr>
            <td class="text-start">INV-2051</td>
            <td class="text-start">شركة الخليج</td>
            <td class="text-end">ر.ق ١٬٢٥٠</td>
          </tr>
        </tbody>
      </table>
    </div>
  \`,
})
export class RtlTableExample {}`,
  };
}
