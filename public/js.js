




console.log("log")

var socket = io();


let lnf = 0;
let GameInProgress = false;
var hasGP = false;
var repGP;


function canGame() {
  return "getGamepads" in navigator;
}



$(document).ready(function () {

  socket.on("message",function(Message){


    
$("#messagebox").html(Message);
  });
  let myFlipster;
  socket.on("list", function (data) {

 
    data.forEach((element, i) => {
      $("#flat ul").append(`<li  data-flip-category="Games" data-value="${element.game}"  >${hasimages(element)}</li>`);
    });
    myFlipster = $("#flat").flipster({
      style: 'flat',
      spacing: -0.25,
      touch: true,
      onItemSwitch: function(crr,prv){
   
        if(!$(crr).find("#game").hasClass("active")){
          $(crr).find("#game").addClass("active")
          $(prv).find("#game").removeClass("active")
        }
    }
    });



  })

  let hasimages = function(element){
    console.log(element);
    switch(true){
    case element.game === "Steam" :
    return `<img  id="game" src="/images/steam.png">`
    break;
    case element.image != null :
    return `<img  id="game" src="${element.image}">`
    break; 
    default:
        return `<div id="game">${element.game}</div>`
    
    }
    
    }
let GameViewFunction  = function(){

  if(GameInProgress){
return null;

  }
  let controllerFunction = function (e) {
    let lengt = $("#gamelist li").length;
    let arr = $("#gamelist li");

    if (e === "left") {
      myFlipster.flipster('prev');
    } else {
      myFlipster.flipster('next');
    }

  }


  socket.emit("gameIsRunning",function(){
    GameInProgress = true;

  });
  let StartGame = function () {
 
    if(!GameInProgress){
      console.log(GameInProgress)
      GameInProgress = true;
    let data = $("#flat .flipster__item.flipster__item--current").data("value");
    $("#flat .flipster__item.flipster__item--current").addClass("clicked");
    socket.emit("startGame",data); 

  }else {
    GameInProgress = false;
   
  }
  
  }
socket.on("gajme")

  function controllLeftRight(num) {
    let coords = {};
    if (num.length > 2) {
      coords = { "x1": num[0], "y1": num[1], "x2": num[2], "y2": num[3] }
    }

    if (coords.x1 === -1 || coords.x2 === -1) {
      console.log("pushed")
      controllerFunction("left")

    }
    if (coords.x1 === 1 || coords.x2 === 1) {
      console.log("pushed2")
      controllerFunction("right")
    }

  }


  function reportOnGamepad() {
    var gp = navigator.getGamepads()[0];
    controllLeftRight(gp.axes);
    for (var i = 0; i < gp.buttons.length; i++) {

      if (gp.buttons[i].pressed) {
        console.log(i);
        switch(i){
          case 4 :
          case 6 :
          case 14 :
          case 13 :
          controllerFunction("left")
          break;
          case 5 :
          case 7 : 
          case 15 :
          case 12 : 
          controllerFunction("right")
          break;
          default : 
          StartGame();
        }
       
  

      }

    }
  }

  
  function checkkey(e) {
    console.log(e)
    if (e === "Enter") {
      StartGame();
    }
    if (e === "ArrowLeft") {
      controllerFunction("left")
    }
    if (e === "ArrowRight") {
      controllerFunction("right")
    }
  }


  $("#flat").dblclick(function(e){
if(e.target.id === "game"){
StartGame();

}
});

$("#flat ").on("touchstart",function(e){




if(e.target.className === "active"){

    StartGame();
    
    }
});


  
  $(window).on("keydown", function (e) {
    checkkey(e.originalEvent.key);


  })



  if (canGame()) {

    $(window).on("gamepadconnected", function () {
      hasGP = true;
    $("body").prepend("<img  class='controller' src='/images/gamepadicon.png' />")
      console.log("connection event");
      repGP = window.setInterval(reportOnGamepad, 100);
    });

 

    $(window).on("gamepaddisconnected", function () {
      $(".controller").remove()
      console.log("disconnection event");
   
      window.clearInterval(repGP);
    });

    //setup an interval for Chrome
    var checkGP = window.setInterval(function () {
      console.log('checkGP');
      if (navigator.getGamepads()[0]) {
        if (!hasGP) $(window).trigger("gamepadconnected");
        window.clearInterval(checkGP);
      }
    }, 500);
  }

}
GameViewFunction();


});