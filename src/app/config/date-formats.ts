import * as moment from 'moment';
import * as lo from 'lodash';

export const DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD',
    monthYearA11yLabel: 'MMM'
  },
};

export function getFormattedDate(d: Date): string {
  return moment(d).toISOString(true).split('T')[0];
}

export function getFormattedTime(d: Date): string {
  const t = d.toTimeString().split(':');
  return `${t[0]}:${t[1]}`;
}
