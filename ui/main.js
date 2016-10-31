/*
COUNTING THE NUMBER OF CLICKS

button.onclick = function() {
counter = counter + 1;
var span=document.getElementById('count');
span.innerHTML=counter.toString();
};
*/



var button =document.getElementById('counter');

button.onclick = function() {

var request = new XMLHttpRequest();

//Capture the response and store it in a variable
request.onreadystatechange = function() {
  if (request.readyState === XMLHttpRequest.DONE) {
    
      if(request.status === 200) {
          var counter = request.responeText;
          var span = document.getElementById('count');
          span.innerHTML = counter.toString();
      }
  }
  //Not done yet
};

//Make the request
request.open('GET', 'http://nishavelu.imad.hasura-app.io/counter', true);
request.send(null);


};

var nameInput = document.getElementById('name');
var name = nameInput.value;
var submit = document.getElementById('submit_btn');

submit.onclick = function() {

    
    var names= ['name1', 'name2', 'name3', 'name4'];
    var list = '';
        for ( var i=0; i<names.length; i++) 
        {
            list += '<li>' + names[i] + '</li>';
        }
            var ul = document.getElementById('namelist');
            ul.innerHTML= list;
       
  };