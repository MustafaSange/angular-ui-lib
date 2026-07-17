import { Component, signal } from '@angular/core';
import { FormField, form, required, schema, validate } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import { ShowcaseCode } from '../../shared/showcase-code';
import {
  DatePickerComponent,
  DateTimePickerComponent,
  DateTimePickerValue,
  SignalFormField,
  SignalFormHint,
  TimePickerComponent,
} from '../../shared/ui-lib';

type PickerFormModel = {
  date: string | null;
  time: string | null;
  formattedDate: string | null;
  constrainedDate: string | null;
  minuteTime: string | null;
  appointment: DateTimePickerValue;
};

@Component({
  selector: 'app-date-time-pickers',
  imports: [
    DatePickerComponent,
    DateTimePickerComponent,
    FormField,
    RouterLink,
    ShowcaseCode,
    SignalFormField,
    SignalFormHint,
    TimePickerComponent,
  ],
  templateUrl: './date-time-pickers.html',
  styleUrl: './date-time-pickers.scss',
})
export class DateTimePickers {
  private readonly formModel = signal<PickerFormModel>({
    date: null,
    time: '14:30:45',
    formattedDate: '2026-07-14',
    constrainedDate: null,
    minuteTime: '09:01',
    appointment: '2026-07-14T14:30',
  });

  protected readonly disableWeekends = (date: string): boolean => {
    const [year, month, day] = date.split('-').map(Number);
    const weekday = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1, 12).getDay();
    return weekday === 0 || weekday === 6;
  };

  protected readonly pickerForm = form(
    this.formModel,
    schema<PickerFormModel>((path) => {
      required(path.date, { message: 'Choose a date.' });
      required(path.time, { message: 'Choose a time.' });
      validate(path.time, ({ value }) => {
        const time = value();

        if (!time) {
          return undefined;
        }

        if (time < '09:00:00') {
          return { kind: 'min', message: 'Time must be at or after 09:00 AM.' };
        }

        return time > '18:00:00'
          ? { kind: 'max', message: 'Time must be at or before 06:00 PM.' }
          : undefined;
      });
      validate(path.constrainedDate, ({ value }) => {
        const date = value();

        if (!date) {
          return undefined;
        }

        if (date < '2026-07-01') {
          return { kind: 'min', message: 'Date must be on or after 01-07-2026.' };
        }

        if (date > '2026-07-31') {
          return { kind: 'max', message: 'Date must be on or before 31-07-2026.' };
        }

        return this.disableWeekends(date)
          ? { kind: 'dateUnavailable', message: 'Choose a weekday.' }
          : undefined;
      });
      required(path.appointment, { message: 'Choose an appointment date and time.' });
      validate(path.appointment, ({ value }) => {
        const appointment = value();
        return !appointment || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(appointment)
          ? undefined
          : { kind: 'parse', message: 'Enter a valid local date and time.' };
      });
    }),
  );
  protected readonly dateField = this.pickerForm.date;
  protected readonly timeField = this.pickerForm.time;
  protected readonly formattedDateField = this.pickerForm.formattedDate;
  protected readonly constrainedDateField = this.pickerForm.constrainedDate;
  protected readonly minuteTimeField = this.pickerForm.minuteTime;
  protected readonly appointmentField = this.pickerForm.appointment;
  protected readonly rtlAppointment = signal<DateTimePickerValue>('2026-07-20T09:00');

  protected readonly signalFormSnippet = `import { Component, signal } from '@angular/core';
import { FormField, form, required, schema } from '@angular/forms/signals';

import { DatePickerComponent, SignalFormField, SignalFormHint } from './shared/ui-lib';

@Component({
  selector: 'app-date-form-example',
  imports: [DatePickerComponent, FormField, SignalFormField, SignalFormHint],
  template: \`
    <ms-signal-form-field>
      <label for="delivery-date">Delivery Date</label>
      <ms-date-picker id="delivery-date" [formField]="dateField" />
      <ms-hint>Enter the date as DD-MM-YYYY.</ms-hint>
    </ms-signal-form-field>
  \`,
})
export class DateFormExample {
  private readonly model = signal({ date: null as string | null });
  protected readonly form = form(
    this.model,
    schema<{ date: string | null }>((path) => required(path.date)),
  );
  protected readonly dateField = this.form.date;
}`;

  protected readonly formatSnippet = `import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { DatePickerComponent, SignalFormField } from './shared/ui-lib';

@Component({
  selector: 'app-formatted-date-example',
  imports: [DatePickerComponent, FormField, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="report-date">Report Date</label>
      <ms-date-picker
        id="report-date"
        displayFormat="yyyy-MM-dd"
        [formField]="dateField"
      />
    </ms-signal-form-field>
  \`,
})
export class FormattedDateExample {
  private readonly model = signal({ date: '2026-07-14' as string | null });
  protected readonly dateField = form(this.model).date;
}`;

  protected readonly constrainedSnippet = `import { Component, signal } from '@angular/core';
import { FormField, form, required, schema, validate } from '@angular/forms/signals';
import { DatePickerComponent, SignalFormField } from './shared/ui-lib';

@Component({
  selector: 'app-constrained-date-example',
  imports: [DatePickerComponent, FormField, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="work-date">Working Day</label>
      <ms-date-picker
        id="work-date"
        minDate="2026-07-01"
        maxDate="2026-07-31"
        [disabledDate]="disableWeekends"
        [formField]="dateField"
      />
    </ms-signal-form-field>
  \`,
})
export class ConstrainedDateExample {
  private readonly model = signal({ date: null as string | null });
  protected readonly disableWeekends = (date: string): boolean => {
    const [year, month, day] = date.split('-').map(Number);
    const weekday = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1, 12).getDay();
    return weekday === 0 || weekday === 6;
  };
  protected readonly form = form(
    this.model,
    schema<{ date: string | null }>((path) => {
      validate(path.date, ({ value }) => {
        const date = value();
        if (!date) return undefined;
        if (date < '2026-07-01') {
          return { kind: 'min', message: 'Date must be on or after 01-07-2026.' };
        }
        if (date > '2026-07-31') {
          return { kind: 'max', message: 'Date must be on or before 31-07-2026.' };
        }
        return this.disableWeekends(date)
          ? { kind: 'dateUnavailable', message: 'Choose a weekday.' }
          : undefined;
      });
    }),
  );
  protected readonly dateField = this.form.date;
}`;

  protected readonly timeSnippet = `import { Component, signal } from '@angular/core';
import { FormField, form, required, schema, validate } from '@angular/forms/signals';
import { SignalFormField, TimePickerComponent } from './shared/ui-lib';

@Component({
  selector: 'app-time-example',
  imports: [FormField, SignalFormField, TimePickerComponent],
  template: \`
    <ms-signal-form-field>
      <label for="meeting-time">Meeting Time</label>
      <ms-time-picker
        id="meeting-time"
        displayFormat="12-hour"
        precision="second"
        [minuteStep]="1"
        [secondStep]="1"
        minTime="09:00:00"
        maxTime="18:00:00"
        [formField]="timeField"
      />
    </ms-signal-form-field>
  \`,
})
export class TimeExample {
  private readonly model = signal({ time: '14:30:45' as string | null });
  protected readonly form = form(
    this.model,
    schema<{ time: string | null }>((path) => {
      required(path.time, { message: 'Choose a meeting time.' });
      validate(path.time, ({ value }) => {
        const time = value();
        if (!time) return undefined;
        if (time < '09:00:00') {
          return { kind: 'min', message: 'Time must be at or after 09:00 AM.' };
        }
        return time > '18:00:00'
          ? { kind: 'max', message: 'Time must be at or before 06:00 PM.' }
          : undefined;
      });
    }),
  );
  protected readonly timeField = this.form.time;
}`;

  protected readonly minuteTimeSnippet = `import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { SignalFormField, TimePickerComponent } from './shared/ui-lib';

@Component({
  selector: 'app-minute-time-example',
  imports: [FormField, SignalFormField, TimePickerComponent],
  template: \`
    <ms-signal-form-field>
      <label for="precise-time">Precise Time</label>
      <ms-time-picker
        id="precise-time"
        [minuteStep]="1"
        [formField]="timeField"
      />
    </ms-signal-form-field>
  \`,
})
export class MinuteTimeExample {
  private readonly model = signal({ time: '09:01' as string | null });
  protected readonly timeField = form(this.model).time;
}`;

  protected readonly dateTimeSnippet = `import { Component, signal } from '@angular/core';
import { FormField, form, schema, validate } from '@angular/forms/signals';
import {
  DateTimePickerComponent,
  DateTimePickerValue,
  SignalFormField,
} from './shared/ui-lib';

@Component({
  selector: 'app-appointment-example',
  imports: [DateTimePickerComponent, FormField, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label id="appointment-label">Appointment</label>
      <ms-date-time-picker
        aria-labelledby="appointment-label"
        [minuteStep]="15"
        [formField]="appointmentField"
      />
    </ms-signal-form-field>
    <p>{{ appointmentField().value() }}</p>
  \`,
})
export class AppointmentExample {
  private readonly model = signal<{ appointment: DateTimePickerValue }>({
    appointment: '2026-07-14T14:30',
  });
  protected readonly form = form(
    this.model,
    schema<{ appointment: DateTimePickerValue }>((path) => {
      required(path.appointment, { message: 'Choose an appointment date and time.' });
      validate(path.appointment, ({ value }) => {
        const appointment = value();
        return !appointment || /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$/.test(appointment)
          ? undefined
          : { kind: 'parse', message: 'Enter a valid local date and time.' };
      });
    }),
  );
  protected readonly appointmentField = this.form.appointment;
}`;

  protected readonly rtlSnippet = `import { Component, signal } from '@angular/core';
import {
  DateTimePickerComponent,
  DateTimePickerValue,
  SignalFormField,
} from './shared/ui-lib';

@Component({
  selector: 'app-rtl-date-time-example',
  imports: [DateTimePickerComponent, SignalFormField],
  template: \`
    <div dir="rtl">
      <ms-signal-form-field>
        <label id="rtl-appointment-label">الموعد</label>
        <ms-date-time-picker
          aria-labelledby="rtl-appointment-label"
          locale="ar-QA"
          [firstDayOfWeek]="6"
          [(value)]="appointment"
        />
      </ms-signal-form-field>
    </div>
  \`,
})
export class RtlDateTimeExample {
  protected readonly appointment = signal<DateTimePickerValue>('2026-07-20T09:00');
}`;
}
