const Data = require('../../utils/data.js');
const Compute = require('../../utils/compute.js');

Page({
  data: {
    questions: [],
    specialQuestions: [],
    shuffledQuestions: [],
    visibleQuestions: [],
    answers: {},
    canSubmit: false,
    progressPercent: 0,
    answeredCount: 0,
    totalCount: 0,
    dimensionMeta: {}
  },

  onLoad() {
    const shuffled = Compute.shuffle([...Data.questions, Data.specialQuestions[0]]);
    const visible = Compute.getVisibleQuestions(shuffled, {}, Data.specialQuestions);

    this.setData({
      questions: Data.questions,
      specialQuestions: Data.specialQuestions,
      shuffledQuestions: shuffled,
      visibleQuestions: visible,
      dimensionMeta: Data.dimensionMeta,
      totalCount: visible.length
    });
  },

  onAnswerChange(e) {
    const qid = e.currentTarget.dataset.qid;
    const value = parseInt(e.detail.value);

    const newAnswers = { ...this.data.answers };
    newAnswers[qid] = value;

    const newVisible = Compute.getVisibleQuestions(this.data.shuffledQuestions, newAnswers, this.data.specialQuestions);

    let answeredCount = 0;
    for (const q of newVisible) {
      if (newAnswers[q.id]) answeredCount++;
    }

    const totalCount = newVisible.length;
    const canSubmit = answeredCount === totalCount;
    const progressPercent = Math.round((answeredCount / totalCount) * 100);

    this.setData({
      answers: newAnswers,
      visibleQuestions: newVisible,
      answeredCount,
      totalCount,
      canSubmit,
      progressPercent
    });
  },

  submitTest() {
    const result = Compute.computeResult(this.data.answers, Data);

    try {
      wx.setStorageSync('sbti_result', result);
      wx.setStorageSync('sbti_pattern', result.pattern);
    } catch (e) {
      console.error('Storage error:', e);
    }

    wx.redirectTo({
      url: '/pages/result/result'
    });
  }
});
