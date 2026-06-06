function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sumToLevel(sum) {
  if (sum <= 3) return 'L';
  if (sum >= 5) return 'H';
  return 'M';
}

function levelNum(level) {
  if (level === 'L') return 1;
  if (level === 'H') return 3;
  return 2;
}

function parsePattern(pattern) {
  return pattern.replace(/-/g, '');
}

function computeResult(answers, data) {
  const { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS, TYPE_LIBRARY, NORMAL_TYPES } = data;

  const result = {};
  const dimScores = {};
  let hasDrunkTrigger = false;

  dimensionOrder.forEach(dimKey => {
    dimScores[dimKey] = 0;
  });

  for (const qid in answers) {
    const val = answers[qid];
    if (qid === 'drink_gate_q2' && val === 2) {
      hasDrunkTrigger = true;
    }

    let matchedQ = null;
    if (data.questions) {
      matchedQ = data.questions.find(q => q.id === qid);
    }
    if (!matchedQ && data.specialQuestions) {
      matchedQ = data.specialQuestions.find(q => q.id === qid);
    }
    if (!matchedQ) continue;

    if (matchedQ.dim) {
      dimScores[matchedQ.dim] += val;
    }
  }

  if (hasDrunkTrigger && TYPE_LIBRARY['DRUNK']) {
    return {
      type: TYPE_LIBRARY['DRUNK'],
      dimensionExplanations: {},
      pattern: '',
      fullMatch: false,
      matchCount: 0,
      drunk: true
    };
  }

  let pattern = '';
  dimensionOrder.forEach(dimKey => {
    const level = sumToLevel(dimScores[dimKey]);
    result[dimKey] = level;
    pattern += level;
  });

  const dimExp = {};
  Object.keys(dimensionMeta).forEach(key => {
    dimExp[key] = DIM_EXPLANATIONS[key][result[key]];
  });

  let best = null;
  let bestMatch = -1;

  for (let i = 0; i < NORMAL_TYPES.length; i++) {
    const nt = NORMAL_TYPES[i];
    const candPattern = parsePattern(nt.pattern);
    let match = 0;
    for (let j = 0; j < Math.min(candPattern.length, pattern.length); j++) {
      if (candPattern[j] === pattern[j]) {
        match += 1;
      }
    }
    if (match > bestMatch) {
      bestMatch = match;
      best = nt;
    }
  }

  if (!best) {
    return {
      type: TYPE_LIBRARY['HHHH'],
      dimensionExplanations: dimExp,
      pattern,
      fullMatch: false,
      matchCount: 0
    };
  }

  const fullMatch = bestMatch === pattern.length;
  const type = TYPE_LIBRARY[best.code];

  return {
    type,
    dimensionExplanations: dimExp,
    pattern,
    fullMatch,
    matchCount: bestMatch
  };
}

function getVisibleQuestions(shuffledQuestions, answers, specialQuestions) {
  const visible = [...shuffledQuestions];

  const gateIndex = visible.findIndex(q => q.id === 'drink_gate_q1');
  if (gateIndex !== -1 && answers['drink_gate_q1'] === 3) {
    visible.splice(gateIndex + 1, 0, specialQuestions[1]);
  }

  return visible;
}

module.exports = {
  shuffle,
  sumToLevel,
  levelNum,
  parsePattern,
  computeResult,
  getVisibleQuestions
};
