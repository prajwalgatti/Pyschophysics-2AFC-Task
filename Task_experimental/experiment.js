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
const audio_files = ['audio_fb/correct.wav', 'audio_fb/incorrect.wav'];

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
    stimulus: 'Welcome to the experiment. Press any key to begin.',
    on_start: function(){$('body').css('cursor', 'none');}
};

function drawPieChart(){
    function getPath(angle, pie){
        var x, y, angle_in_rads;
        if(angle>180){
            console.log('Warning! Pie chart feedback angle greater than 180 deg.');
            angle = 180;
        }
        angle_in_rads = (90+angle) * Math.PI/180;
        y = pie.r * (1 - Math.sin(angle_in_rads));
        x = pie.r * Math.cos(angle_in_rads);
        return "m"+[pie.cx, pie.cy]+"v"+[-pie.r]+"a"+[pie.r,pie.r]+' 0 0,0 ' + [x,y] +'z' + 
            "m"+[pie.cx, pie.cy]+"v"+[-pie.r]+"a"+[pie.r,pie.r]+' 0 0,1 ' + [-x,y] +'z'; 
        }

    var pie = {cx:0, cy:0, r: 0.98};

    var s = Snap("#feedback-pie-chart");
    var disc = s.circle(pie.cx, pie.cy, pie.r);
    disc.attr({
        fill:'none',
        stroke:'#FFFFFF',
        style:'stroke-width: 0.02'
    });
    var sector = s.path(getPath(0, pie));
    sector.attr({
        fill:'#FFFFFF',
    });
    Snap.animate(30, 135, function(val){
            sector.attr({
                d: getPath(val, pie)
            });
    }, 1000);
}

var fixation_phase = {
    type: 'html-keyboard-response',
    stimulus: 
    '<svg xmlns="http://www.w3.org/2000/svg">' +
    '<circle class="fixation-point"/>' +
    '<circle class="reward-cue-left"/>'+
    '<circle class="reward-cue-right"/>'+
    '</svg>',
    choices: jsPsych.NO_KEYS,
    trial_duration: t_fixation,
    data : {test_part: 'fixation'}
};


var stimulus_and_cue_phase = {
    type: 'html-keyboard-response',
    stimulus: 
    '<svg xmlns="http://www.w3.org/2000/svg">' +
    '<circle class="fixation-point"/>' + 
    '<circle class="reward-cue-left"/>'+
    '<circle class="reward-cue-right"/>'+
    '<image class="left-stim" href="'+ stim[0] + '" style="transform:translate('+ (-stim_radius) +'px,'+ (-stim_radius) +'px)"/>' +
    '<image class="right-stim" href="'+ stim[1] + '" style="transform:translate('+ (-stim_radius) +'px,'+ (-stim_radius) +'px)"/>' +
    '</svg>',
    trial_duration: 2000,
    choices: jsPsych.NO_KEYS,
    data : {test_part: 'stimulus_and_cue'},
    on_finish: function(data){
        data.stimulus = '';
    }
};

var blank_phase = {
    type: 'html-keyboard-response',
    stimulus: 
    '<svg xmlns="http://www.w3.org/2000/svg">' +
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
    stimulus: 
    '<svg xmlns="http://www.w3.org/2000/svg">' +
    '<circle class="fixation-point"/>' + 
    '<circle class="reward-cue-left"/>'+
    '<circle class="reward-cue-right"/>'+
    '<image class="left-stim" href="'+ stim[2] + '" style="transform:translate('+ (-stim_radius) +'px,'+ (-stim_radius) +'px)"/>' +
    '<image class="right-stim" href="'+ stim[3] + '" style="transform:translate('+ (-stim_radius) +'px,'+ (-stim_radius) +'px)"/>' +
    '</svg>',
    trial_duration: t_change,
    choices: jsPsych.NO_KEYS,
    data : {test_part: 'Change'},
    on_finish: function(data){
        data.stimulus = '';
    }
};

var probe_and_response_phase = {
    type: 'html-keyboard-response',
    stimulus: 
    '<svg xmlns="http://www.w3.org/2000/svg">' +
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
    stimulus: 
    '<svg xmlns="http://www.w3.org/2000/svg">' +
    '<circle class="fixation-point"/>' +
    '<circle class="reward-cue-left"/>'+
    '<circle class="reward-cue-right"/>'+
    '</svg>',
    choices: jsPsych.NO_KEYS,
    trial_duration: function(){
        return jsPsych.randomization.sampleWithoutReplacement([200, 250, 300, 350, 400, 450, 500, 550, 600],1)[0];
    },
    data : {test_part: 'feedback'}
};

var new_feedback_phase = {
    type: 'audio-keyboard-response',
    stimulus: function(){
        return audio_files[0];
    },
    trial_duration: 10000,
    prompt: '<svg xmlns="http://www.w3.org/2000/svg">'+
    '<svg id="feedback-pie-chart" x="40%" y="40%" width="20%" height="20%" viewBox="-1 -1 2 2"></svg>' + 
    '<circle class="reward-cue-left"/>'+
    '<circle class="reward-cue-right"/>'+
    '</svg>'+
    '<p style="position:relative;z-index:1;">heylo</p>',
    on_load: function(){ 
        drawPieChart();
    }
};

expt_timeline = [];
expt_timeline.push(fullscr);
expt_timeline.push(welcome);
expt_timeline.push(fixation_phase);
expt_timeline.push(stimulus_and_cue_phase);
expt_timeline.push(blank_phase);
expt_timeline.push(stimulus_change_phase);
expt_timeline.push(probe_and_response_phase);
expt_timeline.push(new_feedback_phase);
expt_timeline.push(fixation_phase);
expt_timeline.push(stimulus_and_cue_phase);
expt_timeline.push(blank_phase);
expt_timeline.push(stimulus_change_phase);
expt_timeline.push(probe_and_response_phase);
expt_timeline.push(new_feedback_phase);