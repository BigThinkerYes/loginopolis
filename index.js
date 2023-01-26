const express = require('express');
const app = express();
const { User } = require('./db');
const bcrypt = require('bcrypt');


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app.post('/register', async (req, res, next) => {
  try{
    const {username, password} = req.body;
    const hash = await bcrypt.hash(password, 8);
    const user = await User.create({username : 'bobbysmiles', password :hash})
    
//     
if(!user || !password){
  return res.status(401).send(
    'incorrect username or password'
  );
} else {
    return res.status(200).send(
      'successfully created user bobbysmiles'
    )
}
}catch(error){
console.log(error.message);
next(error);
}
})


// ;;;;;;;;;;;;;;;;;;
// const hashPassword = async (password) =>{
//   const hash = await bcrypt.hash(password, 8);
//   console.log(hash);   
//   return hash;
// }
// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB

app.post('/login', async (req, res, next) => {
  try{
    const loginA = {username: 'bobbysmiles', password: 'notright'};
    const users = await User.findOne({where: {username: loginA.username}});
    if(!users[0]){
      return res.status(401).send(
       'incorrect username or password'
      );
    } 
    const user = users[0];
    const isMatch = await bcrypt.compare(loginA.password, user.password);
    if(!isMatch){
    return res.status(401).send(
      'incorrect username or password'
    )
  } else{
    return res.status(200).send(
    'successfully logged in user bobbysmiles'
    )
  }
  }catch(error){
    console.log(error.message);
    next(error);
  }
})
// we export the app, not listening in here, so that we can run tests
module.exports = app;
