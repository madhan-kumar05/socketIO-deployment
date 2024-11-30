
## Installation

Install express package with npm

```bash
  cd your-project (Your project directory)
  npm install express
  npm install socket.io
```

Create a JS file

## server.js 

Add the below code to start, listen and emit in socket

```
  const express = require('express');
  const http = require('http');
  const socketIo = require('socket.io');
  const app = express();

  const server = http.createServer(app);

  // CORS setup
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
  });

  // Create HTTP server and Socket.IO server
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.on('message', (msg) => {
      io.emit('message', msg);
    });
  });

  // Start the server
  server.listen(3000, () => {
    console.log('Listening on Port 3000');
  });
```

Create HTML file

## index.html

Add the below in that file to listen and emit in socket

```
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.5">
      <title>Socket IO</title>
      <!-- Socket CDN -->
      <script src="https://cdn.socket.io/4.8.1/socket.io.min.js" integrity="sha384-mkQ3/7FUtcGyoppY6bz/PORYoGqOl7/aSUMn2ymDOJcapfS6PHqxhRTMh1RR0Q6+" crossorigin="anonymous"></script>
    </head>
    <body>
      <div class="continer">
        <div class="message" id="message"></div>
        <div class="cta-section">
          <input type="text" name="input-box" id="text-box" />
          <button type="button" onclick="sendData()">Send</button>
        </div>
      </div>

      <script>
        const socket = io('http://localhost:3000/');

        function sendData(){
          let data = document.getElementById('text-box').value;
          socket.emit('message', data);
        }

        // Receice from message
        socket.on('message', function (data) {
          const messageElement = document.createElement("p");
          messageElement.textContent = data;
          document.getElementById("message").appendChild(messageElement);
        });
      </script>
    </body>
  </html>
```

## Run the server
```bash
  node server.js
```

  The above code will run the socket in 3000 port

```javascript
  function sendData(){
    let data = document.getElementById('text-box').value;
    socket.emit('message', data);
  }
```
  The above function in the index.html file will emit the data in the channel `message`

```javascript
  socket.on('message', function (data) {
    /* your logic */
  });
```
  The above function in the index.html file will listen to the channel `message`

## Deployment
To deploy this in cloud
##
nginx config file location

```bash
  /etc/nginx/sites-enabled/
```

Add the below in the nginx config file

```bash
  location ~ ^/(node|socket\.io) {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
```