module.exports={
	props:['node' , 'first'],
	data:function(){
		return {
			nNode : {}
		}
	},
	methods:{
		onAndOff:function( index ){
			if(this.first){
				this.nNode = this.nNode.map( function(item , i ) {
					if(i == index){
						item.boolean = !item.boolean;
						return item;
					}else{
						return item;
					}
				})
			}	
		}
	},
	watch:{
		node:function(){
			this.nNode = JSON.parse( JSON.stringify(this.node) );
			if(this.first){
				this.nNode.forEach( function(item) { return item.boolean = false } );
			}else{
				this.nNode.forEach( function(item) { return item.boolean = true } );
			}
		}
	},
	mounted:function(){
		this.nNode = JSON.parse( JSON.stringify(this.node) );
		if(this.first){
			this.nNode.forEach( function(item) { return item.boolean = false } );
		}else{
			this.nNode.forEach( function(item) { return item.boolean = true } );
		}
	}
}