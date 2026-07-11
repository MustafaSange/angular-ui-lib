import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BasicTextFieldShowcase } from './showcases/basic-text-field/basic-text-field';
import { DisabledFieldShowcase } from './showcases/disabled-field/disabled-field';
import { DisplayValuesShowcase } from './showcases/display-values/display-values';
import { FieldActionsShowcase } from './showcases/field-actions/field-actions';
import { FieldLayoutUtilitiesShowcase } from './showcases/field-layout-utilities/field-layout-utilities';
import { FieldWithHintShowcase } from './showcases/field-with-hint/field-with-hint';
import { PrefixFieldShowcase } from './showcases/prefix-field/prefix-field';
import { ReadonlyFieldShowcase } from './showcases/readonly-field/readonly-field';
import { RequiredEmailFieldShowcase } from './showcases/required-email-field/required-email-field';
import { SearchFieldShowcase } from './showcases/search-field/search-field';
import { SegmentedSuffixActionShowcase } from './showcases/segmented-suffix-action/segmented-suffix-action';
import { SuffixFieldShowcase } from './showcases/suffix-field/suffix-field';
import { TextareaFieldShowcase } from './showcases/textarea-field/textarea-field';

@Component({
  selector: 'app-form-fields',
  imports: [
    RouterLink,
    BasicTextFieldShowcase,
    FieldLayoutUtilitiesShowcase,
    RequiredEmailFieldShowcase,
    FieldWithHintShowcase,
    TextareaFieldShowcase,
    PrefixFieldShowcase,
    SuffixFieldShowcase,
    SearchFieldShowcase,
    FieldActionsShowcase,
    SegmentedSuffixActionShowcase,
    DisabledFieldShowcase,
    ReadonlyFieldShowcase,
    DisplayValuesShowcase,
  ],
  templateUrl: './form-fields.html',
  styleUrl: './form-fields.scss',
})
export class FormFields {}
