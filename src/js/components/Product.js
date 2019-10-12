import {select, classNames, templates} from '/js/settings.js';
import utils from '/js/utils.js';
import AmountWidget from '/js/components/AmountWidget.js';

class Product{
  constructor(id, data){
    const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();

  }
  renderInMenu(){
    const thisProduct = this;

    /* generate HTML based on template */
    const generatedHTML = templates.menuProduct(thisProduct.data);
    /* create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    /* find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);
    /* add element to menu */
    menuContainer.appendChild(thisProduct.element);
  }

  getElements(){
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion(){
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking) */
    let trigger = thisProduct.accordionTrigger;
  /* START: click event listener to trigger */
    trigger.addEventListener('click', function(){
    /* prevent default action for event */
      event.preventDefault();
    /* toggle active class on element of thisProduct */
      thisProduct.element.classList.toggle('active');
    /* find all active products */
      const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
    /* START LOOP: for each active product */
        for(let activeProduct of activeProducts){
      /* START: if the active product isn't the element of thisProduct */
          if(activeProduct !== thisProduct.element){
        /* remove class active for the active product */
            activeProduct.classList.toggle('active');
      /* END: if the active product isn't the element of thisProduct */
          }
    /* END LOOP: for each active product */
    }
  /* END: click event listener to trigger */
  });
  }

  initOrderForm(){
    const thisProduct = this;

    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder(){
    const thisProduct = this;
    const formData = utils.serializeFormToObject(thisProduct.form);

    thisProduct.params = {};

    let price = thisProduct.data.price;

    for(let paramId in thisProduct.data.params){
      const param = thisProduct.data.params[paramId];

      for(let optionId in param.options){
        const option = param.options[optionId];
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;

          if(optionSelected && !option.default){
            price += option.price;
          } else if(!optionSelected && option.default){
            price -= option.price;
          }

          const classImages = '.' + paramId + '-' + optionId;
          const optionImages = thisProduct.imageWrapper.querySelectorAll(classImages);

          if(optionSelected){
            if(!thisProduct.params[paramId]){
              thisProduct.params[paramId] = {
                label: param.label,
                options: {},
              };
            }
            thisProduct.params[paramId].options[optionId] = option.label;

            for(let optionImage of optionImages){
              if(optionImage){
                optionImage.classList.add('active');
              }
            }
          } else {
            for(let optionImage of optionImages){
              optionImage.classList.remove('active');
            }
          }
      }
    }

    /* multiply price by amount*/
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    thisProduct.priceElem.innerHTML = thisProduct.price;

  }

  initAmountWidget(){
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function(event){
      thisProduct.processOrder();
    })
  }

  addToCart(){
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    //app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }
}

export default Product;
