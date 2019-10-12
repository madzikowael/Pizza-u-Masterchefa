import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import AmountWidget from './components/AmountWidget.js';
import CartProduct from './components/CartProduct.js';

const app = {
    initPages: function(){
      const thisApp = this;

      thisApp.pages = document.querySelector(select.containerOf.pages).children;
      thisApp.navLinks = document.querySelector(select.nav.links).children;

      thisApp.activatePage(thisApp.pages[0].id);
    },

    activatePage: function(pageId){
      const thisApp = this;

      /* add class 'active' to matching pages, remove from non-matching */
      for(let page of thisApp.pages){
        page.classList.toggle(classNames.pages.active, page.id == pageId);
      }
      /* add class 'active' to matching links, remove from non-matching */
      for(let link of thisApp.navLinks){
        link.classList.toggle(
          classNames.nav.active,
          link.getAttribute('href') == '#' + pageId
          );
      }

    },

    initMenu: function(){
      const thisApp = this;

      for(let productData in thisApp.data.products){
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;

      thisApp.data = {};

      const url = settings.db.url + '/' + settings.db.product;

      fetch(url)
        .then(function(rawResponse){
          return rawResponse.json();
        })
        .then(function(parsedResponse){
          console.log('parsedResponse', parsedResponse);

          /* save parasedResponse as thisApp.data.products*/
          thisApp.data.products = parsedResponse;
          /*execute initMentu method */
          thisApp.initMenu(parsedResponse);
        })

        console.log('thisApp.data', JSON.stringify(thisApp.data));
    },

    init: function(){
      const thisApp = this;

      thisApp.initPages();
      thisApp.initData();
      thisApp.initCard();
    },

    initCard: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);

      thisApp.productList = document.querySelector(select.containerOf.menu);

      thisApp.productList.addEventListener('add-to-cart', function(event){
        app.cart.add(event.detail.product);
      });
    },
  };

app.init();

