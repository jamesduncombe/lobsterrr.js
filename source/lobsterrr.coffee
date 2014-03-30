window['Ajax'] = {}
# TODO: ajax dependency

do(window, Ajax)->
  "use strict"

  ###*
   * @fileoverview Lobsterrr javascript interface to the lobsterrr api. Handles
    form submissions and stuff.
   * @version beta 1
   * @author Nathan, James
  ###

  instances = []
  baseURL = 'api.lobsterrr.com'

  ###*
   * Lobsterrr js object. Interacts with Lobsterrr api to submit your forms.
   * @class Lobsterrr
   * @constructor Lobsterrr
   * @param {object} form Form element being submitted to lobsterrr.
   * @param {object} args Configuration object. See Lobsterrr.init
  ###
  class window.Lobsterrr
    constructor: (form, args)->
      args = args || {}

      @tokenError = args.tokenError || tokenError
      @messageError = args.messageError || messageError
      @messageSuccess = args.messageSuccess || messageSuccess
      @messageStart = args.messageStart || messageStart
      @messageDone = args.messageDone || messageDone
      @networkError = args.networkError || networkError

      @form = form

      bindSubmitEvent(@form)
      createToken(@)

    createToken = (that)->
      Ajax.request
        method: 'POST',
        url: "#{baseURL}/tokens",
        onSuccess: (xhr)->
          token = JSON.parse(xhr.responseText).key
          appendTokenToForm(that.form, token)
        onError: that.tokenError

    appendTokenToForm = (form, token)->
      form.insertBefore(createTokenEl(token), form.firstChild)

    createTokenEl = (token)->
      el = document.createElement 'input'

      el.type = 'hidden'
      el.value = token
      el.name = el.id = 'security_token'

      el

    bindSubmitEvent = (form)->
      form.addEventListener 'submit', createMessage, true

    createMessage = ->

    tokenError = ->
      throw new Error 'Lobsterrr failed to aquire token.'

    messageError = ->
      throw new Error 'Lobsterrr failed to dend message.'

    messageSuccess = (form)->

    messageStart = (form)->
      form.classList.add 'loading'

    messageDone = (form)->
      form.classList.remove 'loading'

    networkError = ->
      throw new Error 'Lobsterrr cannot connect to api.'

    ###*
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
    ###

    @init: (forms, args)->
      unless forms
        throw new Error('Lobsterrr requires forms.')

      if forms instanceof Array
        for form in forms
          checkForm(form)
          instances.push new @(form, args)
      else
        checkForm(forms)
        instances.push new @(forms, args)

    checkForm = (el)->
      unless el.tagName is 'FORM'
        throw new Error 'Lobsterrr requires valid forms.'

