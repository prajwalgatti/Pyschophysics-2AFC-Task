/**
 * jspsych-call-function
 * plugin for calling an arbitrary function during a jspsych experiment
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins['custom-call-function'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'custom-call-function',
    description: '',
    parameters: {
        stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      func: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Function',
        default: undefined,
        description: 'Function to call'
      },
      async: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Asynchronous',
        default: false,
        description: 'Is the function call asynchronous?'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var new_html = '<div id="jspsych-html-keyboard-response-stimulus">'+trial.stimulus+'</div>';
    // draw
    display_element.innerHTML = new_html;

    trial.post_trial_gap = 0;
    var return_val;

    if(trial.async){
      var done = function(data){
        return_val = data;
        end_trial();    
      }
      trial.func(done);
    } else {
      return_val = trial.func();
      end_trial();
    }
    
    function end_trial(){
      var trial_data = {
        value: return_val
      };
      
      // clear the display
      display_element.innerHTML = '';
      
      jsPsych.finishTrial(trial_data);
    }
  };

  return plugin;
})();
