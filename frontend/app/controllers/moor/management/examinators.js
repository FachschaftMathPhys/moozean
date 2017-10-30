import Ember from 'ember';

export default Ember.Controller.extend({
  newexaminator:{},
  showReportDialog:false,
  page: 1,
  resultsLength:Ember.computed('meta.record-count',function(){
    return this.get("meta.record-count");
  }),
  pages: Ember.computed('meta.page-count', function() {
    let e = Ember.A();
    console.log(this.get("meta.page-count"));
    for (let i = 1; i <= this.get("meta.page-count"); i++) {
      e.pushObject(i);
    }
    return e;
  }),
  limitOptions: Ember.A([5, 10, 15]),
  limit:5,
  paginatedResults: Ember.computed('page', 'limit','model.[]', function() {
    let result= this.store.query("examinator", {
      page: {
        number: this.get('page'),
        size: this.get("limit")
      }
    });
    result.then((data) => {
      this.set("meta", data.get("meta"));
    })
    return result;
  }),
  actions:{
    addExaminator:function(){
      this.set('newexaminator',this.store.createRecord('examinator'));
      this.set("showCreateExaminatorDialog",true);
    },
    editExaminator:function(examinator){
      this.set('newexaminator',examinator);
      this.set("showCreateExaminatorDialog",true);
    },
    deleteExaminator:function(examinator){
      examinator.get('reports').then((item)=>{
        if(item.length==0){
          examinator.destroyRecord();
        }
        else {
          this.set('newexaminator',examinator);
          this.set("showReportDialog",true);
        }
      });
    },
      closeDeleteExaminatorDialog:function(option) {
          this.set("showReportDialog",false);
        if(option=="ok"){
          this.get('newexaminator').destroyRecord();
        }
        else {
          this.set('newexaminator',null);
        }

      },
    closeExaminatorDialog:function(option){
      if(option=="ok"){
        this.get('newexaminator').save().then(null,this.ajaxError.bind(this))
      } else
      {
        this.get('newexaminator').rollback();
      }
      this.set('showCreateExaminatorDialog',false);
      this.set('showEditExaminatorDialog',false);
    },
    incrementPage: function() {
      let page = this.get('page');
      let max = this.get('pages').reduce((prev, curr) => curr > prev
        ? curr
        : prev, 0);
      if (page < max) {
        this.set('page', page + 1);
      }
    },
    decrementPage: function() {
      let page = this.get('page');
      if (page > 0) {
        this.set('page', page - 1);
      }
    }
  }
});
