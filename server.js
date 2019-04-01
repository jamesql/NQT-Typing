const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cookieSession = require('cookie-session');
const passport = require('passport');
const settings = require('./settings.json');
const con = require('./functions/sql');
const hash = require('./lib/hash');

const alg = "///";

const app = express();
const http = require('http');
const server = http.createServer(app);

// view engine setup
app.set('trust proxy', true)
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.set('view options', {pretty: true})
.locals.pretty = app.get('env') === 'development';

app.use(logger('dev'))
.use(express.json())
.use(express.urlencoded({ extended: false }))
.use(cookieParser())
.use(express.static(path.join(__dirname, 'public')))
.use(passport.initialize())
.use(passport.session());

console.log("[NQT-Service] Typing Service Online!")
console.log("[NQT-Service] Typeracer Service Online!")

app.get('/getinfo', (req,res)=>{
  res.send(req.cookies.userData);
})

app.get('/logout', (req,res)=>{
  res.clearCookie('userData')
  res.redirect('/')
})

app.get('/auth/:username/:password', (req,res)=>{
  con.connect(function(err) {
    const data = con.query("SELECT * FROM users WHERE username='" + req.params.username + "'", function (err, result, fields) {
       if (result[0].password == hash.sha256(req.params.password + alg)) {
       let userinfo = {
          username : req.params.username,
          password : hash.sha256(req.params.password + alg)
        }
        res.cookie('userData', userinfo);
        res.redirect('/')
      }else{
        res.redirect('/login')
      }
    });
  });
})

app.get('/setdarkmode', (req,res)=>{
  res.cookie('theme', "dark");
  res.redirect('/');
})

app.get('/setlightmode', (req,res)=>{
  res.cookie('theme', "light");
  res.redirect('/');
})

app.get('/createuser/:username/:password/:classcode', (req,res)=>{
  con.connect(function(err) {
  const data = con.query("SELECT COUNT(*) AS total FROM users WHERE username='" + req.params.username + "'", function (err, result, fields) {
    if (result[0].total == 0) {
      const reg = con.query("INSERT INTO users (username,password,classcode) VALUES ('" + req.params.username + "','" + hash.sha256(req.params.password + alg) + "','" + req.params.classcode + "')", function (err2, result2, fields2) {
    });
    res.redirect('/login')
  }else{
      res.redirect('/register')
      }
    });
  });
})

app.get('/0110p/:course/:time/:wpm/:errors/:cc', (req,res)=>{
  var wpm = 0;
  var acc = 0;
  var avgchars = 300;

  con.connect(function(err1) {
    const data = con.query("INSERT INTO runs (username,course,time,classcode,wpm,errors) VALUES ('" + req.cookies.userData.username + "', '" + req.params.course +"'," + req.params.time + ",'" + req.params.cc + "'," + req.params.wpm + "," + req.params.errors + ")", function (err, result, fields) {
      const getRuns = con.query("SELECT wpm,errors FROM runs WHERE username='" + req.cookies.userData.username + "'", function (err, runs, fields) {
        for (var x = 0; x < runs.length; x++) {
          wpm += runs[x].wpm;
          acc += parseInt(100 * (avgchars - runs[x].errors) / avgchars);
        }
        wpm =  parseInt(wpm / runs.length);
        acc =  parseInt(acc / runs.length);
        const setWPM = con.query("UPDATE users SET wpm = " + wpm + " WHERE username='"+ req.cookies.userData.username +"'", function (err, rez, fields) {
          const setACC = con.query("UPDATE users SET accuracy = " + acc + " WHERE username='"+ req.cookies.userData.username +"'", function (err, res2, fields) {
          });
        });
      });
    });
  });
  res.redirect('/board/'+req.params.cc+"/"+req.params.course)
})

app.get('/createlobby/:name/:content', (req,res)=>{
  if (req.cookies.userData == null) {
    res.redirect('/login')
  }else{
    var lobbyid = parseInt(Math.random() * 100000000000);
  res.send("Name : " + req.params.name + " // Content : " + req.params.content + " // LOBBY ID : " + lobbyid)
  }
})

app.get('/joinlobby/:lobbyid', (req,res)=>{
  if (req.cookies.userData == null) {
    res.redirect('/login')
  }else{
    res.send("<script> alert(\"Joining Lobby #" + req.params.lobbyid + "...\")</script>")
  }
})

app.get('/leavelobby/:name/:lobbyid', (req,res)=>{
  if (req.cookies.userData == null) {
    res.redirect('/login')
  }else{
  }
})

// Quick Match
app.get('/matchmaking/quickmatch', (req,res)=>{

})

app.get('/lobbys/s/:search', (req, res, next) => {
	con.connect(function(err) {
		const data = con.query("SELECT * FROM lobbys WHERE name='" + req.params.search + "' ORDER BY id", function (err, lobbys, fields) {
			res.render('lobbys', { title: 'TypeRacer Lobbys', req, res, lobbys })
			console.log('test')
		});
	});
});


app.use('/', require('./routes/index'))
app.use('/sdash', require('./routes/sdash'))
app.use('/tdash', require('./routes/tdash'))
app.use('/register', require('./routes/register'))
app.use('/login', require('./routes/login'))
app.use('/board', require('./routes/board'))
app.use('/lobbys', require('./routes/lobbys'))
app.use('/typeracer', require('./routes/typeracer'))
app.use('/confirm', require('./routes/confirm'))

server.listen(process.env.PORT || 80);
