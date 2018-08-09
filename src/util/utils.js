const utils = {
  //缩放
  resize: function (width) {
      //this.$nextTick(function(){
      var clientWidth = parent.document.documentElement.clientWidth;
      var clientHeight = parent.document.documentElement.clientHeight;
      resize(clientWidth, clientHeight);
      window.addEventListener('resize', resize(clientWidth, clientHeight));

      function resize(docWidth, docHeight) {
          var docScale = docHeight / docWidth,
              designWidth = width,
              designHeight = 667,
              els = document.querySelectorAll('.content'),
              scale = docWidth / designWidth,
              scaleX = docWidth / designWidth,
              scaleY = docHeight / designHeight;
          convertArray(els).forEach(function (el) {
              extend(el.style, {
                  width: designWidth + 'px',
                  height: (docScale * designWidth) + 'px',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transformOrigin: '0 0',
                  webkitTransformOrigin: '0 0',
                  transform: 'scale(' + scale + ')',
                  webkitTransform: 'scale(' + scale + ')',
                  overflowX: 'hidden',
                  webkitOverflowScrolling: 'touch'
              });
          });
      }

      function convertArray(arrayLike) {
          return Array.prototype.slice.call(arrayLike, 0);
      }

      function extend() {
          var args = Array.prototype.slice.call(arguments, 0);
          return args.reduce(function (prev, now) {
              for (var key in now) {
                  if (now.hasOwnProperty && now.hasOwnProperty(key)) {
                      prev[key] = now[key];
                  }
              }
              return prev;
          });
      }
      //})
  },
  requestAnimFrame: function () {
      return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function (callback) {
              window.setTimeout(callback, 1000 / 60);
          };
  },
  /**
   * 获取当前的环境变量
   */
  getEnv: function () {
      return process.env.NODE_ENV || 'production';
  },
  /**
   *获取当前url后参数
   */
  getHashParams: function (name) {
      //console.log(name);
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      let hashStr = window.location.hash;
      if (window.location.hash.split('?')[1]) {
          let arr = window.location.hash.split('?')[1].split('&');
          let params = {};
          for (let i = 0, len = arr.length; i < len; i++) {
              let data = arr[i].split('=');
              if (data.length === 2) {
                  params[data[0]] = data[1]
              }
          }
          return params;
      }

  },

  getHashParam: function (key) {
      let p = utils.getHashParams();
      if (p) {
          return p[key];
      }
  },
  /**
   * 返回排序后的参数数组
   */
  transform: function (params) {
      let arr = [];
      for (let item in params) {
          //console.log(item);
          arr.push(item);
      }
      //console.log(arr.sort()+"======");
      return arr.sort();
  },
  /**
   * 计算sign值
   */
  setSign: function (params, secret_key) {
      let requestStr = '';
      const arr = utils.transform(params);

      for (let value in arr) {
          // if(!params[arr[value]]) {
          //     return;
          // }
          requestStr += params[arr[value]].toString()
      }

      requestStr += secret_key;
      //console.log('requestStr',requestStr)
      //console.log(md5.hex(requestStr).toLowerCase()+"----------------------------")
      return md5.hex(requestStr).toLowerCase();
  },
  throttle: function (fn, delay, mustRunDelay = 0) {
      let timer = null;
      let tStart;
      return function () {
          const context = this;
          const args = arguments;
          const tCurr = +new Date();
          clearTimeout(timer);
          if (!tStart) {
              tStart = tCurr;
          }
          if (mustRunDelay !== 0 && tCurr - tStart >= mustRunDelay) {
              fn.apply(context, args);
              tStart = tCurr;
          } else {
              timer = setTimeout(function () {
                  fn.apply(context, args);
              }, delay);
          }
      };
  },

  /**
   * 格式化时间
   * @param millisecond
   * return Array[days,hours,minutes];
   */
  formatTime: function (millisecond) {
      var days = Math.floor(millisecond / (1000 * 60 * 60 * 24)).toString();
      var hours = Math.floor((millisecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString();
      var minutes = Math.floor((millisecond % (1000 * 60 * 60)) / (1000 * 60)).toString();
      var seconds = (millisecond % (1000 * 60)) / 1000;
      if (days.length < 2) {
          days = '0' + days
      }
      if (hours.length < 2) {
          hours = '0' + hours
      }
      if (minutes.length < 2) {
          minutes = '0' + minutes
      }
      if (millisecond == 0) {
          return ['00', '00', '00', '00'];
      } else {
          return [days, hours, minutes, seconds];
      }
  },

  /**
   * 获取当前的token
   */
  getToken: function () {
      return window.getOfoToken() || '';
  },
  /**
   * 获取倒计时
   */
  getRestTime: function(endTime) {
      function checkTime(i) { //将0-9的数字前面加上0，例1变为01
          if (i < 10) {
              i = "0" + i;
          }
          return i;
      }
      if(endTime) {
          var nowTime = new Date();
          var endTime = new Date(endTime.replace(/-/g, '/'));
          var t = endTime.getTime() - nowTime.getTime();
          if (t >= 0) {
              return {
                  day: checkTime(Math.floor(t / 1000 / 60 / 60 / 24)),
                  hour: checkTime(Math.floor(t / 1000 / 60 / 60 % 24)),
                  minute: checkTime(Math.floor(t / 1000 / 60 % 60))
              }
          } else {
              return false;
          }
      }
  },
  /**
   * 统一rem
   */
  initFrontSize: function() {
      function getStyle (element, attr) {
      if(element.currentStyle){
          return element.currentStyle[attr];
      } else {
          return window.getComputedStyle(element,null)[attr];
      }
      };
      var html = document.getElementsByTagName('html')[0]
      var body = document.getElementsByTagName('body')[0];
      body.style.width = '5rem';
      var bodyWidth = parseInt(getStyle(body, 'width'));
      var width = screen.width;
      var scale = 1;
      var fontSize = parseInt(getStyle(html, "fontSize"));
      if(bodyWidth != width) {
      scale = width / bodyWidth;
      fontSize = fontSize * scale * scale;
      html.style.fontSize = fontSize + 'px';
      }
      body.style.width = '100%';
      return;
  },

  // 适应后端特殊字段(转换成前端需要的值)
  changeBackValue: function (data) {
      if (Array.isArray(data)) {
          data.forEach((v) => {
              utils.changeBackValue(v)
          })
      } else if (data && typeof data === 'object') {
          if (data.bankName) data.name = data.bankName;
          if (data.bankCode) data.value = data.bankCode;
          Object.keys(data).forEach(key => utils.changeBackValue(data[key]));
      }
      return data;
  },

  // 深拷贝
  deepCopy: function (obj) {
      if (typeof obj !== 'undefined') {
          return JSON.parse(JSON.stringify(obj))
      }
  },

  // 数组名称值互转
  getValue: function(arr, x) {
      let value;
      if (Array.isArray(arr)) {
        arr.forEach((i) => {
          if (i.value === x || i.name === x || i.value === `${x}`) {
            value = i.value === x ? i.name || i.value : i.value;
          }
        })
      }
      return value;
  },
  // 上传图片
  dataURItoBlob: function (dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString = atob(dataURI.split(',')[1]);
      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      var blob;
      try {
          blob = new Blob([ia.buffer], {
              type: mimeString
          });
      } catch (e) {
          var BlobBuilderCompat = window['BlobBuilder'] || window['WebKitBlobBuilder'] || window['MSBlobBuilder'];
          var bb = new BlobBuilderCompat();
          bb.append(ia.buffer);
          blob = bb.getBlob(mimeString);
      }
      return blob;
  },

  getOrientation: function (base64Str, callback) { // this is copied from http://stackoverflow.com/a/32490603
      var reader = new FileReader();
      reader.onload = function (e) {
          try {
              var view = new DataView(e.target.result);
              if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
              var length = view.byteLength,
                  offset = 2;
              while (offset < length) {
                  var marker = view.getUint16(offset, false);
                  offset += 2;
                  if (marker == 0xFFE1) {
                      if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
                      var little = view.getUint16(offset += 6, false) == 0x4949;
                      offset += view.getUint32(offset + 4, little);
                      var tags = view.getUint16(offset, little);
                      offset += 2;
                      for (var i = 0; i < tags; i++)
                          if (view.getUint16(offset + (i * 12), little) == 0x0112)
                              return callback(view.getUint16(offset + (i * 12) + 8, little));
                  } else if ((marker & 0xFF00) != 0xFF00) break;
                  else offset += view.getUint16(offset, false);
              }
          } catch (e) {}
          return callback(-1);
      };
      try {
          reader.readAsArrayBuffer(dataURItoBlob(base64Str));
      } catch (e) {
          callback(-1);
      }
  },

  /**
   * 获取URL后面的参数对象
   */
  getRequestParam: function(url) { 
      let params = {}; 
      if (url.indexOf("?") != -1) {  
         var arr = url.split('?')[1].split('&'); 
         for (let i = 0, len = arr.length; i < len; i++) {
              let data = arr[i].split('=');
              if (data.length === 2) {
                  params[data[0]] = data[1]
              }
          }
      }
      return params;
  }
};

export default utils;
