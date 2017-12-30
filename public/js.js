


console.log("log")

var socket = io();



var hasGP = false;
var repGP;

function canGame() {
  return "getGamepads" in navigator;
}


let lnf = 0;
let pressed = false;
$(document).ready(function () {

  socket.on("message",function(Message){

$("body").append(Message);
  });
  let myFlipster;
  socket.on("list", function (data) {
    console.log(data)
    data.forEach((element, i) => {
      $("#flat ul").append(`<li  data-value="${element}"  ><div class="item">${element}</div></li>`);
    });
    myFlipster = $("#flat").flipster({
      style: 'flat',
      spacing: -0.25,
      touch: true
    });



  })


  let realFunction = function (e) {
    let lengt = $("#gamelist li").length;
    let arr = $("#gamelist li");

    if (e === "left") {
      myFlipster.flipster('prev');
    } else {
      myFlipster.flipster('next');
    }



  }
  let StartGame = function () {
 
    if(!pressed){
      console.log(pressed)
      pressed = true;
    let data = $("#flat .flipster__item.flipster__item--current").data("value");
    $("#flat .flipster__item.flipster__item--current").addClass("clicked");
  

    socket.emit("startGame",data); 

    setTimeout(() => {
      pressed = false;
    },2000)
  }
  
  }


  function controllLeftRight(num) {
    let coords = {};
    if (num.length > 2) {
      coords = { "x1": num[0], "y1": num[1], "x2": num[2], "y2": num[3] }
    }

    if (coords.x1 === -1 || coords.x2 === -1) {
      console.log("pushed")
      realFunction("left")

    }
    if (coords.x1 === 1 || coords.x2 === 1) {
      console.log("pushed2")
      realFunction("right")
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
          realFunction("left")
          break;
          case 5 :
          case 7 : 
          case 15 :
          case 12 : 
          realFunction("right")
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
      realFunction("left")

    }
    if (e === "ArrowRight") {

      realFunction("right")
    }



  }




  if (canGame()) {



    $(window).on("gamepadconnected", function () {
      hasGP = true;
    
      console.log("connection event");
      repGP = window.setInterval(reportOnGamepad, 100);
    });

    $(window).on("keydown", function (e) {
      checkkey(e.originalEvent.key);


    })

    $(window).on("gamepaddisconnected", function () {
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

});