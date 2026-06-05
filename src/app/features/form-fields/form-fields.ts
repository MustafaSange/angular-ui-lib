import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BasicTextFieldShowcase } from './showcases/basic-text-field/basic-text-field';
import { CheckboxGroupShowcase } from './showcases/checkbox-group-showcase/checkbox-group-showcase';
import { DisabledFieldShowcase } from './showcases/disabled-field/disabled-field';
import { FieldActionsShowcase } from './showcases/field-actions/field-actions';
import { FieldWithHintShowcase } from './showcases/field-with-hint/field-with-hint';
import { PrefixFieldShowcase } from './showcases/prefix-field/prefix-field';
import { RadioGroupShowcase } from './showcases/radio-group-showcase/radio-group-showcase';
import { ReadonlyFieldShowcase } from './showcases/readonly-field/readonly-field';
import { RequiredEmailFieldShowcase } from './showcases/required-email-field/required-email-field';
import { SearchFieldShowcase } from './showcases/search-field/search-field';
import { SegmentedSuffixActionShowcase } from './showcases/segmented-suffix-action/segmented-suffix-action';
import { SelectFieldShowcase } from './showcases/select-field/select-field';
import { SignalFormFieldShowcase } from './showcases/signal-form-field-showcase/signal-form-field-showcase';
import { SuffixFieldShowcase } from './showcases/suffix-field/suffix-field';
import { SwitchControlsShowcase } from './showcases/switch-controls-showcase/switch-controls-showcase';
import { TextareaFieldShowcase } from './showcases/textarea-field/textarea-field';

@Component({
  selector: 'app-form-fields',
  imports: [
    RouterLink,
    BasicTextFieldShowcase,
    SignalFormFieldShowcase,
    RequiredEmailFieldShowcase,
    SelectFieldShowcase,
    FieldWithHintShowcase,
    TextareaFieldShowcase,
    PrefixFieldShowcase,
    SuffixFieldShowcase,
    SearchFieldShowcase,
    FieldActionsShowcase,
    SegmentedSuffixActionShowcase,
    DisabledFieldShowcase,
    ReadonlyFieldShowcase,
    CheckboxGroupShowcase,
    RadioGroupShowcase,
    SwitchControlsShowcase,
  ],
  templateUrl: './form-fields.html',
  styleUrl: './form-fields.scss',
})
export class FormFields {}
