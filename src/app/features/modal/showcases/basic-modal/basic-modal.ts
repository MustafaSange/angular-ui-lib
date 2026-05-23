import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ModalComponent } from '../../../../shared/components/modal';
import { ShowcaseCode } from '../../../../shared/components/showcase-code';

type BasicModalData = {
  name: string;
  owner: string;
};

@Component({
  selector: 'app-basic-modal-showcase',
  imports: [ModalComponent, ShowcaseCode],
  templateUrl: './basic-modal.html',
  styleUrl: './basic-modal.scss',
  host: {
    class: 'modal-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicModalShowcase {
  protected readonly isOpen = signal(false);
  protected readonly data: BasicModalData = {
    name: 'Analytics workspace',
    owner: 'Ada Lovelace',
  };

  protected readonly snippet = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ModalComponent } from './shared/components/modal';

type ProjectData = {
  name: string;
  owner: string;
};

@Component({
  selector: 'app-project-modal-example',
  imports: [ModalComponent],
  template: \`
    <button class="btn btn-primary" type="button" (click)="openModal()">
      Open modal
    </button>

    @if (isOpen()) {
      <ms-modal title="Project details" (close)="isOpen.set(false)">
        <div class="modal-stack">
          <p>
            <strong>{{ data.name }}</strong> is owned by {{ data.owner }}.
          </p>
        </div>
      </ms-modal>
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectModalExample {
  protected readonly isOpen = signal(false);
  protected readonly data: ProjectData = {
    name: 'Analytics workspace',
    owner: 'Ada Lovelace',
  };

  protected openModal(): void {
    this.isOpen.set(true);
  }
}`;

  protected openBasicModal(): void {
    this.isOpen.set(true);
  }
}
