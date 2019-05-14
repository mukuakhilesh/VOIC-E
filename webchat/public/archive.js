$(document).ready(()=>{
    
    
$.ajax
({
  type: "GET",
  url: "http://192.168.43.188:3000/filelist",
  dataType: 'json',
  success: function(html)
  {
     alert(html);
     for(var i in html.arr){
     $("#list").prepend(
        '<h5 class="details"><a href="http://192.168.43.92:3000/archive/'+html.arr[i].name+'">'+html.arr[i].name +'</a></h5>'
    )
     }
  }
})});