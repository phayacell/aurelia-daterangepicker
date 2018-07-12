# aurelia-daterangepicker
Date Rage Picker を Aurelia.js で使うプロジェクトです。

# Usage
1. Date Range Picker をインストールします。

```bash
$ yarn add daterangepicker
```

2. Date Range Picker を扱う Custom Element を作成します。

```html:src/date-range-picker.html
<!-- src/date-range-picker.html -->

<template class="form-control">
  <require from='daterangepicker/daterangepicker.css'></require>
  <require from='./date-range-picker.css'></require>

  <div class="date-range-picker">
    <span class="date-range">
      <time datetime="${startDate}">${startDate}</time>
      <span>-</span>
      <time datetime="${endDate}">${endDate}</time>
    </span>
  </div>
</template>
```

```js:src/date-range-picker.js
// src/date-range-picker.js

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
```

```css:src/date-range-picker.css
/* src/date-range-picker.css */

.date-range-picker {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.date-range-picker::before {
  font-family: FontAwesome;
  content: '\f073';
  padding-right: .5rem;
  flex: 0 0 auto;
}
.date-range-picker::after {
  font-family: FontAwesome;
  content: '\f0d7';
  padding-left: .5rem;
  flex: 0 0 auto;
}

.date-range-picker .date-range {
  flex: 1 1 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
```

3. 作成した Custom Element を使います。

```html:src/contact-detail.html
<template>
  <require from="./date-range-picker"></require>

  <!-- 中略 -->

        <div class="form-group row">
          <label class="col-sm-3 col-form-label">Expiry Period</label>
          <div class="col-sm-9">
            <date-range-picker start-date.bind="contact.expiryFrom" end-date.bind="contact.expiryTo" options.bind="options"></date-range-picker>
          </div>
        </div>
```

4. `au run` したら完了。
