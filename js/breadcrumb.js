module.exports={
	props: ['nowpage'  ,'sitemap' , 'pageState'],
	data:function(){
		return {
			breadcrumb : []
		}
	},
	mounted:function(){
		var self = this;
		var nr = []
		var newSiteMap = JSON.parse( JSON.stringify(self.sitemap) );
		var indexaHeading = newSiteMap.filter( function(item) {return item.name == 'index'})[0].heading
		self.breadcrumb.push( { heading : indexaHeading , name : 'index' } );
		if( self.nowpage.name == 'index' && self.pageState == 'sitemap' ){
			self.breadcrumb.push({ heading: self.$t('mainPart.guidedtour') , name:''});
		}else if( self.nowpage.name !== 'index' ){
			nr = newSiteMap.filter( function(item) {return item._id === self.nowpage._id } );
			//self.breadcrumb.concat(nr);
			if(nr.length){
				nr[0].parent.forEach( function(item) {
					newSiteMap.forEach( function(item2) {
						if(item == item2._id){
							self.breadcrumb.push({ heading : item2.heading , name : item2.name })
						}
					})
				})
				self.breadcrumb.push({ heading : nr[0].heading , name : nr[0].name })
			}
		}
	}
}