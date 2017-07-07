import Ember from 'ember';
const {
	Component,
	computed,
 } = Ember;

export default Component.extend({
	tagName: 'md-table-pagination',
	classNames: ['md-table-pagination'],
	startOffset: computed('page', 'limit', function() {
		return Math.max((this.get('page') - 1) * this.get('limit') + 1, 1); // 1-based index
	}),
	endOffset: computed('startOffset', 'limit', function() {
		return this.get('startOffset') + this.get('limit');
	})
});
