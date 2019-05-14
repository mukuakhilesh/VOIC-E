var fs = require('fs');
var _ = require('lodash');
var express= require('express');
var app =express();
app.get('/query',(req,res)=>{
    var find= req.query;
    search(find.search,res);
  //  console.log(obj);
    //res.send(obj);
});

app.get('/file',(req,res)=>{
    var _file = req.query;
    console.log(_file);
    fs.readFile('./archive/'+_file.path, 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        res.send(data);
        }

})
    });


 
//var search= ' hello';
 
 //obj.table.push({name:"ashish",date:Date(),text:"this is me"});
 
 
 //var json = JSON.stringify(obj);
 //use fs to write the file to disk
 
 
//var filepath = 'msg.json';

 function append(filepath,query){
  fs.readFile(filepath, 'utf8', function readFileCallback(err, data){
     if (err){
         console.log(err);
     } else {
     obj = JSON.parse(data); //now it an object
     obj.table.push(query); //add some data
     json = JSON.stringify(obj); //convert it back to json
     fs.writeFile(filepath, json, 'utf8', (err)=>{
         console.log(err);
     }); // write it back 
 }});
}
function search(search,res){
   
    fs.readdir('./archive', (err, files) => {
        files.forEach(file => {
            var arr={
                found:[],
            };
          console.log(file);
          fs.readFile('./archive/'+file, 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
               
            obj = JSON.parse(data); //now it an object
           // obj.table.push({id: 2, square:3}); //add some data
           //
            for(var i in obj.table){
                if(obj.table[i].text.includes(search)||obj.table[i].name.includes(search)){
                console.log(obj.table[i]);
                var temp=obj.table[i];
                temp["filename"]=file;
                     arr.found.push(temp);
                  
                }
                }
            }
    
            json = JSON.stringify(arr); //convert it back to json
            fs.writeFile('./search.json', json, 'utf8', (err)=>{
                console.log(err);
            }); // write it back 
            res.send(json);
            
        })
        });
      });
  
};
    

//append(filepath,query);
app.listen('8080',()=>{
    console.log('listening...');
})
