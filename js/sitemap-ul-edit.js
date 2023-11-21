module.exports={
	props:['node' , 'nownumber' , 'oldnumber'],
	data:function(){
		return {
			newNumber : this.oldnumber+'-'+this.nownumber
		}
	},
	watch:{
		oldnumber:function(){
			this.newNumber = this.oldnumber+'-'+this.nownumber;
		},
		nownumber:function(){
			console.log(this.oldnumber)
			this.newNumber = this.oldnumber+'-'+this.nownumber;
		}
	},
	methods:{
		receive:function( item ){
			this.$emit('call-receive-api' , item );
		},
		changeSelect:function( item ){
			this.$emit('call-receive-api' , item );
		}
	}		
}