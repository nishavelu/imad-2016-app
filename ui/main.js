console.log('Loaded!');
var element = document.getElementById('main-text');
element.innerHTML='Hello I am Nisha. This is my new project.';

var img=document.getelementbyId('madi');
var marginLeft=0;
function moveRight() {
    marginLeft=marginLeft+10;
    img.style.marginLeft+'px';
}
img.onclick=function () {
    var interval=setInterval(moveRight,100);
   
};