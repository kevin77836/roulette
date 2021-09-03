//載入頁面
window.onload = function(){
  let game = new Game()
  game.initGame()
  game.wheel.arrowCanvas.addEventListener('click', function(evt){
    let center = new Vector(window.innerWidth/2,window.innerHeight/2)
    let nowPos = new Vector(evt.x,evt.y)
    let dist = center.sub(nowPos).length
    if (dist<65){
      game.pressButton()
    }
  })
  game.wheel.arrowCanvas.addEventListener("mousemove",function(evt){
    let center = new Vector(window.innerWidth/2,window.innerHeight/2)
    let nowPos = new Vector(evt.x,evt.y)
    let dist = center.sub(nowPos).length
    if (dist<65 && game.status != "rotating"){
      game.wheel.arrowCanvas.style.cursor = "pointer"
      game.button.style.color = game.wheel.color.light
    }
    else if(game.status == "rotating"){
      game.button.style.color = game.wheel.color.dark
      game.wheel.arrowCanvas.style.cursor = "initial"
    }
    else{
      game.wheel.arrowCanvas.style.cursor = "initial"
      game.button.style.color = game.wheel.color.pink
    }
  })
}
class Wheel{
  constructor(){
    //轉盤Canvas
    this.canvas = document.getElementById("wheelCanvas")
    this.ctx = this.canvas.getContext("2d")
    this.ww = this.canvas.width = 1440
    this.wh = this.canvas.height = 1440
    //移至畫布中心
    this.ctx.translate(this.ww/2,this.wh/2)
    //指針Canvas
    this.arrowCanvas = document.getElementById("arrowCanvas")
    this.actx = this.arrowCanvas.getContext("2d")
    this.aww = this.arrowCanvas.width = 1440
    this.awh = this.arrowCanvas.height = 1440
    //移至畫布中心
    this.actx.translate(this.aww/2,this.awh/2)

    this.color = {
      dark: "#343BAA",
      light: "#F0BDFF",
      line: "#1F1072",
      pink: "#FF00B9",
      white: "#FFFFFF"
    }
    this.obj = [
      {prize : "APPLE", imgSrc : "assets/img/apple.svg", chonsenImgSrc:"assets/img/apple_hover.svg"},
      {prize : "BALL", imgSrc : "assets/img/ball.svg", chonsenImgSrc:"assets/img/ball_hover.svg"},
      {prize : "CAR", imgSrc : "assets/img/car.svg", chonsenImgSrc:"assets/img/car_hover.svg"},
      {prize : "DOG", imgSrc : "assets/img/dog.svg", chonsenImgSrc:"assets/img/dog_hover.svg"},
      {prize : "EGG", imgSrc : "assets/img/egg.svg", chonsenImgSrc:"assets/img/egg_hover.svg"},
      {prize : "FROG", imgSrc : "assets/img/frog.svg", chonsenImgSrc:"assets/img/frog_hover.svg"},
    ]
    this.imgs = new Array()
    this.chosenImgs = new Array()
  }
  drawAll(chosenNubmer){
    this.ctx.globalAlpha = 1
    this.drawWheelInside(chosenNubmer)
    this.drawWheelOutside()
    this.fillInf(chosenNubmer)
    this.drawImg()
    this.drawChosenImg(chosenNubmer)
    this.drawArrow()
  }
  drawWheelInside(chosenNubmer){
    this.ctx.save()
    for(let i = 0; i < this.obj.length;i++){
        this.ctx.beginPath()
            this.ctx.moveTo(0,0)
            //Math.PI為九點鐘方向 Math.PI/2為六點鐘方向 Math.PI/2*3為十二點鐘方向
            //(Math.PI*2)為360度 除掉this.obj.length分割數 再除二是頂點加剪角度的一半
            this.ctx.arc(0,0,300,(Math.PI/2*3)-((Math.PI*2)/this.obj.length/2), (Math.PI/2*3)+((Math.PI*2)/this.obj.length/2))
            this.ctx.closePath()
            if(i==chosenNubmer){
              this.ctx.fillStyle = this.color.pink
            }
            else if(i%2 == 1){
              this.ctx.fillStyle= this.color.light
            }
            else{
              this.ctx.fillStyle= this.color.dark
            }
            this.ctx.fill()
            this.ctx.lineWidth = 2
            this.ctx.strokeStyle= this.color.line
            this.ctx.stroke()
            this.ctx.rotate(Math.PI*2/this.obj.length)
    }
    this.ctx.restore()
  }
  drawWheelOutside(){
    this.ctx.save()
        //outside
        this.ctx.beginPath()
            this.ctx.arc(0,0,290,0,Math.PI*2)
            this.ctx.moveTo(310,0)
            this.ctx.arc(0,0,310,0,Math.PI*2,true)
            this.ctx.fillStyle= this.color.dark
            this.ctx.fill()
            this.ctx.lineWidth = 2
            this.ctx.strokeStyle= this.color.line
            this.ctx.stroke()
            for(let i = 0; i < this.obj.length;i++){
                this.ctx.beginPath()
                this.ctx.save()
                    //pink star
                    this.ctx.translate(0,-290)
                    this.ctx.moveTo(0,0)
                    this.ctx.lineTo(5,-10)
                    this.ctx.lineTo(15,-15)
                    this.ctx.lineTo(5,-20)
                    this.ctx.lineTo(0,-30)
                    this.ctx.lineTo(-5,-20)
                    this.ctx.lineTo(-15,-15)
                    this.ctx.lineTo(-5,-10)
                    this.ctx.closePath()
                    this.ctx.fillStyle= this.color.pink
                    this.ctx.fill()
                    this.ctx.lineWidth = 2
                    this.ctx.strokeStyle = this.color.line
                    this.ctx.stroke()

                    //white circle
                    this.ctx.beginPath()
                    this.ctx.arc(0,0,4,0,Math.PI*2)
                    this.ctx.fillStyle= this.color.white
                    this.ctx.fill()
                    this.ctx.lineWidth = 2
                    this.ctx.strokeStyle = this.color.line
                    this.ctx.stroke()
                this.ctx.restore()
                //Math.PI*2為360度 除掉this.obj.length為獎品數
                this.ctx.rotate(Math.PI*2/this.obj.length)
            }
    this.ctx.restore()
  }
  fillInf(chosenNubmer){
    this.ctx.save()
    for(let i = 0; i < this.obj.length; i++){
      this.ctx.save()
        this.ctx.translate(0,-200)
        if(i==chosenNubmer){
          this.ctx.fillStyle = this.color.white
        }
        else if(i%2 == 1){
          this.ctx.fillStyle= this.color.dark
        }
        else{
          this.ctx.fillStyle= this.color.light
        }
        this.ctx.font="1.5rem Roboto Condensed";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle"
        this.ctx.fillText(this.obj[i].prize,0,0);
      this.ctx.restore()
      //Math.PI*2為360度 除掉this.obj.length為獎品數
      this.ctx.rotate(Math.PI*2/this.obj.length)
    }
    this.ctx.restore()
  }
  drawImg(){
    this.ctx.save()
    for(let i = 0; i < this.obj.length; i++){
      this.imgs[i] = new Image()
      this.imgs[i].src = this.obj[i].imgSrc
      this.imgs[i].onload = ()=>{
        this.ctx.drawImage(this.imgs[i], -25, -270, 50, 50)
        //Math.PI*2為360度 除掉this.obj.length為獎品數
        this.ctx.rotate(Math.PI*2/this.obj.length)
      }
    }
    this.ctx.restore()
  }
  drawChosenImg(chosenNubmer){
    //以透明度設定得獎
    this.ctx.save()
    for(let i = 0; i < this.obj.length; i++){
      this.chosenImgs[i] = new Image()
      this.chosenImgs[i].src = this.obj[i].chonsenImgSrc
      this.chosenImgs[i].onload = ()=>{
        if(i == chosenNubmer){
          this.ctx.globalAlpha = 1
        }
        else{
          this.ctx.globalAlpha = 0
        }
        this.ctx.drawImage(this.chosenImgs[i], -25, -270, 50, 50)
        //Math.PI*2為360度 除掉this.obj.length為獎品數
        this.ctx.rotate(Math.PI*2/this.obj.length)
      }
    }
    this.ctx.restore()
  }
  drawArrow(){
    this.actx.save()
        //菱形空心指針
        this.actx.save()
            this.actx.translate(0,-130)
            this.actx.beginPath()
                this.actx.moveTo(12.5,0)
                this.actx.lineTo(0,-25)
                this.actx.lineTo(-12.5,0)
                this.actx.lineTo(0,25)
                this.actx.closePath()

                this.actx.moveTo(22.5,0)
                this.actx.lineTo(0,-45)
                this.actx.lineTo(-22.5,0)
                this.actx.lineTo(0,45)
                this.actx.closePath()
                
                this.actx.fillStyle= this.color.pink
                //內路徑挖空成空心
                this.actx.fill('evenodd')
                this.actx.lineWidth = 2
                this.actx.strokeStyle = this.color.line
                this.actx.stroke()
        this.actx.restore()

        this.actx.beginPath()
            this.actx.moveTo(50,0)
            this.actx.lineTo(65,0)
            this.actx.lineTo(0,-130)
            this.actx.lineTo(0,-100)
            this.actx.closePath()
            this.actx.moveTo(-50,0)
            this.actx.lineTo(-65,0)
            this.actx.lineTo(0,-130)
            this.actx.lineTo(0,-100)
            this.actx.closePath()
            this.actx.fillStyle= this.color.pink
            this.actx.fill()
            this.actx.lineWidth = 2
            this.actx.strokeStyle = this.color.line
            this.actx.stroke()
        //button
        this.actx.beginPath()
            this.actx.arc(0,0,65,0,Math.PI*2)
            this.actx.fillStyle= this.color.line
            this.actx.fill()
        
        this.actx.beginPath()
            this.actx.arc(0,0,65,0,Math.PI*2)
            this.actx.moveTo(80,0)
            //true做成空心圓
            this.actx.arc(0,0,80,0,Math.PI*2,true)
            this.actx.fillStyle= this.color.pink
            this.actx.fill()
            this.actx.lineWidth = 2
            this.actx.strokeStyle = this.color.line
            this.actx.stroke()
        //菱形
        this.actx.beginPath()
            this.actx.moveTo(0,-100)
            this.actx.lineTo(10,-80)
            this.actx.lineTo(0,-60)
            this.actx.lineTo(-10,-80)
            this.actx.closePath()
            this.actx.fillStyle= this.color.light
            this.actx.fill()
            this.actx.lineWidth = 2
            this.actx.strokeStyle = this.color.line
            this.actx.stroke()
        //白球
        this.actx.save()
            this.actx.translate(0,-130)
            this.actx.beginPath()
                this.actx.arc(0,0,6,0,Math.PI*2)
                this.actx.fillStyle= this.color.white
                this.actx.fill()
                this.actx.lineWidth = 2
                this.actx.strokeStyle = this.color.line
                this.actx.stroke()
        this.actx.restore()
    this.actx.restore()
  }
}
class Game{
  constructor(){
    //旋轉持續時間
    this.time = 5000
    //總共轉幾圈
    this.numberOfTurns = 5
    //旋轉幾度  
    this.deg
    //旋轉到第幾區塊
    this.chosenNumber
    //現在狀況
    this.status
    this.wheel = new Wheel()
    this.result = document.querySelector(".result")
    this.prizeResult = document.querySelector(".prize")
    this.button = document.querySelector(".button")
  }
  initGame(){
    this.status ="ready"
    this.button.innerHTML = "PRESS"
    this.button.style.color = this.wheel.color.pink
    this.wheel.drawAll()
  }
  pressButton(){
    if(this.status == "ready"){
      this.startGame()
    }
    if(this.status == "waiting"){
      this.returnGame()
    }
  }
  startGame(){
    this.status = "rotating"
    this.button.innerHTML = "ROTATING"
    this.button.style.color = this.wheel.color.dark
    this.randomDeg()
    this.rotateWheel(0, this.deg, this.time)
    setTimeout(()=>this.renderResult(this.getNumber), this.time)
  }
  returnGame(){
    this.status = "rotating"
    this.button.innerHTML = "ROTATING"
    this.button.style.color = this.wheel.color.dark
    let returnTime = 1000-(this.deg%360)*2
    this.rotateWheel(this.deg%360, 360, returnTime)
    setTimeout(()=>this.toggleResult(1,0), returnTime)
    setTimeout(()=>this.initGame(), returnTime)
  }
  renderResult(number){
    this.status = "waiting"
    this.button.innerHTML = "RETURN"
    this.button.style.color = this.wheel.color.pink
    this.toggleResult(0,1)
    this.wheel.drawAll(number)
    this.prizeResult.innerHTML = this.wheel.obj[number].prize
  }
  rotateWheel(start,end,time){
    this.wheel.arrowCanvas.animate([{
      transform: `rotate(${start}deg)`
    },
    {
      transform: `rotate(${end}deg)`
    }
    ], {
        easing: "cubic-bezier(0.250, 0.000, 0.000, 1.000)",
        duration: time
    })
    if(end == 360){
      this.wheel.arrowCanvas.style.transform = `rotate(0deg)`
    }else{
      this.wheel.arrowCanvas.style.transform = `rotate(${end}deg)`
    }
  }
  toggleResult(start,end){
    this.result.animate([{
      opacity: start
    },
    {
      opacity: end
    }
    ], {
        easing: "cubic-bezier(0.250, 0.000, 0.000, 1.000)",
        duration: this.time/20
    })
    this.result.style.opacity = end
  }
  randomDeg(){
    let round = 360
    //角度介於 numberOfTurns+1圈 與 numberOfTurns圈 之間的隨機亂數
    this.deg = Math.floor(Math.random() * (round * (this.numberOfTurns + 1) - round * this.numberOfTurns)) + round * this.numberOfTurns
    return this.deg
  }
  get getNumber(){
    let round = 360
    let section = this.wheel.obj.length
    //(round/section)/2 為一個section0從原點出發到section1交界點
    //%round 為取圈數之餘數
    //(round/section)除掉一個section的角度
    return parseInt((((round/section)/2+this.deg)%round)/(round/section))
  }
}
//向量模板
class Vector{
  constructor(x,y){
    this.x = x || 0
    this.y = y || 0
  }
  sub(v){
    return new Vector( this.x - v.x , this.y - v.y )
  }
  get length(){
    return Math.sqrt(this.x*this.x + this.y*this.y)
  }
}