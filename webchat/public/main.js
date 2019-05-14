/*
const Url = "https://pokeapi.co/api/v2/pokemon/usw";
const data = {
    username : document.getElementById("user").value , 
    password : document.getElementById("pass").value
}
    $(document).ready(function(){

        $("#bt1").click(function(){
            $.post(Url, data , function(data , status){
                console.log("Hello bc");
                console.log(data );
            });
      });
    });
 */
var detail;
function click1(){
    console.log('ready to go');

    window.location.href='http://192.168.43.188:3000/client.html?name='+detail.name;
}
    function user(){
       
        console.log(localStorage.getItem('x-auth-token'));
        
        fetch('http://192.168.43.188:8081/api/me', {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
           //mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
           // credentials: "include", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                "x-auth-token":window.localStorage.getItem('x-auth-token'),
                "Content-Type": "application/x-www-form-urlencoded",
            },
           redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
           // body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
        .then(response => {
           return response.json();
        }).then((data)=>{
            detail=data;
            console.log(data);
            if(!data.connect){
                $("#connect").hide();
            }
           // console.log(Object.keys(data).length);
        
        $('#element').append(  
              ' <h1 id="name">'+    
              ' Name :'+data.name+ 
                  '</h1>'+

                 ' <h3 id="email">'+
                   ' Email Id :'+ data.username+ 
                     ' </h3>'+
                      '<h3>'+
                          'Department:'+data.dept+
                     ' </h3>');
        
            
           
        }); // parses response to JSON
    }

        
    


async function logi()
    {
        
     fetch("http://192.168.43.188:8081/api/login",
{  //mode: "cors",
    credentials: "same-origin",
    headers: {
     //'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body:JSON.stringify({  username:document.getElementById("user").value ,
    password:document.getElementById("pass").value ,})
}).then(data=>{ var token =  data.headers.get('x-auth-token');
console.log(data);

   window.localStorage.setItem('x-auth-token',token);
   console.log(token);
   return data.json();
}).then((data)=>{ console.log(data);
  if(data.data=='true'){ 
   
    if(!data.admin)
    window.location.replace('user.html');
    else window.location.replace('index1.html');

    }
    else  {
     alert("invalid");
    }}
      )};
      



  
  




