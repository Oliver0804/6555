module.exports = {
  props: ['language'],
  data: function(){
    return {
      langHasFocus: false
    }
  },
  methods: {
    setFontSize: function (str) {
      var html = document.getElementsByTagName('html')[0];
      return html.style.fontSize = str;
    }
  }
}