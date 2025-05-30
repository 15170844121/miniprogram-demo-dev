import { worklet, supportWorklet } from '../../../common/worklet-api'
import { showTips } from '../../../common/tips'

const {
  shared, repeat, sequence, spring, timing, Easing, cancelAnimation
} = worklet

const app = getApp()
const windowWidth = app.globalData.windowWidth - 100
Page({
  data: {
    list: ['Basic Move', 'Timing Move', 'Spring Animation', 'Repeat Animation', 'Sequence Animation' // 'Decay Animation',
    ]
  },
  onLoad: function onLoad() {
    const _this = this

    if (this.renderer !== 'skyline' || !supportWorklet()) {
      showTips()
      return
    }
    const numsOfBox = this.data.list.length
    const sharedValueArr = []

    const _loop = function _loop(i) {
      const translate = shared(0)
      sharedValueArr.push(translate)

      _this.applyAnimatedStyle('.box'.concat(i), function () {
        'worklet'

        return {
          transform: 'translateX('.concat(translate.value, 'px)')
        }
      })
    }

    for (let i = 0; i < numsOfBox; i++) {
      _loop(i)
    }

    this.sharedValueArr = sharedValueArr
  },
  startAnimation: function startAnimation() {
    const toValue = this.toValue === windowWidth ? 0 : windowWidth
    this.didBasic(0, toValue)
    this.didTiming(1, toValue)
    this.didSpring(2, toValue)
    this.didRepeat(3, toValue)
    this.didSequence(4, toValue)

    this.toValue = toValue
  },
  cancelAnimation() {
    for (const sv of this.sharedValueArr) {
      cancelAnimation(sv)
    }
  },
  didBasic: function didBasic(idx, toValue) {
    this.sharedValueArr[idx].value = toValue
  },
  didTiming: function didTiming(idx, toValue) {
    this.sharedValueArr[idx].value = timing(toValue, {
      duration: 1500,
      easing: Easing.linear
    }, function () {
      'worklet'

      console.log('timing done')
    })
  },
  didSpring: function didSpring(idx, toValue) {
    this.sharedValueArr[idx].value = spring(toValue, {}, function () {
      'worklet'

      console.log('spring done')
    })
  },
  didRepeat: function didRepeat(idx, toValue) {
    this.sharedValueArr[idx].value = repeat(timing(toValue, {
      duration: 400
    }), 4, true, function () {
      'worklet'

      console.log('repeat done')
    })
  },
  didSequence: function didSequence(idx) {
    this.sharedValueArr[idx].value = sequence(timing(0, {
      duration: 50
    }), timing(300, {
      duration: 400
    }), timing(0, {
      duration: 400
    }), timing(300, {
      duration: 400
    }), timing(0, {
      duration: 50
    }))
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: 'worklet 动画',
      path: 'packageSkyline/pages/worklet/animation/index'
    }
  },

})
