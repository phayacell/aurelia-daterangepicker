import { inject, bindable, bindingMode } from 'aurelia-framework'; // eslint-disable-line no-unused-vars
import $ from 'jquery';
import moment from 'moment';
import 'daterangepicker';

@inject(Element)
export class DateRangePicker {
  @bindable({defaultBindingMode: bindingMode.twoWay}) startDate;
  @bindable({defaultBindingMode: bindingMode.twoWay}) endDate;
  @bindable({defaultBindingMode: bindingMode.oneTime}) options; // see: http://www.daterangepicker.com/#options

  constructor(element) {
    this.element = element;
  }

  created(owningView) {
    this.owningView = owningView;
  }

  attached() {
    this.options = $.extend(true, {
      locale: {
        format: moment.HTML5_FMT.DATE
      }
    }, this.options);

    this.options = $.extend(this.options, {
      startDate: moment(this.startDate, this.options.locale.format),
      endDate: moment(this.endDate, this.options.locale.format)
    });

    $(this.element).daterangepicker(this.options, (start, end) => this.apply(start, end));
  }

  apply(startDate, endDate) {
    this.startDate = startDate.format(this.options.locale.format);
    this.endDate = endDate.format(this.options.locale.format);
  }

  startDateChanged(newValue) {
    if (this.owningView.isAttached) {
      $(this.element).data('daterangepicker').setStartDate(newValue);
    }
  }

  endDateChanged(newValue) {
    if (this.owningView.isAttached) {
      $(this.element).data('daterangepicker').setEndDate(newValue);
    }
  }
}
