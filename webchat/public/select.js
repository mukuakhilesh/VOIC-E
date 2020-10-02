/*$(document).ready(function(){
    $("#formId").attr("myAction","asd.html");
    })*/
$("#submit_but").click(async ()=>{
  
    var inputs = $(".container");
    var check = $(".check");
    var obj= [];
    
for(var i = 0; i < inputs.length; i++){
   // alert($(inputs[i]).val());
   console.log(i);
   var status =$(check[i]).is(':checked')
        var temp={
            username:($(inputs[i]).text()).trim(),connect:status.toString(), 
        }
  obj.push(temp);
};
try{
var res= await fetch("http://localhost:8081/api/update/connect",
{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "PUT",
    body:JSON.stringify(obj)
});
data = await res.json();
alert(data);




//console.log(mail.subject);

} 
catch(err){
    console.log(err);

}
try{
    //console.log($("#subject").val());
    var mail={
        subject:$('#subject').val(),
        content:$('#body').val(),
    }

    var res1= await fetch("http://localhost:8081/api/email/",
    {
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method:"POST",
        body:JSON.stringify(mail)
    });
    data = await res1.json();
   alert('fdf');
}
catch(errr){
    console.log(errr);
}


//alert('submit');
});


$(document).ready(()=>{
    
    fetch('http://localhost:8081/api/admin/all', {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
           // "Content-Type": "application/json",
            "x-auth-token":localStorage.getItem('x-auth-token'),
           "Content-Type": "application/x-www-form-urlencoded",
        },
       // redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
       // body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => {
       return response.json();
    }).then(data=>{
        
      var len=  Object.keys(data).length;
        //alert(Object.keys(data).length);
    for(var i=0;i<len;i++)
    {
        $("#formId").prepend(
            '<label class="container"><h5 class="details">'+data[i].username+'</h5><input type="checkbox" class = "check">'+
          '  <span class="checkmark"></span>'+
          '  <div class="checkbox-wrapper">'+
                 '<img src="download.jpeg" style="width:80px;height:100px;"/>'+
              '</div>'+
         '</label>'
        )
    }
       
    }); // parses response to JSON  
     
});
   

//$("#hey").prop("checked",true);
//$("#hey").is(":checked");        return true if checked












//////////////////////////////////////////////////////////////////////////////////////////////
async function click2(){
  
    var inputs = $(".container");
    var check = $(".check");
    var obj= [];
    
for(var i = 0; i < inputs.length; i++){
   // alert($(inputs[i]).val());
   console.log(i);
   if($(check[i]).is(':checked')){
        var temp={
            username:($(inputs[i]).text()).trim() 
        }
  obj.push(temp);
    }
};
try{
    console.log(obj);
var res= await fetch("http://localhost:8081/api/admin/delete",
{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "DELETE",
    body:JSON.stringify(obj)
});
data = await res.json();
console.log(data);
location.reload();
}
catch(err){
    console.log(err);
}
}


//////////////////////////////////////////////////admin click button
function click3(){
    window.location.href='http://localhost:3000/admin.html';
}
