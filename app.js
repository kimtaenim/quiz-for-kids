// quiz-for-kids — 탭 라우팅 + 한자 무한 퀴즈.

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

// ── 한자 무한 퀴즈 ──
const Hanja = (() => {
  const FADE_MS = 300;
  const NEXT_DELAY_CORRECT = 600;
  const NEXT_DELAY_WRONG = 1200;

  const stage = document.getElementById('hanja-stage');
  const correctEl = document.getElementById('hanja-correct');
  const wrongEl = document.getElementById('hanja-wrong');

  let allItems = [];
  let currentLevel = '7';
  let lastChar = null;       // 직전 문제 한자 (연속 출제 방지)
  let correctCount = 0;
  let wrongCount = 0;
  let locked = false;

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

  function pickQuestion() {
    const pool = poolForLevel(currentLevel);
    if (pool.length === 0) return null;
    const candidates = pool.length > 1
      ? pool.filter(it => it.char !== lastChar)
      : pool;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function buildChoices(correct) {
    const samePool = allItems.filter(it => it.level === correct.level && it.char !== correct.char);
    const fallbackPool = allItems.filter(it => it.char !== correct.char);
    const pickFrom = samePool.length >= 2 ? samePool : fallbackPool;
    const wrongs = shuffle(pickFrom).slice(0, 2);
    return shuffle([correct, ...wrongs]);
  }

  function updateScore() {
    correctEl.textContent = String(correctCount);
    wrongEl.textContent = String(wrongCount);
  }

  function renderQuestion() {
    // 방어: 직전 문제의 정답 강조 / focus 잔상 제거
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
    stage.querySelectorAll('.hanja-choice').forEach(b => {
      b.classList.remove('correct', 'correct-reveal', 'wrong', 'dim');
      b.disabled = false;
    });

    const q = pickQuestion();
    if (!q) {
      stage.classList.remove('fading');
      stage.innerHTML = `<div class="hanja-empty">이 급수에 등록된 한자가 아직 없어요.</div>`;
      return;
    }
    lastChar = q.char;
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
      // 명시적 reset: 어떤 잔존 inline 스타일도 차단
      btn.style.borderColor = '';
      btn.style.background = '';
      btn.innerHTML = `
        <span class="hanja-choice-label">${labels[i]}</span>
        <span class="hanja-choice-text">${c.label || (c.hun + ' - ' + c.yum)}</span>
        <span class="hanja-choice-mark" aria-hidden="true">✓</span>
      `;
      btn.addEventListener('click', () => onChoiceClick(btn, c, q, choicesEl));
      choicesEl.appendChild(btn);
    });
    stage.appendChild(choicesEl);

    // fade-in
    requestAnimationFrame(() => stage.classList.remove('fading'));
  }

  function onChoiceClick(btn, picked, correct, choicesEl) {
    if (locked) return;
    locked = true;

    const allBtns = choicesEl.querySelectorAll('.hanja-choice');
    allBtns.forEach(b => { b.disabled = true; });

    const isCorrect = picked.char === correct.char;

    if (isCorrect) {
      btn.classList.add('correct');
      allBtns.forEach(b => { if (b !== btn) b.classList.add('dim'); });
      correctCount += 1;
      updateScore();
      scheduleAdvance(NEXT_DELAY_CORRECT);
    } else {
      btn.classList.add('wrong');
      allBtns.forEach(b => {
        if (b.dataset.char === correct.char) b.classList.add('correct-reveal');
        else if (b !== btn) b.classList.add('dim');
      });
      wrongCount += 1;
      updateScore();
      scheduleAdvance(NEXT_DELAY_WRONG);
    }
  }

  function scheduleAdvance(delay) {
    setTimeout(() => {
      stage.classList.add('fading');
      setTimeout(renderQuestion, FADE_MS);
    }, delay);
  }

  function restart() {
    lastChar = null;
    correctCount = 0;
    wrongCount = 0;
    updateScore();
    stage.classList.add('fading');
    setTimeout(renderQuestion, FADE_MS);
  }

  function bindLevelChips() {
    document.querySelectorAll('.hanja-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (chip.classList.contains('active')) return;
        document.querySelectorAll('.hanja-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentLevel = chip.dataset.level;
        // 급수 바꿔도 점수는 유지, 다음 문제만 갱신
        lastChar = null;
        stage.classList.add('fading');
        setTimeout(renderQuestion, FADE_MS);
      });
    });
  }

  function bindRestart() {
    const btn = document.getElementById('hanja-restart');
    if (btn) btn.addEventListener('click', () => restart());
  }

  async function init() {
    bindLevelChips();
    bindRestart();
    updateScore();
    try {
      const res = await fetch('data/hanja.json', { cache: 'no-cache' });
      allItems = await res.json();
    } catch (e) {
      stage.innerHTML = `<div class="hanja-empty">한자 데이터를 불러오지 못했어요.<br><small>${e.message}</small></div>`;
      return;
    }
    renderQuestion();
  }

  return { init };
})();

// ── 부팅 ──
window.addEventListener('DOMContentLoaded', () => {
  MultiplicationQuiz.init();
  Hanja.init();
});
