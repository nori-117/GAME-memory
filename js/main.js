'use strict';

const cardDesign = ['apple', 'cherry', 'grape', 'melon', 'peach', 'pineapple', 'strawberry', 'watermelon']; // カードのデザイン
const cardVolume = 16; // カードの総枚数

const cards = document.querySelectorAll('.card'); // カード表面
const cardBack = document.querySelectorAll('.card-back'); // カード裏面
const message = document.getElementById('message'); // メッセージ
const restartButton = document.getElementById('restart-button'); // リスタートボタン
const filter = document.getElementById('filter'); // 操作不可能にするためのフィルター
const scoreText = document.getElementById('score-text'); // スコア表示

// function cardSet()用
let cardLength; // カードの総枚数を代入する用
let randomNumber; // ランダムナンバー生成用
let splicedArray; // 配列cardListから数字を抜き出して作る新配列用
let splicedNumber; // 新配列splicedArrayを数字として取り出す用


// カードをめくるとき用
let select = 0;   // 選択枚数確認用
let selectedCard = [];   // 選択カード確認用
let pairCount = 0;   // そろったペア数確認用

// スコア計測用
let score = 1;


// 16枚のカードに、絵柄をランダムでセットする関数を定義
function cardSet() {

  // cardLengthにカードの総枚数をセット
  cardLength = cardVolume;

  // cardListに0～15の数字を格納（16個）
  const cardList = [];
  for (let i = 0; i < cardLength; i++) {
    cardList.push(i)
  }
    
  // 以下の処理を8回（絵柄の種類分）繰り返す
  for(let n = 0; n < 8; n++) {
    randomNumber = Math.floor(Math.random() * cardLength);   // 0～cardList配列の要素数、の中からランダムな整数生成
    splicedArray = cardList.splice(randomNumber, 1);   // cardList配列のrandomNumber番の数字を取り出す（配列として）
    splicedNumber = splicedArray[0];   // 配列の中から数字を取り出す
    cards[splicedNumber].firstElementChild.setAttribute('src', `images/${cardDesign[n]}.jpg`); // カードに絵柄をセット
    cardLength--; // cardList配列の要素数がマイナス1になる
    
    // 1つの絵柄は2枚あるので、もう一度同じ処理を行う
    randomNumber = Math.floor(Math.random() * cardLength);
    splicedArray = cardList.splice(randomNumber, 1);
    splicedNumber = splicedArray[0];
    cards[splicedNumber].firstElementChild.setAttribute('src', `images/${cardDesign[n]}.jpg`);
    cardLength--;
  }
}


// ☆ここからスタート
// ロード後にcardSe関数を実行
window.onload = cardSet();

// card-backクラスを持つ各カードに対してクリックイベントを付与
cardBack.forEach(function(value) {
  value.addEventListener('click', (e) => {

    // クリックされたカードがclearクラスを持っていたら（＝絵柄が揃って見えない状態の時）何もしない
    if(e.target.classList.contains('clear')) {
        return;
    }

    // クリックされたカードにopenクラスを付与
    value.classList.add('open');
    
    // 選択されたカードの絵柄をselectedCard配列に格納
    selectedCard.push(value.nextElementSibling.firstElementChild.getAttribute('src'));

    // 選択数をプラス1する
    select++;

    // 1枚目をめくった時
    if(select === 1) {
      scoreText.textContent = `${score}組目`; // 現在のスコア（組数）表示
      score++; // スコアをプラス1する
    }

    // 2枚目をめくった時
    if(select === 2) {

      // 一旦操作できないようにする
      filter.classList.add('block');

      // openクラスがついたカードをopenCardsに格納 
      let openCards = document.querySelectorAll('.open');

      // 選択された2枚のカードの絵柄が一致するとき以下の処理
      if(selectedCard[0] === selectedCard[1]) {

        // openクラスがついた各カードに以下の処理
        openCards.forEach(function(moge) {
          setTimeout(() => {
            moge.classList.add('clear'); // clearクラス付与
            filter.classList.remove('block'); // 操作可能に戻す
          },  500); // 0.5秒後に
        }); 

        // ペアカウントをプラス1する
        pairCount++;

        // ペアカウントがカードの総枚数の半分になったら（＝すべて揃ったら）
        if(pairCount === cardVolume/2) {
          setTimeout(() => {
            message.textContent = 'CLEAR!!'; // メッセージにCLEAR!!と表示
            scoreText.textContent = `${score-1}回でクリアしました！`; // スコアテキスト
            restartButton.classList.add('show'); // リスタートボタンを表示させる
          },  500);   // 0.5秒後に
        }
           
      // 選択された2枚のカードの絵柄が一致しないとき以下の処理
      } else {

        // openクラスがついた各カードに以下の処理
        openCards.forEach(function(moge) {
          setTimeout(() => {
              moge.classList.remove('open');   // openクラスを取り除く
              filter.classList.remove('block');   // 操作可能に戻す
          },  500);
        });
      }

      select = 0; // 選択数を0に戻す
      selectedCard = []; // selectedCardに格納されていた絵柄を初期化
    }
  });
});


// リスタートボタンがクリックされたとき、すべてリセットする
restartButton.addEventListener('click', () => {
  message.textContent = '';
  restartButton.classList.remove('show');
  pairCount = 0;
  
  cardBack.forEach(function(hoge) {
    hoge.classList.remove('open');
    hoge.classList.remove('clear');
  });

  scoreText.textContent = '　';
  score = 1;

  cardSet();
});