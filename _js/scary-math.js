document.addEventListener('DOMContentLoaded', function() {
  var totalOutput = document.getElementById('output-minutes-total');
  var legsContainer = document.getElementById('legs');
  var addLegButton = document.getElementById('add-leg');
  var removeLegButton = document.getElementById('remove-leg');
  var legSubtotalOutputs = [];
  var inputValues = {
    global: {},
    perLeg: [],
  };
  var inputStructure = {
    global: {
      fields: [
        "calc-walking-optimizations",
      ],
      radios: [
        "calc-time-of-day",
      ],
    },
    perLeg: {
      fields: [
        "calc-estimate",
        "calc-periodicity",
        "calc-skippable-local-stops",
        "calc-eta-express",
        "calc-eta-local",
      ],
      radios: [
        "calc-mode",
        "calc-destination-express",
      ],
    },
  };

  var dtlTable = {
    "mode-t1":  {day: 0, night: 3},
    "mode-t2":  {day: 0, night: 5},
    "mode-t3":  {day: 3, night: 15},
    "mode-bus": {day: 5, night: 15},
    "mode-sbs": {day: 3, night: 5},
  };

  var rtlTable = {
    "mode-t1":  {day: 1, night: 0.75},
    "mode-t2":  {day: 0.75, night: 1},
    "mode-t3":  {day: 0.6, night: 0.75},
    "mode-bus": {day: 0.6, night: 0.5},
    "mode-sbs": {day: 0.75, night: 0.3},
  };

  function renderLeg(legIndex) {
    return (
      '<li class="leg">' +
          '<h4>Leg ' + (legIndex + 1) + '</h4>' +
          '<div class="form-control">' +
              '<label>Transit type</label>' +
              '<ul class="radio-options">' +
                  '<li class="radio-option">' +
                      '<input type="radio" checked name="calc-mode-leg' + legIndex + '" id="calc-mode-leg' + legIndex + '-t1" value="mode-t1">' +
                      '<label for="calc-mode-leg' + legIndex + '-t1">Tier 1</label>' +
                  '</li>' +
                  '<li class="radio-option">' +
                      '<input type="radio" name="calc-mode-leg' + legIndex + '" id="calc-mode-leg' + legIndex + '-t2" value="mode-t2">' +
                      '<label for="calc-mode-leg' + legIndex + '-t2">Tier 2</label>' +
                  '</li>' +
                  '<li class="radio-option">' +
                      '<input type="radio" name="calc-mode-leg' + legIndex + '" id="calc-mode-leg' + legIndex + '-t3" value="mode-t3">' +
                      '<label for="calc-mode-leg' + legIndex + '-t3">Tier 3</label>' +
                  '</li>' +
                  '<li class="radio-option">' +
                      '<input type="radio" name="calc-mode-leg' + legIndex + '" id="calc-mode-leg' + legIndex + '-bus" value="mode-bus">' +
                      '<label for="calc-mode-leg' + legIndex + '-bus">Bus</label>' +
                  '</li>' +
                  '<li class="radio-option">' +
                      '<input type="radio" name="calc-mode-leg' + legIndex + '" id="calc-mode-leg' + legIndex + '-sbs" value="mode-sbs">' +
                      '<label for="calc-mode-leg' + legIndex + '-sbs">SBS</label>' +
                  '</li>' +
              '</ul>' +
          '</div>' +
          '<div class="form-control">' +
              '<label>Is destination station an express stop?</label>' +
              '<ul class="radio-options">' +
                  '<li class="radio-option">' +
                      '<input type="radio" checked name="calc-destination-express-leg' + legIndex + '" id="calc-destination-express-leg' + legIndex + '-yes" value="1">' +
                      '<label for="calc-destination-express-leg' + legIndex + '-yes">Yes</label>' +
                  '</li>' +
                  '<li class="radio-option">' +
                      '<input type="radio" name="calc-destination-express-leg' + legIndex + '" id="calc-destination-express-leg' + legIndex + '-no" value="0">' +
                      '<label for="calc-destination-express-leg' + legIndex + '-no">No</label>' +
                  '</li>' +
              '</ul>' +
          '</div>' +
          '<div class="form-control">' +
              '<label for="calc-estimate-leg' + legIndex + '">Estimate from the app for this leg (min)</label>' +
              '<input type="number" min="1" max="100" value="20" id="calc-estimate-leg' + legIndex + '">' +
          '</div>' +
          '<div class="form-control">' +
              '<label for="calc-periodicity-leg' + legIndex + '">Time between each local train (min)</label>' +
              '<input type="number" min="1" max="60" value="7" id="calc-periodicity-leg' + legIndex + '">' +
          '</div>' +
          '<div class="form-control">' +
              '<label for="calc-skippable-local-stops-leg' + legIndex + '">Number of skippable local-only stops</label>' +
              '<input type="number" min="1" max="60" value="4" id="calc-skippable-local-stops-leg' + legIndex + '">' +
          '</div>' +
          '<div class="form-control">' +
              '<label for="calc-eta-express-leg' + legIndex + '">ETA of the express train (min)</label>' +
              '<input type="number" min="1" max="60" value="6" id="calc-eta-express-leg' + legIndex + '">' +
          '</div>' +
          '<div class="form-control">' +
              '<label for="calc-eta-local-leg' + legIndex + '">ETA of the local train (min)</label>' +
              '<input type="number" min="1" max="60" value="3" id="calc-eta-local-leg' + legIndex + '">' +
          '</div>' +
          '<div class="form-control output-container">' +
              '<label><strong>Total for Leg ' + (legIndex + 1) + '</strong></label>' +
              '<p><strong><span id="output-minutes-leg' + legIndex + '">0</span> minutes</strong></p>' +
          '</div>' +
      '</li>'
    );
  }

  function calculateAndUpdate() {
    var dayOrNight = inputValues.global["calc-time-of-day"];
    var ow = parseFloat(inputValues.global["calc-walking-optimizations"]);

    var legTotals = inputValues.perLeg.map(function(perLegValues, legIndex) {
      var el = parseFloat(perLegValues["calc-estimate-leg" + legIndex]);
      var pt = parseFloat(perLegValues["calc-periodicity-leg" + legIndex]);
      var sl = parseFloat(perLegValues["calc-skippable-local-stops-leg" + legIndex]);
      var wexp = parseFloat(perLegValues["calc-eta-express-leg" + legIndex]);
      var wloc = parseFloat(perLegValues["calc-eta-local-leg" + legIndex]);
      var xorigin = !! parseInt(perLegValues["calc-origin-express-leg" + legIndex]);
      var xdest = !! parseInt(perLegValues["calc-destination-express-leg" + legIndex]);
      var mode = perLegValues["calc-mode-leg" + legIndex];
      var dtl = dtlTable[mode][dayOrNight];
      var rtl = rtlTable[mode][dayOrNight];
      var est;
      if (xdest) {
        est = el + Math.min(wloc, wexp-6*Math.log(sl - 1));
      } else {
        est = el + wloc - Math.floor((6 * Math.log(sl - 1) - wexp)/pt)*pt;
      }
      return est/rtl + dtl;
    });

    for (var i = 0; i < legTotals.length; i++) {
      legSubtotalOutputs[i].innerHTML = legTotals[i].toFixed(1);
    }

    var sum = legTotals.reduce(function(total, num) { return total + num; }, 0);
    var adjustedTotal = sum - ow + 5 * (inputValues.perLeg.length - 1);
    totalOutput.innerHTML = adjustedTotal.toFixed(1);
  }

  function attachRadioListeners(fieldIds, valuesObj, legIndex) {
    fieldIds.forEach(function(baseGroupName) {
      var groupName = baseGroupName + ((legIndex === undefined) ? '' : '-leg' + legIndex);
      var radioInputs = document.getElementsByName(groupName);

      for (var i = 0; i < radioInputs.length; i++) {
        var radio = radioInputs[i];

        radio.addEventListener('change', function(e) {
          if (e.target.checked) {
            valuesObj[groupName] = e.target.value;
            calculateAndUpdate();
          }
        });

        if (radio.checked) {
          valuesObj[groupName] = radio.value;
        }
      }
    });
  }

  function attachFieldListeners(fieldIds, valuesObj, legIndex) {
    fieldIds.forEach(function(baseFieldId) {
      var fieldId = baseFieldId + ((legIndex === undefined) ? '' : '-leg' + legIndex);
      var field = document.getElementById(fieldId);

      field.addEventListener('change', function(e) {
        valuesObj[fieldId] = e.target.value;
        calculateAndUpdate();
      });

      valuesObj[fieldId] = field.value;
    });
  }

  function updateRemoveButtonState() {
    if (legsContainer.children.length <= 1) {
      removeLegButton.classList.add('hidden');
    } else {
      removeLegButton.classList.remove('hidden');
    }
  }

  function addLeg() {
    var legIndex = legsContainer.children.length;
    inputValues.perLeg.push({});
    legsContainer.innerHTML += renderLeg(legIndex);
    var legSubtotalOutput = document.getElementById('output-minutes-leg' + legIndex);
    legSubtotalOutputs.push(legSubtotalOutput);
    attachFieldListeners(inputStructure.perLeg.fields, inputValues.perLeg[legIndex], legIndex);
    attachRadioListeners(inputStructure.perLeg.radios, inputValues.perLeg[legIndex], legIndex);
    updateRemoveButtonState();
    calculateAndUpdate();
  }

  function removeLeg() {
    if (legsContainer.children.length <= 1) {
      return;
    }

    legsContainer.removeChild(legsContainer.lastChild);
    inputValues.perLeg.pop();
    legSubtotalOutputs.pop();
    updateRemoveButtonState();
    calculateAndUpdate();
  }

  attachFieldListeners(inputStructure.global.fields, inputValues.global);
  attachRadioListeners(inputStructure.global.radios, inputValues.global);
  addLegButton.addEventListener('click', addLeg);
  removeLegButton.addEventListener('click', removeLeg);
  addLeg();

  // Math toggling
  var mathBlocks = document.getElementsByClassName('scary-math');
  var hideAllButton = document.getElementsByClassName('hide-all')[0];

  function toggleAllMath() {
    hideAllButton.classList.toggle('math-hidden');
    for (var i = 0; i < mathBlocks.length; i++) {
      if (hideAllButton.classList.contains('math-hidden')) {
        mathBlocks[i].classList.add('hidden');
      } else {
        mathBlocks[i].classList.remove('hidden');
      }
    }
  }

  function setMaxHeights() {
    for (var i = 0; i < mathBlocks.length; i++) {
      var mathContent = mathBlocks[i].getElementsByClassName('math-content')[0];
      var mathContentInner = mathBlocks[i].getElementsByClassName('inner')[0];
      mathContent.style.maxHeight = mathContentInner.clientHeight + 'px';
    }
  }

  function toggleMath(math) {
    return function(e) {
      e.preventDefault();
      math.classList.toggle('hidden');
    };
  }

  setMaxHeights();
  setInterval(setMaxHeights, 1000);
  document.addEventListener('resize', setMaxHeights);
  document.addEventListener('orientationchange', setMaxHeights);
  hideAllButton.addEventListener('click', toggleAllMath);

  for (var i = 0; i < mathBlocks.length; i++) {
    var toggleButton = mathBlocks[i].getElementsByClassName('scary-math-toggle')[0];
    toggleButton.addEventListener('click', toggleMath(mathBlocks[i]));
  }

});
