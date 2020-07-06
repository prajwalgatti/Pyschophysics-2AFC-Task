/******************************/
/* Helper Functions*/
/******************************/

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function get_stim(size) {
    var contrast = 100.0;
    var spatial_freq = 50;
    var init_angles = [rand(15,85), rand(15,85)];
    var changed_angles = [init_angles[0]+25, init_angles[1]+25]
    var motif = jsPsych.randomization.sampleWithoutReplacement([[0,0], [0,1], [1,0], [1,1]],1)[0];
    imgStrings = [gaborgen(init_angles[0], spatial_freq, contrast, size), gaborgen(init_angles[1], spatial_freq, contrast, size), gaborgen(changed_angles[0], spatial_freq, contrast, size), gaborgen(changed_angles[1], spatial_freq, contrast, size), motif];
    if (motif[0] == 0){
        imgStrings[2] = imgStrings[0];
    }
    if(motif[1] == 0){
        imgStrings[3] = imgStrings[1];
    }
    return imgStrings;
};

function generatestimulus(size){
    console.time("genstim");
    var contrast = 0;
    var spatial_freq = 50;
    var init_angles = [rand(15,85), rand(15,85)];
    var changed_angles = [init_angles[0]+25, init_angles[1]+25]
    var stims = [gaborgen(init_angles[0], spatial_freq, contrast, size), gaborgen(init_angles[1], spatial_freq, contrast, size), gaborgen(changed_angles[0], spatial_freq, contrast, size), gaborgen(changed_angles[1], spatial_freq, contrast, size), motif];
    console.timeEnd("genstim");
    return stims
}

var x = 2;
window_h = window.screen.height;
window_w = window.screen.width;
var stim_size = (500*window_w)/1920;
var stim_radius = stim_size/2;
var stim = get_stim(stim_size);
motif = stim[4];
cx = window_w/2;
cy = window_h/2;
probe_height = (25*window_w)/1920;
probe_width  = (10*window_h)/1080;
right_probe_path = ''+(cx+2)+','+(cy+probe_width)+' '+ (cx+2+2*probe_height)+','+(cy)+' '+(cx+2)+','+(cy-probe_width)+'';
left_probe_path = ''+(cx-2)+','+(cy+probe_width)+' '+ (cx-2-2*probe_height)+','+(cy)+' '+(cx-2)+','+(cy-probe_width)+'';
console.log(right_probe_path);
console.log(left_probe_path);

function rand_probe() {
    return jsPsych.randomization.sampleWithoutReplacement([['probe-empty','probe-fill'], ['probe-fill','probe-empty']],1)[0];
};

probe_order = rand_probe();

var fullscr = {
    type:'fullscreen',
    fullscreen_mode: true
};

var welcome = {
    type: 'html-keyboard-response',
    stimulus: 'Welcome to the experiment. Press any key to begin.'
};

var fixation_phase = {
    type: 'html-keyboard-response',
    stimulus: 
    '<svg>' +
    '<circle class="fixation-point"/>' +
    '<circle class="reward-cue-left"/>'+
    '<circle class="reward-cue-right" style="fill: #ff0000;"/>'+
    '</svg>',
    choices: jsPsych.NO_KEYS,
    trial_duration: t_fixation,
    data : {test_part: 'fixation'}
};


var stimulus_and_cue_phase = {
    type: 'html-keyboard-response',
    stimulus: 
    '<svg>' +
    '<circle class="fixation-point"/>' + 
    '<circle class="reward-cue-left"/>'+
    '<circle class="reward-cue-right"/>'+
    '<image class="left-stim" href="'+ stim[0] + '" style="transform:translate('+ (-stim_radius) +'px,'+ (-stim_radius) +'px)"/>' +
    '<image class="right-stim" href="'+ stim[1] + '" style="transform:translate('+ (-stim_radius) +'px,'+ (-stim_radius) +'px)"/>' +
    '</svg>',
    trial_duration: t_stimulus*1000,
    choices: jsPsych.NO_KEYS,
    data : {test_part: 'stimulus_and_cue'}
};

var blank_phase = {
    type: 'html-keyboard-response',
    stimulus: 
    '<svg>' +
    '<circle class="fixation-point"/>' +
    '<circle class="reward-cue-left"/>'+
    '<circle class="reward-cue-right"/>'+
    '</svg>',
    choices: jsPsych.NO_KEYS,
    trial_duration: t_blank,
    data : {test_part: 'blank'}
};

var stimulus_change_phase = {
    type: 'html-keyboard-response',
    stimulus: function(){
            return '<svg>' +
            '<circle class="fixation-point"/>' + 
            '<circle class="reward-cue-left"/>'+
            '<circle class="reward-cue-right"/>'+
            '<image class="left-stim" href="'+ stim[2] + '" style="transform:translate('+ (-stim_radius) +'px,'+ (-stim_radius) +'px)"/>' +
            '<image class="right-stim" href="'+ stim[3] + '" style="transform:translate('+ (-stim_radius) +'px,'+ (-stim_radius) +'px)"/>' +
            '</svg>';}, 
    trial_duration: t_change,
    choices: jsPsych.NO_KEYS,
    data : {test_part: 'Change'}
};

var probe_and_response_phase = {
    type: 'html-keyboard-response',
    stimulus: 
    '<svg>' +
    '<polygon class="'+ probe_order[0] +'" points= "'+ left_probe_path +'"/>'+
    '<polygon class="'+ probe_order[1] +'" points= "'+ right_probe_path +'"/>'+
    '<circle class="fixation-point"/>' +
    '<circle class="reward-cue-left"/>'+
    '<circle class="reward-cue-right"/>'+
    '</svg>',
    trial_duration: t_response,
    choices: ['a','s','d','f'],
    data : {test_part: 'Probe_and_response'}
};

var feedback_phase = {
    type: 'html-keyboard-response',
    stimulus: '<svg id="svg">' +
            '<circle class="fixation-point"/>' +
            '<circle class="reward-cue-left"/>'+
            '<circle class="reward-cue-right"/>'+
            '</svg>',
    // on_load: function(){ 
    //         var s = Snap("#svg");
    //         var circle = s.circle(0,0,80);
    //         circle.attr({cy:"50%"});
    //         circle.animate({r:30}, 1000);
    // },
    choices: jsPsych.NO_KEYS,
    trial_duration: 200,
    data : {test_part: 'feedback'}
};

// var inter_trial_break = {
//     type: 'html-keyboard-response',
//     stimulus: 
//     '<svg xmlns="http://www.w3.org/2000/svg">' +
//     // '<circle class="fixation-point"/>' +
//     '<circle class="reward-cue-left"/>'+
//     '<circle class="reward-cue-right"/>'+
//     '</svg>',
//     choices: jsPsych.NO_KEYS,
//     trial_duration: 2000,
//     on_load: function(){
//         stim = generatestimulus(stim_size);
//     }
// };

var inter_trial_break = {
    type: 'call-function',
    func: function(done){
        setTimeout(done, 2000); // end the ITI after 2000ms
        stim = generatestimulus(stim_size);
        x = x+1;
    },
    async: true
}

expt_timeline = [];
expt_timeline.push(fullscr);
expt_timeline.push(welcome);
expt_timeline.push(fixation_phase);
expt_timeline.push(stimulus_and_cue_phase);
expt_timeline.push(blank_phase);
expt_timeline.push(stimulus_change_phase);
expt_timeline.push(probe_and_response_phase);
expt_timeline.push(feedback_phase);
expt_timeline.push(inter_trial_break);
expt_timeline.push(fixation_phase);
expt_timeline.push(stimulus_and_cue_phase);
expt_timeline.push(blank_phase);
expt_timeline.push(stimulus_change_phase);
expt_timeline.push(probe_and_response_phase);
expt_timeline.push(feedback_phase);