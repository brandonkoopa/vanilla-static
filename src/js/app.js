(function() {

  window.addEventListener("load", function() {
    // add click handlers to all step buttons
    var nextButtons = document.getElementsByClassName('btn-next');

    [].forEach.call(nextButtons, function( btn ) {
      btn.addEventListener("click", btnBextHandler);
    });
  });

  var btnBextHandler = function btnBextHandler(e) {
    showStep(e.target.dataset.nextstepid);
  };

  var showStep = function showStep(stepId) {
    console.log('showStep(' + stepId + ')')
    hideAllSteps();
    document.getElementById(stepId).classList.add('step__active');
  }

  var hideAllSteps = function hideAllSteps() {
    var steps = document.getElementsByClassName('step');

    [].forEach.call(steps, function( step ) {
      step.classList.remove('step__active');
    });
  }

})();
