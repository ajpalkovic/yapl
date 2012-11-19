!function($) {
  error = {};

  var CompileError = klass(error, {}, {
    initialize: function Error(line, message) {
      this.line = line;
      this.message = message;
    },

    toString: function() {
      return this.constructor.name + '(' + this.line + '): ' + this.message;
    }
  });

  var ReferenceError = klass(error, CompileError, {
    initialize: function ReferenceError(line, reference) {
      CompileError.prototype.initialize.call(this, line, '"' + reference + '" is not defined');
    }
  });

  var NotInContextError = klass(error, CompileError, {
    initialize: function NotInContextError(line, reference, contextName) {
      CompileError.prototype.initialize.call(this, line,
        '"' + reference + '" is not defined in context "' + contextName + '"');
    }
  });

  var ShadowedReference = klass(error, CompileError, {
    initialize: function ShadowedReference(line, reference) {
      CompileError.prototype.initialize.call(this, line, '"' + reference + '" cannot shadow other references');
    }
  });

  var AutoSetParamError = klass(error, CompileError, {
    initialize: function AutoSetParamError(line, parameterName) {
      CompileError.prototype.initialize.call(this, line,
          'Auto-setting parameter "' + parameterName + '" used outside class context');
    }
  });

  var InvalidDefaultArgumentConfiguration = klass(error, CompileError, {
    initialize: function InvalidDefaultArgumentConfiguration(line, callableName) {
      CompileError.prototype.initialize.call(this, line,
          'Invalid default argument configuration for callable "' + callableName + '"');
    }
  });

  var MemberSetParamOnNonMethod = klass(error, CompileError, {
    initialize: function MemberSetParamOnNonMethod(line, paramName) {
      CompileError.prototype.initialize.call(this, line,
          'Member setting param "' + paramName + '" used in non-method context');
    }
  });

  var NoMemberToSet = klass(error, CompileError, {
    initialize: function NoMemberToSet(line, paramName) {
      CompileError.prototype.initialize.call(this, line,
          'No instance variable "' + paramName + '" to set');
    }
  });

  var NonStaticReference = klass(error, CompileError, {
    initialize: function NonStaticReference(line, reference) {
      CompileError.prototype.initialize.call(this, line,
          'Reference to non-static "' + reference + '" in static context');
    }
  });

  var InvalidAccessor = klass(error, CompileError, {
    initialize: function InvalidAccessor(line, reference) {
      CompileError.prototype.initialize.call(this, line,
          'Cannot create accessor for non-instance referece "' + reference + '"');
    }
  });
}(jQuery);