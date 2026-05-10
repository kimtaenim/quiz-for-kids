// quiz-for-kids — 탭 라우팅 + 한자 퀴즈 로직.

// ── 탭 라우팅 ──
function activateTab(name) {
  document.querySelectorAll('.tab-item').forEach(btn => {
    const on = btn.dataset.tab === name;
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  document.querySelectorAll('.view').forEach(v => {
    v.classList.toggle('active', v.id === 'view-' + name);
  });
}

document.querySelectorAll('.tab-item').forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn.dataset.tab));
});

// ── 한자 퀴즈 ──
const Hanja = (() => {
  const QUESTIONS_PER_ROUND = 10;
  const stage = document.getElementById('hanja-stage');
  const progressEl = document.getElementById('hanja-progress');
  const scoreEl = document.getElementById('hanja-score');

  let allItems = [];          // hanja.json 전체
  let currentLevel = '7';     // 7 | 6 | 5 | all
  let queue = [];             // 이번 라운드 출제 순서
  let index = 0;              // 현재 문제 인덱스
  let score = 0;
  let locked = false;         // 클릭 후 다음으로 넘어가는 동안 잠금

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function poolForLevel(level) {
    return level === 'all'
      ? allItems.slice()
      : allItems.filter(it => it.level === level);
  }

  function buildChoices(correct) {
    // 같은 레벨에서 오답 2개. 부족하면 전체 풀에서 보충.
    const samePool = allItems.filter(it => it.level === correct.level && it.char !== correct.char);
    const fallbackPool = allItems.filter(it => it.char !== correct.char);
    const pickFrom = samePool.length >= 2 ? samePool : fallbackPool;
    const wrongs = shuffle(pickFrom).slice(0, 2);
    return shuffle([correct, ...wrongs]);
  }

  function updateStatus() {
    const total = queue.length;
    const human = Math.min(index + 1, total);
    progressEl.textContent = total > 0 ? `${human} / ${total}` : '0 / 0';
    scoreEl.textContent = String(score);
  }

  function renderQuestion() {
    if (index >= queue.length) {
      renderResult();
      return;
    }
    const q = queue[index];
    const choices = buildChoices(q);
    locked = false;

    stage.innerHTML = '';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'hanja-image-wrap';
    const img = document.createElement('img');
    img.src = q.image;
    img.alt = q.meaning;
    imgWrap.appendChild(img);
    stage.appendChild(imgWrap);

    const choicesEl = document.createElement('div');
    choicesEl.className = 'hanja-choices';
    const labels = ['①', '②', '③'];
    choices.forEach((c, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hanja-choice';
      btn.dataset.char = c.char;
      btn.innerHTML = `
        <span class="hanja-choice-label">${labels[i]}</span>
        <span class="hanja-choice-text">${c.yum} / ${c.meaning}</span>
      `;
      btn.addEventListener('click', () => onChoiceClick(btn, c, q, choicesEl));
      choicesEl.appendChild(btn);
    });
    stage.appendChild(choicesEl);

    updateStatus();
  }

  function onChoiceClick(btn, picked, correct, choicesEl) {
    if (locked) return;
    locked = true;

    const allBtns = choicesEl.querySelectorAll('.hanja-choice');
    allBtns.forEach(b => { b.disabled = true; });

    const isCorrect = picked.char === correct.char;
    if (isCorrect) {
      btn.classList.add('correct');
      score += 1;
      scoreEl.textContent = String(score);
      setTimeout(advance, 800);
    } else {
      btn.classList.add('wrong');
      allBtns.forEach(b => {
        if (b.dataset.char === correct.char) b.classList.add('correct');
        else if (b !== btn) b.classList.add('dim');
      });
      setTimeout(advance, 1500);
    }
  }

  function advance() {
    index += 1;
    renderQuestion();
  }

  function renderResult() {
    const total = queue.length;
    stage.innerHTML = `
      <div class="hanja-result">
        <div class="hanja-result-title">잘 했어요!</div>
        <div class="hanja-result-score">
          ${score}<span class="hanja-result-total"> / ${total}</span>
        </div>
        <button class="hanja-restart-btn" type="button" id="hanja-restart">다시 시작</button>
      </div>
    `;
    document.getElementById('hanja-restart').addEventListener('click', startRound);
    progressEl.textContent = `${total} / ${total}`;
  }

  function startRound() {
    const pool = poolForLevel(currentLevel);
    if (pool.length === 0) {
      stage.innerHTML = `<div class="hanja-empty">이 급수에 등록된 한자가 아직 없어요.</div>`;
      queue = [];
      index = 0;
      score = 0;
      updateStatus();
      return;
    }
    score = 0;
    index = 0;
    queue = shuffle(pool).slice(0, Math.min(QUESTIONS_PER_ROUND, pool.length));
    renderQuestion();
  }

  function bindLevelChips() {
    document.querySelectorAll('.hanja-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.hanja-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentLevel = chip.dataset.level;
        startRound();
      });
    });
  }

  async function init() {
    bindLevelChips();
    try {
      const res = await fetch('data/hanja.json', { cache: 'no-cache' });
      allItems = await res.json();
    } catch (e) {
      stage.innerHTML = `<div class="hanja-empty">한자 데이터를 불러오지 못했어요.<br><small>${e.message}</small></div>`;
      return;
    }
    startRound();
  }

  return { init };
})();

// ── 부팅 ──
window.addEventListener('DOMContentLoaded', () => {
  MultiplicationQuiz.init();
  Hanja.init();
});
