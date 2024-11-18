const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  else if ( num==3 ) luck = '吉';
  else if( num==4 ) luck = '小吉';
  else if( num==5 ) luck = '末吉';
  else if( num==6 ) luck = '大凶';

  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3  + 1);
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';

  let judgement = '';
  if (hand == cpu) {
    judgement = 'あいこ'; 
  } else if (
    (hand === 'グー' && cpu === 'チョキ') ||
    (hand === 'チョキ' && cpu === 'パー') ||
    (hand === 'パー' && cpu === 'グー')
  ) {
    judgement = '勝ち';
    win += 1;
  } else {
    judgement = '負け';
  }

  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});






app.get('/kazuate', (req, res) => {
  let guess = Number(req.query.guess); 
  let win = Number(req.query.win) || 0; 
  let total = Number(req.query.total) || 0; 
  const number = Math.floor(Math.random() * 10) + 1; 

  
  if (!guess) {
    return res.render('kazuate', { win, total, message: null });
  }

  
  let message = '';
  if (guess === number) {
    message = '正解です！';
    win += 1;
  } else {
    message = `残念！正解は ${number} でした。`;
  }

  total += 1;

  const display = {
    win: win,
    total: total,
    message: message
  };

  res.render('kazuate', display);
});

app.get("/keisan", (req, res) => {
  let num1 = Number(req.query.num1); 
  let num2 = Number(req.query.num2); 
  let operator = req.query.operator; 

  console.log({ num1, num2, operator }); 

  let result = ""; 

  
  if (operator === "+") {
    result = num1 + num2;
  } else if (operator === "-") {
    result = num1 - num2;
  } else if (operator === "*") {
    result = num1 * num2;
  } else if (operator === "/") {
    if (num2 !== 0) {
      result = num1 / num2;
    } else {
      result = "エラー: 0で割ることはできません";
    }
  } else {
    result = "エラー: 無効な演算子";
  }

  
  const display = {
    num1: num1,
    num2: num2,
    operator: operator,
    result: result,
  };

  res.render("keisan", display); 
});





app.listen(8080, () => console.log("Example app listening on port 8080!"));
