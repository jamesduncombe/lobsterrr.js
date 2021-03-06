!function(a){function b(a){var b=["GET","POST","PUT","HEAD","DELETE","OPTIONS","TRACE","CONNECT"],c=["JSON","URLENCODED"],d=function(){var a=document.getElementsByName("csrf-token")[0];return"undefined"!==a&&null!=a?a.content:null},e=function(){};if(this.method=a.method||"GET",this.url=a.url,this.data=a.data||{},this.token=a.token||d(),this.onSuccess=a.onSuccess||e,this.onError=a.onError||e,this.onStart=a.onStart||e,this.onFinish=a.onFinish||e,this.onTimeout=a.onTimeout||e,this.timeout=a.timeout||0,this.type=a.type||"URLENCODED","undefined"==typeof a.url)throw"Ajax requires a url.";if(-1===b.indexOf(this.method))throw"Ajax method must be valid.";if(-1===c.indexOf(this.type))throw"Ajax content type must be valid.";return this}var c={JSON:"application/json",URLENCODED:"application/x-www-form-urlencoded"},d=function(a){return c[a.type]},e=function(a){var b=new XMLHttpRequest;return"withCredentials"in b?b.open(a.method,a.url,!0):"undefined"!=typeof XDomainRequest&&(b=new XDomainRequest,b.open(a.method,a.url)),b.timeout=a.timeout,b.setRequestHeader("Content-type",d(a)),a.token&&b.setRequestHeader("X-CSRF-Token",a.token),b},f=function(a,b){b.addEventListener("timeout",a.onTimeout(b),!1),a.onStart(b),b.addEventListener("readystatechange",function(){4===this.readyState&&(200===this.status?a.onSuccess(this):a.onError(this),a.onFinish(this))},!1)},g=function(a){if("JSON"===a.type)return JSON.stringify(a.data);var b=[];for(var c in a.data){var d=a.data[c];b.push(c+"="+encodeURIComponent(d))}return b.join("&")};b.request=function(a){return new this(a).send()},b.prototype.send=function(){return xhr=e(this),f(this,xhr),xhr.send(g(this)),this},"function"==typeof define&&define.amd?define("ajax",[],function(){return b}):a.Ajax=b}(this);

(function(window, Ajax) {
  "use strict";

  /**
   * @fileoverview Lobsterrr javascript interface to the lobsterrr api. Handles
    form submissions and stuff.
   * @version beta 1
   * @author Nathan, James
   */
  var baseURL, instances;
  instances = [];
  baseURL = 'http://api.lobsterrr.com';

  /**
   * Lobsterrr js object. Interacts with Lobsterrr api to submit your forms.
   * @class Lobsterrr
   * @constructor Lobsterrr
   * @param {object} form Form element being submitted to lobsterrr.
   * @param {object} args Configuration object. See Lobsterrr.init
   */
  return window.Lobsterrr = (function() {
    var appendTokenToForm, bindSubmitEvent, checkForm, createToken, createTokenEl, getParams, messageDone, messageError, messageStart, messageSuccess, networkError, tokenError;

    function Lobsterrr(form, args) {
      args = args || {};
      this.tokenError = args.tokenError || tokenError;
      this.messageError = args.messageError || messageError;
      this.messageSuccess = args.messageSuccess || messageSuccess;
      this.messageStart = args.messageStart || messageStart;
      this.messageDone = args.messageDone || messageDone;
      this.networkError = args.networkError || networkError;
      this.form = form;
      this.form.addEventListener('submit', this.createMessage, true);
      createToken(this);
    }

    Lobsterrr.prototype.createMessage = function(e) {
      var that;
      e.preventDefault();
      that = this;
      return Ajax.request({
        method: 'POST',
        url: "" + baseURL + "/messages",
        data: getParams(that.form),
        onSuccess: function(xhr) {
          return that.messageSuccess(that.form);
        },
        onError: function(xhr) {
          return that.messageError();
        },
        onStart: function() {
          return that.messageStart(that.form);
        },
        onFinish: function() {
          return that.messageDone(that.form);
        }
      });
    };

    getParams = function(form) {
      var element, params, _i, _len, _ref;
      params = {};
      _ref = form.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        params[element.name] = element.value;
      }
      return params;
    };

    createToken = function(that) {
      return Ajax.request({
        method: 'POST',
        url: "" + baseURL + "/tokens",
        onSuccess: function(xhr) {
          var token;
          token = JSON.parse(xhr.responseText).key;
          return appendTokenToForm(that.form, token);
        },
        onError: that.tokenError
      });
    };

    appendTokenToForm = function(form, token) {
      return form.insertBefore(createTokenEl(token), form.firstChild);
    };

    createTokenEl = function(token) {
      var el;
      el = document.createElement('input');
      el.type = 'hidden';
      el.value = token;
      el.name = el.id = 'security_token';
      return el;
    };

    bindSubmitEvent = function(form) {
      return form.addEventListener('submit', createMessage, true);
    };

    tokenError = function() {
      throw new Error('Lobsterrr failed to aquire token.');
    };

    messageError = function() {
      throw new Error('Lobsterrr failed to send message.');
    };

    messageSuccess = function(form) {};

    messageStart = function(form) {
      return form.classList.add('loading');
    };

    messageDone = function(form) {
      return form.classList.remove('loading');
    };

    networkError = function() {
      throw new Error('Lobsterrr cannot connect to api.');
    };


    /**
     * Initialize Lobsterrr for one or more html form elements.
    
     * @memberof Lobsterrr
    
     * @param {object} forms The form or array of html form elements you wish
      to handle with Lobsterrr
    
     * @param {object} [args] Configuration object
    
     * @param {function} [args.tokenError] Called when Lobsterrr js is unable to
      aquire an authenticity token. Is your url listed in your lobsterrr
       account?
    
     * @param {function} [args.messageError] Called when there is an error
      submitting your form to Lobsterrr api
    
     * @param {function} [args.messageSuccess] Called after successfuly
      submittoing your form to lobsterrr api
    
     * @param {function} [args.messageStart] Called at start of xmlhttp request
      used to submit your form to the lobsterr api.
    
     * @param {function} [args.messageDone] Called after message has been
      submitted weather successful or not.
    
     * @param {function} [args.networkError] Called when Lobsterrr js cannot
      connect to the lobsterrr api.
     */

    Lobsterrr.init = function(forms, args) {
      var form, _i, _len, _results;
      if (!forms) {
        throw new Error('Lobsterrr requires forms.');
      }
      if (forms instanceof Array) {
        _results = [];
        for (_i = 0, _len = forms.length; _i < _len; _i++) {
          form = forms[_i];
          checkForm(form);
          _results.push(instances.push(new this(form, args)));
        }
        return _results;
      } else {
        checkForm(forms);
        return instances.push(new this(forms, args));
      }
    };

    checkForm = function(el) {
      if (el.tagName !== 'FORM') {
        throw new Error('Lobsterrr requires valid forms.');
      }
    };

    return Lobsterrr;

  })();
})(window, Ajax);
