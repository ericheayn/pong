;(function () {
  var Game = function (context, width, height) {
    this.ctx = context
    this.width = width
    this.height = height
    this.p1Score = 0
    this.p2Score = 0
    this.upP1Pressed = false
    this.downP1Pressed = false
    this.upP2Pressed = false
    this.downP2Pressed = false

    this.ball = new Ball(this.width / 2, this.height / 2, -1, 1)
    this.player1 = new Paddle(1, 30, (this.height / 2) - 40)
    this.player2 = new Paddle(2, this.width - 30, (this.height / 2) - 40)

    document.addEventListener('keydown', this.keyDownHandler.bind(this), false)
    document.addEventListener('keyup', this.keyUpHandler.bind(this), false)
  }

  Game.prototype.keyDownHandler = function (e) {
    if(e.code == 'KeyW') this.upP1Pressed = true
    if(e.code == 'KeyS') this.downP1Pressed = true
    if(e.code == 'ArrowUp') this.upP2Pressed = true
    if(e.code == 'ArrowDown') this.downP2Pressed = true
  }

  Game.prototype.keyUpHandler = function (e) {
    if(e.code == 'KeyW') this.upP1Pressed = false
    if(e.code == 'KeyS') this.downP1Pressed = false
    if(e.code == 'ArrowUp') this.upP2Pressed = false
    if(e.code == 'ArrowDown') this.downP2Pressed = false
  }

  Game.prototype.newRound = function () {
    this.ball = new Ball(this.width / 2, this.height / 2, -1, 1)
    this.player1 = new Paddle(1, 30, (this.height / 2) - 40)
    this.player2 = new Paddle(2, this.width - 30, (this.height / 2) - 40)
  }

  Game.prototype.drawScore = function (ctx) {
    ctx.font = '16px Arial'
    ctx.fillStyle = '#EEE'
    ctx.fillText(this.p1Score + ' : ' + this.p2Score, (this.width / 2) - 16, 20)
  }

  Game.prototype.update = function (timestamp) {
    this.ball.update()

    if(this.upP1Pressed && this.player1.y > 0) {
      this.player1.y -= this.player1.speed
    }

    if(this.downP1Pressed && this.player1.y + this.player1.height < this.height) {
      this.player1.y += this.player1.speed
    }

    if(this.upP2Pressed && this.player2.y > 0) {
      this.player2.y -= this.player2.speed
    }

    if(this.downP2Pressed && this.player2.y + this.player2.height < this.height) {
      this.player2.y += this.player2.speed
    }

    this.detectCollisions()
  }

  Game.prototype.render = function () {
    this.ctx.clearRect(0, 0, this.width, this.height)

    this.ball.render(this.ctx)
    this.player1.render(this.ctx)
    this.player2.render(this.ctx)
    this.drawScore(this.ctx)
  }

  Game.prototype.tick = function (timestamp) {
    this.stop = window.requestAnimationFrame(this.tick.bind(this))

    this.update(timestamp)
    this.render()
  }

  Game.prototype.detectCollisions = function () {
    if(this.ball.x <= 0) {
      this.p2Score++
      this.newRound()
    }
    if(this.ball.x >= this.width - this.ball.width) {
      this.p1Score++
      this.newRound()
    }
    if(this.ball.y <= 0 || this.ball.y >= this.height - this.ball.height) {
      this.ball.dy = -this.ball.dy
    }

    if(
      this.ball.x < this.player1.x + this.player1.width &&
      this.ball.x + this.ball.width > this.player1.x &&
      this.ball.y < this.player1.y + this.player1.height &&
      this.ball.y + this.ball.height > this.player1.y
    ) {
      this.ball.dx = -this.ball.dx
    }

    if(
      this.ball.x < this.player2.x + this.player2.width &&
      this.ball.x + this.ball.width > this.player2.x &&
      this.ball.y < this.player2.y + this.player2.height &&
      this.ball.y + this.ball.height > this.player2.y
    ) {
      this.ball.dx = -this.ball.dx
    }
  }

  var Ball = function (x, y, dx, dy) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy

    this.speed = 3
    this.width = 10
    this.height = 10
  }

  Ball.prototype.render = function (ctx) {
    ctx.beginPath()
    ctx.rect(this.x, this.y, this.width, this.height)
    ctx.fillStyle = '#EEE'
    ctx.fill()
    ctx.closePath()
  }

  Ball.prototype.update = function () {
    this.x += this.dx * this.speed
    this.y += this.dy * this.speed
  }

  var Player = function (score = 0) {
    this.score = score
  }

  var Paddle = function (playerId, x, y) {
    this.playerId = playerId
    this.x = x
    this.y = y

    this.width = 10
    this.height = 80
    this.speed = 10
  }

  Paddle.prototype.render = function (ctx) {
    ctx.beginPath()
    ctx.rect(this.x, this.y, this.width, this.height)
    ctx.fillStyle = '#FFF'
    ctx.fill()
    ctx.closePath()
  }

  Paddle.prototype.update = function () {

  }

  var canvas = document.getElementById('canvas')
  var context = canvas.getContext('2d')
  var game = new Game(context, canvas.width, canvas.height)
  game.tick()
})();
