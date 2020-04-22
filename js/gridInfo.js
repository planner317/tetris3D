function gridInofUpdate() {
    let i = document.getElementById("gridInfo");
    for (const e of i.children) {
        e.innerHTML = "";
    }

    for (let floor = game.board.grid.length - 1; floor > -1; floor--) {
        for (let row = 0; row < game.board.grid[floor].length; row++) {
            for (let col = 0; col < game.board.grid[floor][row].length; col++) {
                if (game.board.grid[floor][row][col]) {
                    i.children[9 - floor].innerHTML += "■";
                } else i.children[9 - floor].innerHTML += "□";

            }
            i.children[9 - floor].innerHTML += "<br>";
        }

    }
}


let viewNextBlockElement = document.getElementById("viewNextBlock");
let nextBlock = new ViewNextBlocks()

function ViewNextBlocks() {
    const PATH = "img/blocks/"
    this.blocks = [];
    for (let index = 0; index < 6; index++) {
        let random = Math.floor(Math.random() * blocks.length)
        this.blocks.push(random)
        let img = document.createElement("img")
        img.src = PATH + random + ".png";
        img.style.left = index * 80 + "px"
        viewNextBlockElement.append(img);
    }


    this.update = function () {
        for (const iterator of viewNextBlockElement.children) {
            if (iterator.offsetLeft < 400)
            iterator.style.left = iterator.offsetLeft + 80 + "px";
            else iterator.style.top = -80 + "px";
        }
        setTimeout(()=>{

            viewNextBlockElement.lastChild.remove();
            let img = document.createElement("img")
            img.style.left = 0;
            img.src = PATH + this.blocks[0] + ".png";
            viewNextBlockElement.prepend(img)
        },1000)
    }
}
