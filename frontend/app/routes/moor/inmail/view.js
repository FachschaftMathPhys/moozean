import Ember from 'ember';

export default Ember.Route.extend({
  model:function(params){
    return Ember.RSVP.hash({
      examinators:this.store.findAll('examinator').catch(this.ajaxError.bind(this)),
      folderseries:this.store.findAll('folderseries').catch(this.ajaxError.bind(this)),
      subjects:this.store.findAll('subject').catch(this.ajaxError.bind(this)),
      typs:this.store.findAll('typ').catch(this.ajaxError.bind(this)),
      moduls:this.store.findAll('modul').catch(this.ajaxError.bind(this)),
      report: this.store.createRecord('report',{pdf:'',tex:'',examinationDate:moment()}).catch(this.ajaxError.bind(this)),
      mail:this.store.find('inmail',params.id).catch(this.ajaxError.bind(this))
    });
  }
});
