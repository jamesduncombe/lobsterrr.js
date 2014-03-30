(function() {
  "use strict";
  var mockArgs, mockForm;

  mockForm = function() {
    return document.createElement('form');
  };

  mockArgs = function() {
    return {
      token: 'token'
    };
  };

  describe('Lobsterrr', function() {
    describe('@init', function() {
      beforeEach(function() {
        return sinon.spy(window, 'Lobsterrr');
      });
      afterEach(function() {
        return window.Lobsterrr.restore();
      });
      it('requires forms', function() {
        var fn;
        fn = function() {
          return Lobsterrr.init(null, {});
        };
        return fn.should["throw"]('Lobsterrr requires forms.');
      });
      describe('single form', function() {
        return it('creates instance for form', function() {
          Lobsterrr.init(mockForm(), mockArgs());
          return Lobsterrr.should.have.callCount(1);
        });
      });
      describe('array of forms', function() {
        return it('creates instance per form', function() {
          Lobsterrr.init([mockForm(), mockForm()], mockArgs());
          return Lobsterrr.should.have.callCount(2);
        });
      });
      return it('validates forms', function() {
        var fn;
        fn = function() {
          var div;
          div = document.createElement('div');
          return Lobsterrr.init(div, mockArgs());
        };
        return fn.should["throw"]('Lobsterrr requires valid forms.');
      });
    });
    return describe('constructor', function() {
      describe('callbacks', function() {
        it('assigns default callbacks', function() {
          var l;
          l = new Lobsterrr(mockForm());
          l.tokenError.should.be.a('function');
          l.messageError.should.be.a('function');
          l.messageSuccess.should.be.a('function');
          l.messageStart.should.be.a('function');
          l.messageDone.should.be.a('function');
          return l.networkError.should.be.a('function');
        });
        return it('assigns custom callbacks', function() {
          var l, te;
          te = function() {
            return alert('hi');
          };
          l = new Lobsterrr(mockForm(), {
            tokenError: te
          });
          return l.tokenError.should.eq(te);
        });
      });
      return it('assigns @form', function() {
        var f, l;
        f = mockForm();
        l = new Lobsterrr(f);
        return l.form.should.eq(f);
      });
    });
  });

}).call(this);
