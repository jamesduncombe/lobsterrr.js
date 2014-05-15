(function() {
  "use strict";
  var mockArgs, mockForm;

  mockForm = function() {
    var form;
    form = document.createElement('form');
    form.innerHTML = "<input name=\"something\">\n<input type=\"submit\">";
    return form;
  };

  mockArgs = function() {
    return {
      token: 'token'
    };
  };

  describe('Lobsterrr', function() {
    beforeEach(function() {
      var requests;
      this.xhr = sinon.useFakeXMLHttpRequest();
      requests = this.requests = [];
      return this.xhr.onCreate = function(xhr) {
        return requests.push(xhr);
      };
    });
    afterEach(function() {
      return this.xhr.restore();
    });
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
    describe('constructor', function() {
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
      it('assigns @form', function() {
        var f, l;
        f = mockForm();
        l = new Lobsterrr(f);
        return l.form.should.eq(f);
      });
      it('creates a token', function() {
        var body, f, headers;
        f = document.getElementById('test-form');
        new Lobsterrr(f);
        headers = {
          'content-type': 'application/json'
        };
        body = '{"key": "key"}';
        this.requests[0].respond(200, headers, body);
        return f.firstChild.value.should.eq('key');
      });
      return it('binds submit event');
    });
    return describe('form submission', function() {
      return describe('#createMessage', function() {
        it('fires callbacks');
        return it('posts form fields to lte');
      });
    });
  });

}).call(this);
