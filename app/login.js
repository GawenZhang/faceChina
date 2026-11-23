/* Independent local demonstration. No remote authentication is performed. */
(function () {
  'use strict';
  var form = document.getElementById('login-form');
  var fallback = document.getElementById('login-feedback');
  var messageTimer;

  function showMessage(message) {
    var layer = window.layer || (window.layui && window.layui.layer);
    if (layer) {
      layer.msg(message, { icon: 5, time: 2000, shift: 6 });
      return;
    }
    clearTimeout(messageTimer);
    fallback.textContent = message;
    fallback.hidden = false;
    messageTimer = setTimeout(function () { fallback.hidden = true; }, 2000);
  }

  function submitDemo(event) {
    event.preventDefault();
    if (!document.getElementById('agree_input').checked) {
      showMessage('请阅读并勾选用户协议');
      return;
    }
    if (document.getElementById('username').value !== 'demo' || document.getElementById('password').value !== 'demo123') {
      showMessage('演示账号或密码错误');
      return;
    }
    try {
      sessionStorage.setItem('geo-demo-session', 'active');
      if (document.getElementById('keeplogin').checked) {
        localStorage.setItem('geo-demo-remember', 'active');
      } else {
        localStorage.removeItem('geo-demo-remember');
      }
    } catch (error) {
      showMessage('无法保存演示登录状态，请允许浏览器本地存储');
      return;
    }
    window.location.assign('/user/index/index');
  }

  if (window.jQuery) {
    window.jQuery(form).on('submit', submitDemo);
  } else {
    form.addEventListener('submit', submitDemo);
  }
}());

