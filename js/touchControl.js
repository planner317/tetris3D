let controlRotate = document.getElementById("controlRotate");

controlRotate.ontouchstart = touchstart;
controlRotate.ontouchmove = touchmove;
controlRotate.ontouchend = touchend;

let XY = {};
function touchstart(e) {
    e.preventDefault();
    logtouchstart.innerHTML = `logtouchstart <br>x= ${e.touches[0].clientX} <br>
    y= ${e.changedTouches[0].clientY} <br>`
    XY.startX = e.touches[0].clientX
    XY.startY = e.touches[0].clientY
}
function touchmove(e) {
    e.preventDefault();

    logtouchmove.innerHTML = `logtouchmove <br>x= ${e.touches[0].clientX} <br>
    y= ${e.targetTouches[0].clientY} <br>`

    if (e.touches[0].clientX > XY.startX + 30) logStatus.innerHTML = "right"
    if (e.touches[0].clientX < XY.startX - 30) logStatus.innerHTML = "left"
    if (e.touches[0].clientY < XY.startY - 30) logStatus.innerHTML = "top"
    if (e.touches[0].clientY > XY.startY + 30) logStatus.innerHTML = "down"
    // if (+XY.startY > +e.touches[0].clientY - 200) logStatus.innerHTML = "down"
    // if (+XY.startY < +e.touches[0].clientY + 200) logStatus.innerHTML = "up"
}
let str, enter=0
function touchend(e){
    str="";
    loop(e)
    function loop(obj){

        for (const key in obj) {
            str += enter +" " + key +" == "+ obj[key] + "<br>";  
            logStatus.innerHTML=str;
            if (typeof obj[key] === "object") {
                enter++;
                if(enter>2) continue
                loop(obj[key])  
                enter--;
            }
        }
    }


}
