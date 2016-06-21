var db;

/* Initialize Cube*/
var initCube = {
	'1': [['g','g','g'],['g','g','g'],['g','g','g']],
	'2': [['r','r','r'],['r','r','r'],['r','r','r']],
	'3': [['y','y','y'],['y','y','y'],['y','y','y']],
	'4': [['b','b','b'],['b','b','b'],['b','b','b']],
	'5': [['w','w','w'],['w','w','w'],['w','w','w']],
	'6': [['p','p','p'],['p','p','p'],['p','p','p']],
}

exports.init = function (_db, oid) {
  db = _db;
  _ObjectId = oid;
}

exports.createUser = function(email,pass,socket) {
  db.users.find({u_email: email}, function (err, data) {
    if (err) {
      console.log(err);
    }
    if(data.length > 0) {
      socket.emit('err','ERROR: User Already Exists')
    } else {
      db.users.save({u_email: email, password: pass, moves: 0, time: (new Date().getTime() / 1000), state: initCube}, function(err, saved) {
        if( err || !saved ) console.log("User not saved");
        else {
          socket.emit('initCube', saved[0])
          socket.emit('err', 'User ' + email + ' initiated')
        }
      });
    }
  });
}

exports.authUser = function (email, pass, socket) {
  db.users.find({u_email: email, password: pass}, function (err, data) {
    if (err)
      console.log(err);
    if(data.length > 0) {
      console.log("User Logged In")
      socket.emit('initCube', data[0])
      socket.emit('err', 'User Found');
    } else {
      console.log("User Not Found")
      socket.emit('err', 'ERROR: User with name email and password not found');
    }
  });
};


exports.updateCubeState = function (email,st,mov,tim,socket) {
  console.log(JSON.stringify(st));
  db.users.findAndModify({
    query: { u_email: email },
    update: { $set: { state: st, time: tim, moves: mov} },
    new: true
  }, function(err, updated) {
    if( err || !updated ) socket.emit('err','State not Updated');
    else console.log("User updated");
  });
};
