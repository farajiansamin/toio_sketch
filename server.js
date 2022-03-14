const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const path = require('path')
const { NearestScanner } = require('@toio/scanner')
const app = express()
const server = http.Server(app)
const io = socketio(server)

app.use(express.static(__dirname))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/simulator', (req, res) => {
  res.sendFile(path.join(__dirname + '/simulator.html'))
})

server.listen(3000, () => {
  console.log('listening 3000')
})

let cubes_global = null;
let cube2_x;
let cube2_y;
let cube2_angle;

async function main() {

  const cubess = await new NearScanner(2).start()


  const cube1 = cubess[0].connect()
  const cube2 = cubess[1].connect()

  console.log('connected')


  cube1.on('id:position-id', (data) => {

    //console.log(data)

    cube1_x = data.x
    cube1_y = data.y

  })

  cube2.on('id:position-id', (data) => {

    //console.log(data)

    cube2_x = data.x
    cube2_y = data.y
    cube2_angle = data.angle


    socket.emit('pos', { cubes: [data] })

  })





  cubes_global = cubes;






  socket.on('move', (x, y) => {

    // console.log("x = ", x)
    // console.log("y = ", y)

    if (cubes_global) {
      cube2.move(...move(x, y, cube2_x, cube2_y, cube2_angle), 100)
      //console.log(move(20, 20, cube_global))
    }

    //console.log(move(x, y, cube))

  })

  // main(socket)


}


function move(targetX, targetY, cX, cY, cA) {

  // console.log("cube = ", cube)

  // console.log("targetX = ", targetX)
  // console.log("targetY = ", targetY)

  // console.log("cubeX = ", cube.x)
  // console.log("cubeY = ", cube.y)

  let diffX = targetX - cX
  let diffY = targetY - cY
  let distance = Math.sqrt(diffX ** 2 + diffY ** 2)

  // console.log("diffX = ", diffX)
  // console.log("diffX = ", diffX)
  // console.log("diffY = ", diffY)
  // console.log("distance = ", distance)

  if (distance < 5) {
    return [0, 0]
  }

  let relAngle = (Math.atan2(diffY, diffX) * 180) / Math.PI - cA
  //console.log("relAngle = ", relAngle)
  relAngle = relAngle % 360

  if (relAngle < -180) {
    relAngle += 360
  }

  else if (relAngle > 180) {
    relAngle -= 360
  }

  let ratio = Math.abs(1 - Math.abs(relAngle) / 90)
  //console.log("Ratio = ", ratio)

  let speed = 40

  if (relAngle > 0 && relAngle <= 90) {
    // forward
    console.log('test1')

    return [speed, speed * ratio]
  }

  else if (relAngle > 90) {
    // backward
    console.log('test2')

    return [-speed, -speed * ratio]
  }

  else if (relAngle < 0 && relAngle >= -90) {
    // forward
    console.log('test3')

    return [speed * ratio, speed]
  }

  else if (relAngle < -90) {
    // backward
    console.log('test4')

    return [-speed * ratio, -speed]
  }

  if (relAngle > 0) {
    console.log('test5')
    return [speed, speed * ratio]
  }

  else {
    console.log('test6')
    return [speed * ratio, speed]
  }

}












