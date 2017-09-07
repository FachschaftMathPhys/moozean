import Ember from 'ember';

export default Ember.Component.extend({
  store:Ember.inject.service(),
  actions:{
    exitDialog:function(option){
      this.sendAction('closeDialog',option);
    },
    excludeExaminator:function(report){
      if(report.get('examinators').length>1){
        report.get('examinators').then((list)=>{
          list.removeObject(this.get('examinator'));
          report.set('examinators',list);
          report.save();
        });
      }
      else {
        report.get('examinators').removeObject(this.get('examinator'));
        report.get('examinators').pushObject(this.get('store').peekRecord('examinator', 33));
        report.save();
      }
    },
    deleteReport:function(report){
      report.destroyRecord();
    }
  }
});