import Controller from '@ember/controller';

export default Controller.extend({
  actions:{
    archiveMail:function(mail){
      mail.destroyRecord();
    },
    deleteMail:function(mail){
      mail.destroyRecord();
    },
    toogleRead:function(mail){
      mail.set('read',!mail.get("read"));
      mail.save().then(null)
    },
    addStudent:function(){
      var store = this.get('store');
      this.set('newstudent',store.createRecord('student'));
      this.set("showCreate",true);
    },
    closeDialog: function(option) {
      var store = this.get('store');
      if (option == "ok") {
        let foo = function(_this) {
          return function() {
            _this.set('student', _this.get('newstudent'));
            _this.set('newstudent', store.createRecord('student'));
            _this.set("showDialog", false);
          }
        };
        this.get('newstudent').save().then(foo(this));
      }else{
        this.get('newstudent').destroyRecord();
      }
      this.set('showCreate', false);
    },
  }
});
