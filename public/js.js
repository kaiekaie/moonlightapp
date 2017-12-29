console.log("log")

var socket = io();

socket.on("list",function(data){
  console.log(data)  
})

var hasGP = false;
var repGP;

function canGame() {
    return "getGamepads" in navigator;
}
function checkkey(e){
  console.log(e);


}



function controllLeftRight(num){
  let coords = {};
  if(num.length > 2){
    coords = {"x1" : num[0], "y1" : num[1], "x2" :  num[2] , "y2" : num[3] }
  }

  if(coords.x1 === -1 || coords.x2 === -1){
    console.log("left",num);
  }
  if(coords.x1 === 1 || coords.x2 === 1){

    console.log("right",num);
  }

}

function reportOnGamepad() {
  let coordinates = {};
    var gp = navigator.getGamepads()[0];
    var html = "";
        html += "id: "+gp.id+"<br/>";

    for(var i=0;i<gp.buttons.length;i++) {
        html+= "Button "+(i+1)+": ";
        if(gp.buttons[i].pressed) html+= " pressed";
        html+= "<br/>";
    }

    for(var i=0;i < gp.axes.length; i +=2) {
      controllLeftRight(gp.axes);
 
        html+= "Stick "+(Math.ceil(i/2)+1)+": "+gp.axes[i]+","+gp.axes[i+1]+"<br/>";
    }

    $("#gamepadDisplay").html(html);
}

$(document).ready(function() {

    if(canGame()) {

        var prompt = "To begin using your gamepad, connect it and press any button!";
        $("#gamepadPrompt").text(prompt);

        $(window).on("gamepadconnected", function() {
            hasGP = true;
            $("#gamepadPrompt").html("Gamepad connected!");
            console.log("connection event");
            repGP = window.setInterval(reportOnGamepad,100);
        });
  
        $(window).on("keydown", function(e) {
         checkkey(e.originalEvent.key);
         if(e.originalEvent.key === "ArrowLeft"){


         }
         if(e.originalEvent.key === "ArrowRight"){
          
          
         }


        })
        $(window).on("gamepaddisconnected", function() {
            console.log("disconnection event");
            $("#gamepadPrompt").text(prompt);
            window.clearInterval(repGP);
        });

        //setup an interval for Chrome
        var checkGP = window.setInterval(function() {
            console.log('checkGP');
            if(navigator.getGamepads()[0]) {
                if(!hasGP) $(window).trigger("gamepadconnected");
                window.clearInterval(checkGP);
            }
        }, 500);
    }

});