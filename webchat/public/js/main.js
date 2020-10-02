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


   function logi()
    {
        $.post("http://localhost:8081/api/login",
        {
            username:document.getElementById("user").value ,
            password:document.getElementById("pass").value ,
        },
        function(data, status){
          alert("Data: " + data + "\nStatus: " + status);
          console.log(data);
        });
        
 /* var settings = {
        "async": true,
        "crossDomain": true,
         "url": "http://localhost:8081/api/login",
        "username": document.getElementById("user").value ,
        "password": document.getElementById("pass").value ,
        "method": "POST", 
       //"dataType" : 'jsonp',   
      //  headers: {
      ///  "content-type" : "application/x-www-form-urlencoded",
      //   "cache-control": "no-cache",
         // "postman-token": "68d0f8fd-e870-78fd-d839-3d108a6f4793"
       // }
      }
      console.log("print me");

      $.ajax(settings).done(function (response) {
        console.log(response);
      });
    }
    */
}


