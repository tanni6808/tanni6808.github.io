"use strict";

const inputRank = document.querySelector(".form__input--rank");
const inputPrice = document.querySelector(".form__input--price");
const inputNum = document.querySelector(".form__input--num");
const inputPromote = document.querySelector(".form__input--promote");
const btnAddBook = document.querySelector(".btn--add-book");
const listBooks = document.querySelector(".books");
const listResults = document.querySelector(".results");
const btnCalc = document.querySelector(".btn--calc");
const btnReload = document.querySelector(".btn--reload");

let balance = 0;
let rankCashback = 0.01;
let id = 0;
const books = [];

// TODO change rankCashback
inputRank.addEventListener("change", function () {
  rankCashback = inputRank.value / 100;
  // console.log(rankCashback);
});

// TODO add book to books, print book
btnAddBook.addEventListener("click", function (e) {
  e.preventDefault();
  const price = +inputPrice.value;
  const num = +inputNum.value;
  const cashback =
    inputPromote.value == 0 ? rankCashback : inputPromote.value / 100;
  if (price <= 0 || num <= 0) return alert("請檢查是否有未輸入的項目");
  // console.log(inputPrice.value, inputNum.value);
  // TODO add book to books
  let book;
  for (let i = 0; i < num; i++) {
    id++;
    book = {
      id: id,
      price: price,
      cashbackRate: cashback,
      cashback: Math.floor(price * cashback),
    };
    books.push(book);
  }
  // sort books with cashback
  books.sort((a, b) => b.cashback - a.cashback);
  // clear field
  inputPrice.value = "";
  inputNum.value = "1";
  // TODO print book list
  let html = `<li class="book">
          <div class="book__details">
            單價：
            <span class="book__value">${price}</span>
            円
          </div>
          <div class="book__details">
            數量：
            <span class="book__value">${num}</span>
            本
          </div>
          <div class="book__details">
            回饋率：
            <span class="book__value">${cashback * 100}</span>
            %
          </div>
        </li>`;
  listBooks.insertAdjacentHTML("afterbegin", html);
  btnCalc.classList.remove("hidden");
});

// TODO calc & render
btnCalc.addEventListener("click", function (e) {
  e.preventDefault();
  const purchaseOrder = calcBookBuying(books);
  console.log(purchaseOrder);
  let html = "";
  let bookDetailsHtml = "";
  purchaseOrder.forEach((purchase, index) => {
    purchase.purchasedBooks.forEach(book => {
      bookDetailsHtml += `<div class="result__price">${book.price}円${
        book.cashbackRate * 100
      }%回饋率</div>`;
    });
    html = `<li class="result">
          第
          <span class="result__buy">${index + 1}</span>
          次購買
          <div class="result__detail">${bookDetailsHtml}</div>
          <div class="result__detail">回饋${purchase.cashbackEarned}</div>
        </li>`;
    listResults.insertAdjacentHTML("beforeend", html);
    bookDetailsHtml = "";
  });
});

// TODO reload page
btnReload.addEventListener("click", function () {
  window.location.reload();
});

const calcBookBuying = function (books) {
  // 把得到回饋金最少的那本暫時移除
  const tempBooks = books.slice(0, -1);
  console.log(tempBooks);
  // 最少還需要多花的錢 = 總花費 - 除最後一本以外書的回饋金加總
  const booksPriceSum = books.reduce((acc, book) => acc + book.price, 0);
  const booksCashbackSum = tempBooks.reduce(
    (acc, book) => acc + book.cashback,
    0
  );
  const requiredSpend = booksPriceSum - booksCashbackSum;

  // 第一次購買：找出滿足最少需要多花的錢的購買組合;
  // 若無法滿足，則直接買除去回饋金最少那本的組合
  const results = [];
  // 生成所有可能的組合
  const subsets = generateSubsets(tempBooks);
  subsets.forEach(subset => {
    const totalCost = subset.reduce((acc, book) => acc + book.price, 0);
    if (totalCost >= requiredSpend) {
      results.push({
        purchasedBooks: [...subset],
        spent: totalCost,
        cashbackEarned: subset.reduce((acc, book) => acc + book.cashback, 0),
      });
    }
  });
  results.sort((a, b) => a.spent - b.spent);
  if (!results[0]) {
    let purchaseOrder = [
      {
        purchasedBooks: tempBooks,
        spent: tempBooks.reduce((acc, book) => acc + book.price, 0),
        cashbackEarned: tempBooks.reduce((acc, book) => acc + book.cashback, 0),
      },
    ];
    let remainingBooks = books.filter(
      b => !purchaseOrder[0].purchasedBooks.includes(b)
    );
    console.log(remainingBooks);
    purchaseOrder.push({
      purchasedBooks: remainingBooks,
      spent: remainingBooks.reduce((acc, book) => acc + book.price, 0),
      cashbackEarned: remainingBooks.reduce(
        (acc, book) => acc + book.cashback,
        0
      ),
    });
    console.log(purchaseOrder);
    return purchaseOrder;
  }

  // 第二次之後的購買：每次都進行最接近但不超過現有儲值金的購買組合
  let firstBuy = null;
  let balance;
  let remainingBooks = [];
  for (let i = 0; i < results.length; i++) {
    firstBuy = results[i]; //take spent least & enough result
    balance = firstBuy.cashbackEarned;
    remainingBooks = books.filter(b => !firstBuy.purchasedBooks.includes(b));
    remainingBooks.sort((a, b) => b.price - a.price);
    if (balance < remainingBooks[0].price) continue;
    else break;
  }

  let purchaseOrder = [];

  while (remainingBooks.length > 0) {
    const subsets = generateSubsets(remainingBooks);

    // 篩選所有子集，找到最接近但不超過餘額的組合
    let bestSubset = null;
    let bestCost = 0;
    let bestCashback = 0;

    subsets.forEach(subset => {
      const totalCost = subset.reduce((acc, book) => acc + book.price, 0);
      const totalCashback = subset.reduce(
        (acc, book) => acc + book.cashback,
        0
      );

      if (totalCost <= balance && totalCashback > bestCashback) {
        bestSubset = subset;
        bestCost = totalCost;
        bestCashback = totalCashback;
      }
    });

    // 記錄本輪購買
    purchaseOrder.push({
      purchasedBooks: [...bestSubset],
      spent: bestCost,
      cashbackEarned: bestCashback,
    });

    // 更新餘額為新回饋金
    balance = balance - bestCost + bestCashback;

    // 移除已購買的書
    remainingBooks = remainingBooks.filter(b => !bestSubset.includes(b));
  }
  purchaseOrder.unshift(firstBuy);
  return purchaseOrder;
};

function generateSubsets(books) {
  const subsets = [];
  const n = books.length;

  for (let i = 0; i < 1 << n; i++) {
    const subset = [];
    for (let j = 0; j < n; j++) {
      if (i & (1 << j)) {
        subset.push(books[j]);
      }
    }
    subsets.push(subset);
  }
  return subsets;
}
