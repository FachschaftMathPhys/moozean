import Ember from 'ember';

export default Ember.Route.extend({
  model:function(){
    return this.store.findAll('folderseries').catch(this.ajaxError.bind(this));
  }
});
