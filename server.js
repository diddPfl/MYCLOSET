// 1. require() 함수로 express 모듈을 가져온다,
const express = require('express');

// 2. path 모듈을 가져온다. path 모듈은 파일의 경로를 처리하는데 사용된다.
const path = require('path');

// fs모듈 import : fs모듈은 파일 처리를 위한 모듈이다.
const fs = require('fs');

// 3. express 객체를 생성하여 app변수에 저장한다.
const app = express();

// 4. 웹 서버의 포트 번호를 지정한다.
const port = 3000;

// 5. 미들웨어 등록
app.use(express.json());

// 5-2 브라우저에서 form의 데이터를 전송하면 서버에서 urlencoded 형식으로 데이터를 받을 수 있도록 설정한다.
// form 태그에 데이터 입력하고 저장할 때 사용
// method 속성을 post로 설정하면 그 데이터가 메시지 통의 바디에 포함되어 전송된다.
// 그 데이터를 서버에서 편리하게 받기 위해서 설정하는 것이다.
app.use(express.urlencoded({ extended: true }));

// userData.josn 파일에 저장된 데이터를 읽어서 users 변수에 저장하기
// require() 함수 : node.js 제공하는 함수로 파일을 읽어서 자바스크립트 객체로 변환한다.
// 이 함수는 서버 측에서 실행되는 함수이다. 클라이언트 측에서는 사용할 수 없다.
let users = require('./public/userData.json'); // 유저데이터 읽어오기

// 6. 정적파일(정적자원) 처리
app.use(express.static(path.join(__dirname, 'public')));

// 7. 라우팅(페이지 이동) 설정
// 웹 브라우저에서 요청한 URL에 따라 적절한 처리를 하기 위해 라우팅을 설정한다.
// '/' : 웹브라우저에서 localhost:3000/으로 요청하면 이 함수가 처리한다.
// '/'는 루트 경로를 나타낸다. 즉, 루트에 있는 index.html 파일이 응답한다.
// req : 요청, request 객체 즉, 웹브라우저에서 요청한 정보를 담고 있다.
// res : 응답, response 객체 즉, 웹브라우저에서 응답할 정보를 담고 있다.
// 응답할 정보는 일반적으로 html 페이지가 응답으로 전송된다.
// get 방식은 쿼리스트링이 붙는 방식 ex) localhost:3000/index.html?id=123&password=1234
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
});

//1. 브라우저에서 post 방식으로 전송한 데이터를 추출한다.
// req.body는 브라우저에서 전송한 데이터 중에서 메세지 통의 바디에 포함된 데이터를 추출한다.
// req.body.id는 브라우저에서 전송한 id 데이터를 추출한다.
// req.body.pwd는 브라우저에서 전송한 pwd 데이터를 추출한다.
// req.body.id와 같이 추출할 수 있는 것은 위에서 설정한 
// app.use(exress.urlencoded({exptended: true})때문이다.)
// post 방식은 일반적으로 서버의 데이터에 조작을 가할 때(추가, 수정, 삭제) 사용된다.
app.post('/login', (req, res) => {
    const id = req.body.id; //id 데이터 추출
    const pwd = req.body.password; //password 데이터 추출

    // 2. 로그인 처리
    // 2.1 위에서 읽어온 users 데이터를 순회하면서 id와 password가 일치하는지 확인한다. 
    const user = users.find(user => user.id === id && user.password === pwd);

    if (user) { // 2.2 id와 pwd가 일치하면 로그인 성공 메세지를 띄우고 메인페이지로 이동
        res.send('<script>alert("로그인 성공!"); window.location.href = "/";</script>');
    } else { // 2.4 id와 pwd가 일치하지 않으면
        // 2.5 로그인 실패 메시지를 응답으로 전송한다.
        res.send('<script>alert("아이디 또는 비밀번호가 일치하지 않습니다."); window.history.back();</script>');
    }
});

// 회원가입 페이지 요청 처리
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// 회원 가입 처리 
// 사용자가 입력한 데이터는 req.body에 저장되어 있다.
app.post('/register', (req, res) => {
    //사용자가 입력한 데이터 추출
    const id = req.body.id; //id 추출
    const pwd = req.body.password; //password 추출
    const name = req.body.name;
    const tel = req.body.tel;
    const mailing = req.body.mailing;

    //기존 사용자 데이터와 중복되는지 확인
    // 사용자가 입력한 id가 기존 사용자 데이터 users에 있는지 확인한다.
    const isDuplicated = users.find(user => user.id === id);

    //중복된 아이디라면
    if (isDuplicated) {
        res.send('<script>alert("이미 존재하는 아이디입니다."); window.history.back();</script>');
    } else {
        // 사용자 자바스크립트 객체 생성(객체 리터럴 방식)
        const user = {id:id, password:pwd, name:name, tel:tel, mailing:mailing}; //저장할 유저 객체 한개 생성
        // 사용자 데이터를 users 배열에 추가
        users.push(user);
        // 사용자 데이터를 userData.json 파일에 저장
        // stringify() 함수는 자바스크립트 객체를 JSON문자열로 반환한다.
        // null은 replacer 함수로 사용할 함수를 지정한다. 2는 들여쓰기를 나타낸다.
        fs.writeFileSync('./public/userData.json', JSON.stringify(users, null, 2));
        // 회원가입 성공 메세지를 응답으로 전송
        res.send('<script>alert("회원가입 성공"); window.location.href="/login";</script>');
    }
});


// 8. 웹 서버 구동 (express() 함수로 생성되는 웹서버를 구동한다.)
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

