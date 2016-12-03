var express = require('express');
var morgan = require('morgan');
var path = require('path');
//var pg =require('pg');


var Pool = require('pg').Pool;
var crypto =require('crypto');
var bodyParser = require('body-parser');
var session =require('express-session');


var config = {
user: 'nishavelu',
database: 'nishavelu',
host: 'db.imad.hasura-app.io',
port: '5432',
password: process.env.DB_PASSWORD
};


var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({ 
    secret: 'anythingRandom',
    cookie :{maxAge : 1000*60 *60* 24 *30}
    
    }));



var articles={

    'article-one': {
        
    title: 'Article one | Nisha',
    heading: 'Article one',
    date: 'Aug 01, 2016' ,
    content:   
     `  <p>
        This is the content for my first Oracle. This is the content formy first Oracle. This is the content formy first Oracle. This is thecontent formy first Oracle. This is the content formy first Oracle. This is the content formy first Oracle. 
        
    </p>
     <p>
        This is the content formy first Oracle. This is the content formy first Oracle. This is the content formy first Oracle. This is the content formy first Oracle. This is the content formy first Oracle. This is the content formy first Oracle. 
        
    </p>
    
     <p>
        This is the content formy first Oracle. This is the content formy first Oracle. This is the content formy first Oracle. This is the content formy first Oracle. This is the content formy first Oracle. This is the content formy first Oracle. 
    </p> `
},
'article-two': {
    title: 'Article two| Nisha',
    heading:'Article Two',
    date:'sep 10, 2016' ,
    content:
    ` <p>
    This is the content for my second article.
  </p>  `  
},

'article-three':{
    title: 'Article Three | Nisha' ,
    heading:'Article Three' ,
    date:'sep 15,2016' ,
    content:
    ` <p>
    This is my third article.
    </p> `
} 
};

function createTemplate (data) {
     var title= data.title;
     var date=data.date;
     var heading=data.heading;
     var content=data.content;
     
var HTMLTemplate =`
    <html>
    <head>
    <title>
       ${title}
      </title>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <link href="/ui/style.css" rel="stylesheet" />
      
    </head>
    
    <body>
        <div class="container" style="border:none;">
     
       <div>
        <div>
        
        <h2 style="color:navy;text-align:center;"> <b>${heading}</b> </h2>
        <a href="/" style="color:maroon;"> Home </a>
        <hr>
        </div>
        <div>
        ${date.toDateString()}
        </div>
        <hr>
        <div>
        ${content}
              <hr/>
              <h4>Comments</h4>
              <div id="comment_form">
              </div>
              <div id="comments">
                <center>Loading comments...</center>
              </div>
          </div>
<script type="text/javascript" src="/ui/article.js"></script>
</div>
</div>
</body>
</html>
`;


return HTMLTemplate;
}


function hash(input,salt){
    //create a hash 
    var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
}

app.get('/hash/:input',function(req,res){
    var hashedString = hash(req.params.input,'this-is-some-random-string');
    res.send(hashedString);
});

var pool= new Pool(config);
//register user start
app.post('/register-user',function(req,res){
 var uname = req.body.uname;
 var passwd =req.body.passwd;
 var salt = crypto.randomBytes(128).toString('hex');
 var dbString = hash(passwd,salt);
 pool.query('INSERT INTO user_testing (username,password) VALUES ($1,$2)',[uname,dbString],function(err,result){
  if(err){
    res.status(500).send(err.toString());
  }
  else{
    res.status(200).send('User created successfully'+uname);
  }
 });
});


//create user end

app.post('/login',function(req,res){
    var username = req.body.username; //Request body req.body
    var password = req.body.password;
    pool.query('SELECT * FROM user_testing WHERE username = $1 ' ,[username],function(err,result){
      if(err){
          res.status(500).send(err.toString());
      } 
      else {
          if(result.rows.length ===0){
              res.status(403).send('Username/password is invalid');        
      }else{
        //match the password
          var dbString =result.rows[0].password;
          var salt = dbString.split('$')[2];
          var hashedPassword = hash(password,salt);
          if(hashedPassword ===dbString){
              //set the session
              req.session.auth ={userId:result.rows[0].id};
            res.send('Logged in ');
            
          }else
          {
           res.status(403).send('Username/password is invalid');        
          }
      }
          
      }
    });
});

//check login endpoint starts
    app.get('/check-login',function(req,res){
       if(req.session && req.session.auth && req.session.auth.userId) {
           res.send("you are logged in "+req.session.auth.userId.toString());
       }
       else{
           res.send("You are not logged in ");
       }
    });


//check login endpoint ends

//logout endpoint starts
    app.get('/logout',function(req,res){
       delete  req.session.auth;
       res.send("you are logged out");
    });
    



//var pool = new pg.Pool(config);

app.get('/test-db', function (req,res){
    // make a select request
    // return a response with the result
    
    pool.query('SELECT * FROM test',function(err, result){
       if (err){
           res.status(500).send(err.toString());
          } else {
              res.send(JSON.stringify(result.rows));
          }
          
      });
});



var counter=0;
app.get('/counter', function (req, res)
{
    counter = counter + 1;
    res.send(counter.toString());
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/register.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'register.html'));
});

var names=[];
app.get('/submit-name', function (req, res) {
    var name= req.query.name;
    names.push(name);
    res.send(JSON.stringify(names));
});    

app.get('/articles/:articleName', function (req, res) {

  pool.query("SELECT * FROM article WHERE title= $1",[req.params.articleName], function(err,result){
    if(err){
        res.status(500).send(error.toString());
        } 
    else {
          if (result.rows.length===0)
              { res.status(404).send ('Article not found');
                } 
           else {
                 var articleData=result.rows[0];
                 res.send(createTemplate(articleData));
                }
        }
  });
    });


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});


app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/register.js',function(req,res){
    res.sendFile(path.join(__dirname,'ui','register.js'));
    
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
