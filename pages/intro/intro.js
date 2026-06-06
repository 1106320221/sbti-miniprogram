Page({
  data: {},

  startTest() {
    wx.navigateTo({
      url: '/pages/test/test'
    });
  },

  onShareAppMessage() {
    return {
      title: '《低智商犯罪》SBTI 人格测试 - 测测你是三江口的谁',
      path: '/pages/intro/intro'
    };
  }
});
