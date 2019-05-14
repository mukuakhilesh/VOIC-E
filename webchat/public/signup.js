/*var password = document.getElementById("passw")
  , confirm_password = document.getElementById("repassw");
*/


//password.onchange = validatePassword;
//confirm_password.onkeyup = validatePassword;


var name =  document.getElementById("name");
var username = document.getElementById("username");
var dept =  document.getElementById("dept");
var pass1 = document.getElementById("pass1");
var pass2 = document.getElementById("pass2"); 
var count = 0 ;


function myValidate()
{


    if(name.value == "")
    {
        window.alert("Please enter your name"); 
        name.focus();
        count++ ; 
    }
    else{
        count =0 ;
    }


    if(username.value == "")
    {
        window.alert("Please enter valid email id."); 
        username.focus();
        count++ ; 
    }
    else{
        count =0 ;
    }

   
    if(dept.value== "")
    {
        window.alert("Please enter your department."); 
        dept.focus();
        count++;
    }
    else{
        count =0 ;
    }

    if(pass1.value == "")
    {
        window.alert("Please enter any password"); 
        dept.focus();
        count++;
    }
    else{
        count =0 ;
    }

    if(pass2.value == "")
    {
        window.alert("Please re-enter your password"); 
        dept.focus();
        count++;
    }
    else{
        count =0 ;
    }


    if(pass1.value != null && pass2.value != null && pass1.value != pass2.value ) {
        alert("password don't match")
      pass2.setCustomValidity("Passwords Don't Match");
      count++; 
    } 
    else
     {
      alert("password match")
      pass2.setCustomValidity('');
        count = 0 ;
    }

     ; 
    
}

async function sign()
{
    myValidate();

    if(count == 0)
    {    
      /*  $.post("http://192.168.43.188:8081/api/register",
        {
            username :document.getElementById("username"),
            dept :document.getElementById("dept"),
            password: document.getElementById("pass1"),
            name:document.getElementById("name")
        },
        function(data, status){
          alert("Data: " + data + "\nStatus: " + status);
          console.log(data);
        });*/
        
     var data= await fetch("http://192.168.43.188:8081/api/register",
     {
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
         },
         method: "POST",
         body: JSON.stringify({
            username :document.getElementById("username").value,
            dept :document.getElementById("dept").value,
            password: document.getElementById("pass1").value,
            name:document.getElementById("name").value
         })
     });
     var hey=await data.json();
     alert(hey);
    
    }
 else
    {
        alert("not found");
    }
        
}
