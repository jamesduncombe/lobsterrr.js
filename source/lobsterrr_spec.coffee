"use strict"

mockForm = ->
  document.createElement 'form'

mockArgs = ->
  {
    token: 'token'
  }

describe 'Lobsterrr', ->

  describe '@init', ->
    beforeEach ->
      sinon.spy(window, 'Lobsterrr')

    afterEach ->
      window.Lobsterrr.restore()

    it 'requires forms', ->
      fn = ->
        Lobsterrr.init(null, {})
      fn.should.throw('Lobsterrr requires forms.')

    describe 'single form', ->
      it 'creates instance for form', ->
        Lobsterrr.init(mockForm(), mockArgs())
        Lobsterrr.should.have.callCount(1)

    describe 'array of forms', ->
      it 'creates instance per form', ->
        Lobsterrr.init([mockForm(), mockForm()], mockArgs())
        Lobsterrr.should.have.callCount(2)

    it 'validates forms', ->
      fn = ->
        div = document.createElement 'div'
        Lobsterrr.init(div, mockArgs())

      fn.should.throw('Lobsterrr requires valid forms.')

  describe 'constructor', ->
    describe 'callbacks', ->
      it 'assigns default callbacks', ->
        l = new Lobsterrr(mockForm())

        l.tokenError.should.be.a('function')
        l.messageError.should.be.a('function')
        l.messageSuccess.should.be.a('function')
        l.messageStart.should.be.a('function')
        l.messageDone.should.be.a('function')
        l.networkError.should.be.a('function')

      it 'assigns custom callbacks', ->
        te = ()->
          alert('hi')

        l = new Lobsterrr(mockForm(), {tokenError: te})
        l.tokenError.should.eq te

    it 'assigns @form', ->
      f = mockForm()
      l = new Lobsterrr(f)
      l.form.should.eq f

    # it 'creates a token', ->
    #   f = mockForm()
    #   l = new Lobsterrr(f)
    #   f.firstChild.should.eq document.createElement('input')
    #
