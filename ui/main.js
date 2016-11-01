/*
COUNTING THE NUMBER OF CLICKS

button.onclick = function() {
counter = counter + 1;
var span=document.getElementById('count');
span.innerHTML=counter.toString();
};
*/



var button=document.getElementById("counter");
button.onclick = function(){
var request = new XMLHttpRequest();
    //create a request
 request.onreadystatechange= function(){
 if (request.readyState === XMLHttpRequest.DONE)
  {
      // take some action
    if (request.status===200)
       { 
           //alert("ok");
        var counter=request.responseText;
        var span=document.getElementById("count");
        span.innerHTML=counter.toString();
       }
  }
};

//Make the request
request.open('GET','http://nishavelu.imad.hasura-app.io/counter',true);
request.send(null);
};

var submit =document.getElementById('submit-btn');
submit.onclick = function() {
  
  var request = new XMLHttpRequest();
// capture the response and store in a variable
  request.onreadystatechange = function() {
     if (request.readyState === XMLHttpRequest.DONE) {
      
        
      if (request.status===200)
       { 
           
	    var names=request.responseText;
	    names=JSON.parse(names);
	    var list='';
        for (var i=0;i<names.length;i++) {
        
         list += '<li>' + names[i] + '</li>';
            
         }
	    var ul = document.getElementById('namelist');
        ul.innerHTML = list;
         }
   }        
  
};
    var nameInput=document.getElementById('name');
    var name=nameInput.value;
    
    request.open('GET','http://nishavelu.imad.hasura-app.io/submit-name?name=' +name ,true);
    request.send(null);
 }; 
 
