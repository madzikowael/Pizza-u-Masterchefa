import { settings, select } from '/js/settings.js';
import utils from '/js/utils.js';
import BaseWidget from '/js/components/BaseWidget.js';

class DatePicker extends BaseWidget{
  constructor(wrapper){
    //const thisWidget = this;
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);

    thisWidget.initPlugin();

  }

  initPlugin(){
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);

    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      dataFormat: "Y-m-d",
      maxDate: thisWidget.maxDate,
      minDate: "today",
      disable: [
        function(date) {
           // return true to disable
          return (date.getDay() === 1);
        }
      ],
      locale: {
        firstDayOfWeek: 1 // start week on Monday
      },

      onChange: function(selectedDates, dateStr){
        thisWidget.value = dateStr;
      },
    });
  }


  parseValue(value){
    return isNaN(value);
  }

  isValid(){
    return true;
  }

  renderValue(){
    //console.log('BaseWidget.renderValue:' BaseWidget.renderValue);
  }


}

export default DatePicker;
