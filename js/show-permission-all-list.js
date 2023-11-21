module.exports={
	props:['sitetree' , 'user'],
	methods:{
		goToPermissionDetail : function( item ){
			this.$emit('direct-top-permission' , item);
		},
		receive : function( item ){
			this.$emit('direct-top-permission' , item);
		}
	}
}