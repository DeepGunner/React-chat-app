
const db = require("./models");

var users = [
{username: 'Deep', password: 'deep', email: 'deep@deep.io'},
{username: 'Vamshi', password: 'deep', email: 'vamshi@deep.io'},
{username: 'Ben', password: 'deep', email: 'ben@deep.io'}
]


users.forEach(function(user){

  db.User.create(user, function(err, usr){

    console.log("User created, now updating room #general")

    console.log(usr)

    db.Room.findOneAndUpdate(
      {channel_id: 'general'},
      {$push: { users: usr._id } },
      {upsert: true }
    ).exec();
  });
});
