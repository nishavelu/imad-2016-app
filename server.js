var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));


var articles={

    'article-one': {
    title: 'Article one | Nisha',
    heading: 'Article one',
    date: 'sep 7, 2016' ,
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
    title: 'Articletwo| Nisha',
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

function createtemplate(data){
    var title=data.title;
    var heading=data.heading;
    var date=data.date;
    var content=data.content;

var htmltemplate=`

<html>
 <head>
  <title>
  ${title}
  </title>
 
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="/ui/style.css" rel="stylesheet" />
 </head>

<body>
     <div class="container">
       <div>
        <a href="/">Home</a>
       </div>
    <hr/>
     <h3>
    ${heading}
</h3>
<div>
    ${date}
</div>
<div>
         ${content}
</div>
</div>
</body>
</html>
`;


return htmltemplate;
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


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

app.get('/articlename', function (req, res) {
  var artcclename=req.params.articlename;
   res.send(createtemplate(articles[articlename]));
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
