import Ember from 'ember';
export default Ember.Controller.extend({
  actions:{
    reload_lents: function(){
      this.get('model.lents').forEach((item)=>{
        item.reload().catch((reason)=>{
          item.unloadRecord();
        });
      });
    },
    hole_ordner: function(){
      return this.get('model.folders');
    },
    addStudent:function(){
      this.set('newstudent',this.store.createRecord('student'));
      this.set("showDialog",true);
    },
    editStudent:function(student){
       this.set('newstudent',student);
       this.set('titlestudent','Studierendes bearbeiten');
       this.set("showDialog",true);
    },
    closeDialog:function(option){
      if(option=="ok"){
        let foo=function(_this){return function(){
          _this.set('student',_this.get('newstudent'));
          _this.set('newstudent',_this.store.createRecord('student'));
          _this.set("showDialog",false);
      }};
        if(this.get('newstudent').save!=null)
        this.get('newstudent').save().then(foo(this),this.ajaxError.bind(this))
  else this.get('newstudent').content.save().then(foo(this),this.ajaxError.bind(this));
}else{
      if(this.get('newstudent').unloadRecord!=null)
      this.get('newstudent').unloadRecord();
      this.set("showDialog",false);
    }
    },
    searchStudent:function(data){
      return this.store.query('student', {
        filter: {
          name: '%'+data+'%'
        },
        page:{
          limit:10
        }
      }).catch(this.ajaxError.bind(this))
    },
    saveModel:function(){
      let folders = this.get('ordner');
      for(var i=0;i<folders.length;i++ ){
        let lent = this.store.createRecord('lent',{student:this.get('student'),folder:folders[i]});
        lent.save().then(function(_this,f){return function(){
          _this.set('currentStep',0);
          _this.set('student',null);
          _this.get('ordner').removeObject(f);
        }}(this,folders[i]),this.ajaxError.bind(this));
      }
    },
    addFolder:function(data){
      this.ordner.pushObject(data);
    },
    removeFolder:function(data){
      this.ordner.removeObject(data);
    },
    giveBack:function(lent){
      let returned=this.store.createRecord('returned',{lentat:lent.get('createdAt'),student:lent.get('student'),folder:lent.get('folder')});
      returned.save().then(null,this.ajaxError.bind(this))
      lent.destroyRecord();
    },
    mail:function(lent){
      //alert("Mail an "+lent.get('student.name')+" versandt!");
        this.set('showMailDialog',true);
        this.set('newmail',this.store.createRecord('email',{
          referencable:lent,
          subject:"Ordner "+lent.get('folder.name'),
          body:"Hallo "+lent.get('student.name')+",\n\nLaut unserer Datenbank hast du seit dem "+moment(lent.get('createdAt')).format("ll")+
          " den Ordner "+lent.get('folder.name')+" ausgeliehen.\n"+
          "\n "+
        "Das ist generell auch noch kein großes Problem. Allerdings haben wir nur wenige Ordner, die \n "+
        "eigentlich nur zum Kopieren ausgeliehen werden sollten. Deswegen wäre es schön, wenn du ihn \n "+
        "bald wieder zurückbringst :))\n "+
        "\n"+
        "Falls du von dieser Mail unglaublich verwirrt bist, weil du dich nicht erinnern kannst, jemals \n "+
        "einen solchen Ordner ausgeliehen zu haben, sag uns, dass wir wohl der falschen Person \n "+
        "geschrieben haben ;)\n "+
        "\n "+
        "Viele Grüße\n "+
        "Deine Fachschaft-MathPhys",
          address:lent.get('student.uniid')+"@ix.urz.uni-heidelberg.de"
        }));
    },
    closeMailDialog:function(option){
      this.set('showMailDialog',false);
      if(option=="ok"){
        this.get('newmail').save().then(null,this.ajaxError.bind(this));
      } else
      {
        if(this.get('newmail').unloadRecord!=null)
        this.get('newmail').unloadRecord();
      }
    },
    closepfand:function(option,student){
      this.set('showPfandDialog', false);
      if(option=="ok"){
          student.set('refund', true);
          student.save().then(null,this.ajaxError.bind(this));
      }
    },
    showPfandDialog:function(){
      this.set('showPfandDialog', true);
    }
  }
  });
