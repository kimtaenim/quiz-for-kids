// 구구단 — 원본 kimtaenim.github.io/multiplication.html 이식.
// 원본은 페이지 reload로 새 문제를 뽑았는데, SPA 구조라서 함수 호출로 교체.

(function () {
  const words = [
    ['2 x 1', 'assets/multiplication/2.jpeg', '2'],
    ['2 x 2', 'assets/multiplication/4.jpeg', '4'],
    ['2 x 3', 'assets/multiplication/6.jpeg', '6'],
    ['2 x 4', 'assets/multiplication/8.jpeg', '8'],
    ['2 x 5', 'assets/multiplication/10.jpeg', '10'],
    ['2 x 6', 'assets/multiplication/12.jpeg', '12'],
    ['2 x 7', 'assets/multiplication/14.jpeg', '14'],
    ['2 x 8', 'assets/multiplication/16.jpeg', '16'],
    ['2 x 9', 'assets/multiplication/18.jpeg', '18'],
    ['3 x 1', 'assets/multiplication/3.jpeg', '3'],
    ['3 x 2', 'assets/multiplication/6.jpeg', '6'],
    ['3 x 3', 'assets/multiplication/9.jpeg', '9'],
    ['3 x 4', 'assets/multiplication/12.jpeg', '12'],
    ['3 x 5', 'assets/multiplication/15.jpeg', '15'],
    ['3 x 6', 'assets/multiplication/18.jpeg', '18'],
    ['3 x 7', 'assets/multiplication/21.jpeg', '21'],
    ['3 x 8', 'assets/multiplication/24.jpeg', '24'],
    ['3 x 9', 'assets/multiplication/27.jpeg', '27'],
    ['4 x 1', 'assets/multiplication/4.jpeg', '4'],
    ['4 x 2', 'assets/multiplication/8.jpeg', '8'],
    ['4 x 3', 'assets/multiplication/12.jpeg', '12'],
    ['4 x 4', 'assets/multiplication/16.jpeg', '16'],
    ['4 x 5', 'assets/multiplication/20.jpeg', '20'],
    ['4 x 6', 'assets/multiplication/24.jpeg', '24'],
    ['4 x 7', 'assets/multiplication/28.jpeg', '28'],
    ['4 x 8', 'assets/multiplication/32.jpeg', '32'],
    ['4 x 9', 'assets/multiplication/36.jpeg', '36'],
    ['5 x 1', 'assets/multiplication/5.jpeg', '5'],
    ['5 x 2', 'assets/multiplication/10.jpeg', '10'],
    ['5 x 3', 'assets/multiplication/15.jpeg', '15'],
    ['5 x 4', 'assets/multiplication/20.jpeg', '20'],
    ['5 x 5', 'assets/multiplication/25.jpeg', '25'],
    ['5 x 6', 'assets/multiplication/30.jpeg', '30'],
    ['5 x 7', 'assets/multiplication/35.jpeg', '35'],
    ['5 x 8', 'assets/multiplication/40.jpeg', '40'],
    ['5 x 9', 'assets/multiplication/45.jpeg', '45'],
    ['6 x 1', 'assets/multiplication/6.jpeg', '6'],
    ['6 x 2', 'assets/multiplication/12.jpeg', '12'],
    ['6 x 3', 'assets/multiplication/18.jpeg', '18'],
    ['6 x 4', 'assets/multiplication/24.jpeg', '24'],
    ['6 x 5', 'assets/multiplication/30.jpeg', '30'],
    ['6 x 6', 'assets/multiplication/36.jpeg', '36'],
    ['6 x 7', 'assets/multiplication/42.jpeg', '42'],
    ['6 x 8', 'assets/multiplication/48.jpeg', '48'],
    ['6 x 9', 'assets/multiplication/54.jpeg', '54'],
    ['7 x 1', 'assets/multiplication/7.jpeg', '7'],
    ['7 x 2', 'assets/multiplication/14.jpeg', '14'],
    ['7 x 3', 'assets/multiplication/21.jpeg', '21'],
    ['7 x 4', 'assets/multiplication/28.jpeg', '28'],
    ['7 x 5', 'assets/multiplication/35.jpeg', '35'],
    ['7 x 6', 'assets/multiplication/42.jpeg', '42'],
    ['7 x 7', 'assets/multiplication/49.jpeg', '49'],
    ['7 x 8', 'assets/multiplication/56.jpeg', '56'],
    ['7 x 9', 'assets/multiplication/63.jpeg', '63'],
    ['8 x 1', 'assets/multiplication/8.jpeg', '8'],
    ['8 x 2', 'assets/multiplication/16.jpeg', '16'],
    ['8 x 3', 'assets/multiplication/24.jpeg', '24'],
    ['8 x 4', 'assets/multiplication/32.jpeg', '32'],
    ['8 x 5', 'assets/multiplication/40.jpeg', '40'],
    ['8 x 6', 'assets/multiplication/48.jpeg', '48'],
    ['8 x 7', 'assets/multiplication/56.jpeg', '56'],
    ['8 x 8', 'assets/multiplication/64.jpeg', '64'],
    ['8 x 9', 'assets/multiplication/72.jpeg', '72'],
    ['9 x 1', 'assets/multiplication/9.jpeg', '9'],
    ['9 x 2', 'assets/multiplication/18.jpeg', '18'],
    ['9 x 3', 'assets/multiplication/27.jpeg', '27'],
    ['9 x 4', 'assets/multiplication/36.jpeg', '36'],
    ['9 x 5', 'assets/multiplication/45.jpeg', '45'],
    ['9 x 6', 'assets/multiplication/54.jpeg', '54'],
    ['9 x 7', 'assets/multiplication/63.jpeg', '63'],
    ['9 x 8', 'assets/multiplication/72.jpeg', '72'],
    ['9 x 9', 'assets/multiplication/81.jpeg', '81']
  ];

  function choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function newQuestion() {
    const study = choice(words);
    document.getElementById('mult-quiz-text').textContent = study[0];
    const hint = document.getElementById('mult-hint');
    hint.src = study[1];
    document.getElementById('mult-answer').textContent = study[2];

    // fade-in 애니메이션 재시작
    const d1 = document.getElementById('mult-delay1');
    const d2 = document.getElementById('mult-delay2');
    [d1, d2].forEach(el => {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    });
  }

  window.MultiplicationQuiz = {
    init() {
      document.getElementById('mult-next-btn').addEventListener('click', newQuestion);
      document.getElementById('mult-delay1').addEventListener('click', newQuestion);
      newQuestion();
    },
    newQuestion
  };
})();
