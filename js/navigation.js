module.exports = {
	props: ['tree'],
	data: function(){
		return {
			focus: -1
		};
	},
	computed: {
		viewTree: function(){
			return this.tree;
		}
	},
	methods: {
		hoverLi (id) {
			var el = document.getElementById(id)
			if(!el) return false
			var width = document.body.clientWidth
			if(width < el.clientWidth + el.offsetLeft){
				if(!el.classList.contains('overflowRight')){
					el.classList.add('overflowRight')
				}
			}
		}
	}
}