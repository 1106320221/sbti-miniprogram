const Data = require('../../utils/data.js');

Page({
  data: {
    imageUrl: '',
    hasImage: false,
    imageLoaded: false,
    imageLoadError: false,
    typeName: '',
    typeDesc: '',
    matchCount: 0,
    dimList: []
  },

  onLoad() {
    let result = null;
    try {
      result = wx.getStorageSync('sbti_result');
    } catch (e) {
      console.error('Error reading result:', e);
    }

    if (!result || !result.type) {
      wx.showToast({
        title: '请先完成测试',
        icon: 'none'
      });
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/intro/intro'
        });
      }, 1500);
      return;
    }

    const imageUrl = Data.TYPE_IMAGES[result.type.code] || '';
    const hasImage = !!imageUrl;
    const typeName = result.type.cn || '未知人格';
    const typeDesc = result.type.desc || '';
    const matchCount = result.matchCount;

    const dimList = [];
    if (Data.dimensionMeta && result.dimensionExplanations) {
      for (const key in Data.dimensionMeta) {
        const level = result.pattern ? result.pattern.charAt(Data.dimensionOrder.indexOf(key)) : 'M';
        dimList.push({
          code: key,
          name: Data.dimensionMeta[key].name,
          level: level,
          desc: result.dimensionExplanations[key] || ''
        });
      }
    }

    this.setData({
      imageUrl,
      hasImage,
      typeName,
      typeDesc,
      matchCount,
      dimList
    });
  },

  onImageLoad() {
    this.setData({
      imageLoaded: true
    });
  },

  onImageError(e) {
    console.error('图片加载失败:', e);
    this.setData({
      imageLoadError: true
    });
  },

  restartTest() {
    try {
      wx.removeStorageSync('sbti_result');
      wx.removeStorageSync('sbti_pattern');
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
    wx.redirectTo({
      url: '/pages/intro/intro'
    });
  },

  onShareAppMessage() {
    const typeName = this.data.typeName || '未知人格';
    return {
      title: `我的三江口人格是「${typeName}」，快来测测你是谁！`,
      path: '/pages/intro/intro'
    };
  }
});
