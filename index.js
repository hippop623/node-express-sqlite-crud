var express = require('express');
var app = express();

////SQL 모델 만들기
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Comments = sequelize.define('Comments', {
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

(async() => { //기다리는 함수들 사용하게 해주는 async
await Comments.sync(); // await은 오래걸리니까 기다려주겠다는 함수
})();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


//// set the view engine to ejs
app.set('view engine', 'ejs');


//// DB 읽기
app.get('/', async function(req, res) {
  const comments = await Comments.findAll(); // DB read
  res.render('index', {comments: comments}) //index.ejs에 comments변수 보내기
});

//// DB 생성
app.get('/create', function(req, res){
    console.log(req.query) //get에서는 query
    res.send('hi')
})

app.post('/create2', async function(req, res){ //await을 쓰려면 function이 반드시 async가 있어야한다
  console.log(req.body) //post에서는 body
  const {content} = req.body
  
  // comments.push(content) //array에는 push로 넣어주고, 
  await Comments.create({ content: content}); //DB에서는 create

  res.redirect('/') // root경로로 다시 보내주겠다.
})

//// DB 업데이트
app.post('/update/:id', async function(req, res){ //await을 쓰려면 function이 반드시 async가 있어야한다
  console.log(req.params)
  console.log(req.body)
  const {id} = req.params
  const {content} = req.body
  
  await Comments.update({ content: content }, {
    where: {
      id: id
    }
  });

  res.redirect('/') // root경로로 다시 보내주겠다.
})

//// DB 삭제
app.post('/delete/:id', async function(req, res){ //await을 쓰려면 function이 반드시 async가 있어야한다
  console.log(req.params)
  const {id} = req.params
  
  await Comments.destroy({
    where: {
      id: id
    }
  });

  res.redirect('/') // root경로로 다시 보내주겠다.
})

////express로 서버만들기
app.listen(8080);
console.log('Server is listening on port 8080');