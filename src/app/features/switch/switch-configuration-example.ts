import { Component } from '@angular/core';

import { SwitchControl, SwitchGroup } from '../../shared/ui-lib';
import { UI_LIB_CONFIG } from '../../shared/ui-lib/services/config/ui-lib-config-token';
import type { UiLibConfig } from '../../shared/ui-lib';

@Component({
  selector: 'app-switch-configuration-example',
  imports: [SwitchControl, SwitchGroup],
  // Scope these application defaults to the demo so other examples retain their styles.
  providers: [{
    provide: UI_LIB_CONFIG,
    useValue: {
      switch: {
        variant: 'slim-track',
        kind: 'success',
      },
    } satisfies UiLibConfig,
  }],
  template: `
    <ms-switch-group>
      <legend>Configured Switches</legend>
      <ms-switch-control>
        <input type="checkbox" role="switch" checked />
        <label>Success (Slim Track, Inherited)</label>
      </ms-switch-control>
      <ms-switch-control variant="classic">
        <input type="checkbox" role="switch" checked />
        <label>Success (Classic)</label>
      </ms-switch-control>
      <ms-switch-control kind="warning">
        <input type="checkbox" role="switch" checked />
        <label>Warning (Slim Track)</label>
      </ms-switch-control>
      <ms-switch-control kind="danger">
        <input type="checkbox" role="switch" checked />
        <label>Danger (Slim Track)</label>
      </ms-switch-control>
      <ms-switch-control kind="info">
        <input type="checkbox" role="switch" checked />
        <label>Info (Slim Track)</label>
      </ms-switch-control>
      <ms-switch-control variant="classic" kind="warning">
        <input type="checkbox" role="switch" checked />
        <label>Warning (Classic)</label>
      </ms-switch-control>
      <ms-switch-control variant="classic" kind="danger">
        <input type="checkbox" role="switch" checked />
        <label>Danger (Classic)</label>
      </ms-switch-control>
      <ms-switch-control variant="classic" kind="info">
        <input type="checkbox" role="switch" checked />
        <label>Info (Classic)</label>
      </ms-switch-control>
    </ms-switch-group>
  `,
})
export class SwitchConfigurationExample {}
