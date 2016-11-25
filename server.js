var express = require('express');
var morgan = require('morgan');
var path = require('path');
var pg =require('pg');


//var Pool = require('pg').Pool;

var config = {
user: 'nishavelu',
database: 'nishavelu',
host: 'db.imad.hasura-app.io',
port: '5432',
password: process.env.DB_PASSWORD
};


var app = express();
app.use(morgan('combined'));



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

</div>
</div>
</body>
</html>
`;


return HTMLTemplate;
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});




var pool = new pg.Pool(config);

var counter=0;
app.get('/counter', function (req, res)
{
    counter = counter + 1;
    res.send(counter.toString());
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


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
