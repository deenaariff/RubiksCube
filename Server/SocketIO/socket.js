// Export initializer function for Socket Module


exports.init = function(_db, _dbf) {
      db = _db
      dbfunc = _dbf // All Database Interaction Functions
}

// Exports socket modules
exports.listen = function(io) {

      io.on('connection', function(socket) {

              console.log("Socket IO initialized");

              socket.emit('confirmConnection', io.engine.clientsCount);

              socket.on('user:login', function (data) {
                console.log("User Login Attempted")
                if(!data.u_email) {
                  console.log("data does not Exist")
                  socket.emit('err','ERROR: Incorrect or Insufficient Information Provided')
                } else {
                  dbfunc.authUser(data.u_email,data.pass,socket)
                }
              });

              socket.on('user:create', function (data) {
                var state;
                if(!data.u_email) {
                  socket.emit('err','ERROR: Incorrect or Insufficient Information Provided')
                  console.log("data does not Exist")
                  return;
                } else {
                  dbfunc.createUser(data.u_email,data.pass1,socket)
                }
              });

              socket.on('cube:update', function (data) {
                  console.log("data" + JSON.stringify(data))
                  if(!data.user.email) {
                    console.log("data does not Exist")
                    socket.emit('err','ERROR: No Information Provided')
                  } else {
                    dbfunc.updateCubeState(data.user.email,data.state,data.moves,data.time,socket)
                  }
              });

              socket.on('cube:solved', function (data) {
                  var email = data.emai;
                  var time = data.time;
                  if(!data.u_email) {
                    console.log("data does not Exist")
                    socket.emit('err','No Information Provided')
                  } else {
                    // Update Cube State
                  }
              });

              socket.on('confirmTime', function (data) {
                var email = data.emai;
                var time = data.time;
                if(!data.u_email) {
                  console.log("data does not Exist")
                  socket.emit('err','Authentication Error')
                } else {
                  // Update Cube State
                }
              });

              socket.on('disconnect', function () {
                // Update Time
              });


      });;
}
