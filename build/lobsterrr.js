(function() {
  window['Ajax'] = {};

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
    baseURL = 'api.lobsterrr.com';

    /**
     * Lobsterrr js object. Interacts with Lobsterrr api to submit your forms.
     * @class Lobsterrr
     * @constructor Lobsterrr
     * @param {object} form Form element being submitted to lobsterrr.
     * @param {object} args Configuration object. See Lobsterrr.init
     */
    return window.Lobsterrr = (function() {
      var appendTokenToForm, bindSubmitEvent, checkForm, createMessage, createToken, createTokenEl, messageDone, messageError, messageStart, messageSuccess, networkError, tokenError;

      function Lobsterrr(form, args) {
        args = args || {};
        this.tokenError = args.tokenError || tokenError;
        this.messageError = args.messageError || messageError;
        this.messageSuccess = args.messageSuccess || messageSuccess;
        this.messageStart = args.messageStart || messageStart;
        this.messageDone = args.messageDone || messageDone;
        this.networkError = args.networkError || networkError;
        this.form = form;
        bindSubmitEvent(this.form);
        createToken(this);
      }

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

      createMessage = function() {};

      tokenError = function() {
        throw new Error('Lobsterrr failed to aquire token.');
      };

      messageError = function() {
        throw new Error('Lobsterrr failed to dend message.');
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

}).call(this);
