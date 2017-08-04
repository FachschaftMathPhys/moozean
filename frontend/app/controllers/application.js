import Ember from 'ember';

const { Controller } = Ember;

export default Controller.extend({
  open:false,
  actions: {
    toggleExpandedItem(value, ev) {
      if (this.get('expandedItem') === value) {
        value = null;
      }
      this.set('expandedItem', value);
      ev.stopPropagation();
    }
  }


  });
