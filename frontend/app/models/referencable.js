import Model, { hasMany } from '@ember-data/model';
export default Model.extend({
  emails:hasMany('email')
});
