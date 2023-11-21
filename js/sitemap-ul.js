module.exports={
	props:['node' , 'nownumber' , 'oldnumber'],
	data:function(){
		return {
			newNumber : this.oldnumber+'-'+this.nownumber
		}
	}	
}