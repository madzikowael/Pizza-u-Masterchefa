import {select, templates} from '/js/settings.js';
import AmountWidget from '/js/components/AmountWidget.js';

class Booking{
  constructor(element){
    const thisBooking = this;

    //thisBooking.data = data;

    thisBooking.render(element);
    thisBooking.initWidgets();
  };

  render(element){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    //thisBooking.element = utils.createDOMFromHTML(generatedHTML);

    thisBooking.dom = {};

    thisBooking.dom.wrapper = element;

    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
  };

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);

    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  };
}

export default Booking;
