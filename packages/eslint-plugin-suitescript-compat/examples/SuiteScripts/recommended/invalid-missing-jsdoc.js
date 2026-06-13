define([], function () {
  function beforeSubmit(context) {
    return context.type;
  }

  return {
    beforeSubmit: beforeSubmit
  };
});
