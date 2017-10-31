import Ember from 'ember';
//import moment from 'moment';

export default Ember.Controller.extend({
  pruefende:Ember.A(),
  module:Ember.A(),
  printselection:Ember.A(),
  selectedDate:null,
  pruefauswahl:Ember.A(),
  reportslist:Ember.A(),
  auswahl:false,
  limitOptions: Ember.A([5, 10, 15]),
  limit: 5,
  resultsLength:Ember.computed('meta.record-count', function() {
    return this.get("meta.record-count");
  }),
  pages: Ember.computed('meta.page-count', function() {
    let e = Ember.A();
    console.log(this.get("meta.page-count"));
    for (let i = 1; i <=this.get("meta.page-count"); i++) {
      e.pushObject(i);
    }
    return e;
  }),
  page: 1,
  results: Ember.computed('pruefende.[]', 'module.[]', 'subject', 'typ','page','limit', function() {
    this.set("loading", true);
    let moduls = [];
    let examinators = [];
    let folderseries = [this.get("model.id")];
    if (this.get("pruefende") != null) {
      this.get("pruefende").forEach((item) => {
        examinators.pushObject(item.get("id"));
      });
    }
    if (this.get("module") != null) {
      this.get("module").forEach((item) => {
        moduls.pushObject(item.get("id"));
      });
    }
    let ergebnis = this.get('store').query('report', {
      filter: {
        subject: this.get('subject.id'),
        typ: this.get('typ.id'),
        moduls: moduls,
        examinators: examinators,
        folderseries: folderseries
      }, page: {size: this.get("limit"),number:this.get("page")}
    });
    ergebnis.then((data) => {
      console.log(data);
      this.set("meta",data.meta);
      this.set("loading", false);
    },this.ajaxError.bind(this));
    return ergebnis;
  }),
  actions:{
    removeExaminator:function(examinator){
      this.get('pruefende').removeObject(examinator);
    },
    addExaminator: function(examinator){
      this.get('pruefende').pushObject(examinator);
    },
    removeModul:function(modul){
      this.get('module').removeObject(modul);
    },
    addModul: function(modul){
      this.get('module').pushObject(modul);
    },
    printReportCon:function(report) {
      this.set('reportslist',[report]);
      this.set('auswahl',false);
      this.set('showPruefDialog',true);
    },
    increaseTimes:function(select){
      select.set('times',select.get('times')+1);
    },
    decreaseTimes:function(select){
      if(select.get('times')>1){
        select.set('times',select.get('times')-1);
      }
      else{
        this.get('printselection').removeObject(select);
        this.set('printselection',this.get('printselection').slice());
      }
    },
    printAll:function(){
      this.set('reportslist',this.get('model.reports'));
      this.set('auswahl',false);
      this.set('showPruefDialog',true);
    },
    printShown:function(){
      this.set('reportslist',this.get('gefilterte'));
      this.set('auswahl',false);
      this.set('showPruefDialog',true);
    },
    printSelection:function(){
      this.get('printselection').forEach((printout)=>{
        printout.save().then(null,this.ajaxError.bind(this))
      });
      this.set('printselection',[]);
    },
    closeDialogAuswahl:function(option){
      if(option=="ok"){
        this.get('pruefauswahl').forEach((item)=>{
          let a=this.store.createRecord('printout',{report:item.report,times:1,folderseries:this.get('model'),examinator:item.examinator});
          this.get('printselection').pushObject(a);
        });
      }
      this.set('reportslist',[]);
      this.set('showPruefDialog',false);
    },
    closeDialogDrucken:function(option){
      if(option=="ok"){
        this.get('pruefauswahl').forEach((item)=>{
          let pr=this.store.createRecord('printout',{report:item.report,times:1,folderseries:this.get('model'),examinator:item.examinator});
          pr.save().then(null,this.ajaxError.bind(this))
        });
      }
      this.set('reportslist',[]);
      this.set('showPruefDialog',false);
    },
    decrementPage() {
      let page = this.get('page');
      if (page > 0) {
        this.set('page', page - 1);
      }
    },
    incrementPage() {
      let page = this.get('page');
      let max = this.get('pages').reduce((prev, curr) => curr > prev
        ? curr
        : prev, 0);
      if (page < max) {
        this.set('page', page + 1);
      }
    }
  }
});
