/* Script to define the experiment timeline */

/******************************/
/* Experiment functions */
/******************************/

function generateGaborStimulus(block_num, trial_num, size) {
	if(block_num > numblocks || trial_num > numtrials){
		console.log("Error: block_num or trial_num exceeds set limit");
		return undefined;
	}
	var contrast = 100.0;
	var spatial_freq = 25.0;
	var initial_angles = [block_info[block_num][1].Alpha_L[trial_num],
						  block_info[block_num][1].Alpha_R[trial_num]];
	var change_angles = [block_info[block_num][1].Delta_L[trial_num],
						 block_info[block_num][1].Delta_R[trial_num]];
	var stim_arr = [gaborgen(initial_angles[0], spatial_freq, contrast, size), 
					gaborgen(initial_angles[1], spatial_freq, contrast, size)];
	(change_angles[0] != 0) ? stim_arr.push(gaborgen(initial_angles[0]+change_angles[0], spatial_freq, contrast, size)) : stim_arr.push(0);
	(change_angles[1] != 0) ? stim_arr.push(gaborgen(initial_angles[1]+change_angles[1], spatial_freq, contrast, size)) : stim_arr.push(0);
	return stim_arr;
}

function drawStimuli(stim, gabor_posn_left, gabor_posn_right){
	var canvas, context;
	canvas = document.getElementById('stimulusCanvas');
	context = canvas.getContext('2d');
	context.drawImage(stim[0], x=gabor_posn_left[0], y=gabor_posn_left[1]);
	context.drawImage(stim[1], x=gabor_posn_right[0], y=gabor_posn_right[1]);
};

function drawStimuliChange(stim, gabor_posn_left, gabor_posn_right){
	var canvas, context;
	canvas = document.getElementById('stimChangeCanvas');
	context = canvas.getContext('2d');
	(stim[2] != 0) ? context.drawImage(stim[2], x=gabor_posn_left[0], y=gabor_posn_left[1]) :
		context.drawImage(stim[0], x=gabor_posn_left[0], y=gabor_posn_left[1]);
	(stim[3] != 0) ? context.drawImage(stim[3], x=gabor_posn_right[0], y=gabor_posn_right[1]) :
		context.drawImage(stim[1], x=gabor_posn_right[0], y=gabor_posn_right[1]);
};

function getstim_probe(){
	var probe = block_info[block_num][0].Probe[trial_num];
	var right_probe_path = ''+(cx+2)+','+(cy+probe_width)+' '+ (cx+2+2*probe_height)+','+(cy)+' '+(cx+2)+','+(cy-probe_width)+'';
	var left_probe_path = ''+(cx-2)+','+(cy+probe_width)+' '+ (cx-2-2*probe_height)+','+(cy)+' '+(cx-2)+','+(cy-probe_width)+'';
	if(probe == -1){
		return '<polygon class="probe-fill"  points= "'+ left_probe_path +'"/><polygon class="probe-empty" points= "'+ right_probe_path +'"/>'; 
	}
	else if(probe == 1){
		return '<polygon class="probe-empty" points= "'+ left_probe_path +'"/><polygon class="probe-fill"  points= "'+ right_probe_path +'"/>';
	}
};

/******************************/
/* Variables */
/******************************/

var experiment_timeline = [];
var bock_idx, trial_idx;
var block_num=0, trial_num=0;
const ResponseCode = {
	no_change_key: 73, /* 73: i/I */
	change_key: 77 /* 77: m/M*/
};

var window_h = window.screen.height;
var window_w = window.screen.width;
var stim_size = (500*window_w)/1920;
var stim_radius = stim_size/2;
var cx = window_w/2;
var cy = window_h/2;
var probe_height = (25*window_w)/1920;
var probe_width  = (20*window_h)/1080;
var gabor_posn_left = [window_w/2-window_w*350/1920-stim_radius, window_h/2-stim_radius];
var gabor_posn_right = [window_w/2+window_w*350/1920-stim_radius, window_h/2-stim_radius];
//generate first trial's stimuli
var stim = generateGaborStimulus(block_num, trial_num, stim_size);

/* Init experiment variables*/
var score_arr = [];
var score = {
	trial: 0,
	total: 0,
	gi: 0,
	li: 0,
	gf: 0,
	la: 0,
	net: 0,
	netgi: 0,
	netla: 0
};
var feedback_text, Resp;

/******************************/
/* Experiment Phases/Nodes */
/******************************/

var fullscr = {
    type:'fullscreen',
    fullscreen_mode: true
};

var welcome = {
    type: 'html-keyboard-response',
    stimulus: 'Welcome to the experiment. Press any key to begin.',
    data: {test_part: 'Welcome'},
    on_start: function() {$('body').css('cursor', 'none');}
};

var begin_block = {
	type: 'html-keyboard-response',
	stimulus: 'Press any key to begin block.',
	trial_duration: wait_forblock,
	post_trial_gap: t_startblockin,
    data: {test_part: 'Begin_block'}
};

var mid_block_break = {
	type: 'html-keyboard-response',
	stimulus: 'BREAK. Maintain position. Press any key to skip.',
	trial_duration: t_resumeblockin,
    data: {test_part: 'Mid_block_break'}
};

var inter_block_break = {
	type:'html-keyboard-response',
	stimulus: 'Next block starts soon.',
	trial_duration: t_interblockbreak,
	choices: jsPsych.NO_KEYS,
    data: {test_part: 'Inter_block_break'},
	on_finish: function(){
		score_arr.push(score);
		score = {trial: 0, total: 0, gi: 0, li: 0, gf: 0,
			la: 0, net: 0, netgi: 0, netla: 0};
	}
};

var inter_trial_break = {
	type: 'custom-call-function',
	stimulus: function(){
    	return '<svg>' +
			    '<circle class="reward-cue-left"  style="fill:'+rewardcolors[block_num][0]+';"/>'+
			    '<circle class="reward-cue-right" style="fill:'+rewardcolors[block_num][1]+';"/>'+
    			'</svg>';
    		},
    async: true,
    data: {test_part: 'Inter_trial_break'},
    func: function(done){
        setTimeout(done, t_intertrialbreak);
		stim.length = 0;
		stim = generateGaborStimulus(block_num, trial_num, stim_size);
    }
};

var fixation_phase = {
    type: 'html-keyboard-response',
    stimulus: function() {
    	return '<svg><circle class="fixation-point"/>' +
			    '<circle class="reward-cue-left"  style="fill:'+rewardcolors[block_num][0]+';"/>'+
			    '<circle class="reward-cue-right" style="fill:'+rewardcolors[block_num][1]+';"/>'+
    			'</svg>';
    },
    choices: jsPsych.NO_KEYS,
    trial_duration: t_fixation,
    data : {test_part: 'fixation'}
};

var stimulus_and_cue_phase = {
    type: 'html-keyboard-response',
    stimulus: function(){
    	return	'<canvas id="stimulusCanvas" width="'+ window_w +'" height="'+ window_h +'"></canvas>' +
    			'<svg>' +
    			'<circle class="fixation-point"/>' + 
			    '<circle class="reward-cue-left"  style="fill:'+rewardcolors[block_num][0]+';"/>'+
			    '<circle class="reward-cue-right" style="fill:'+rewardcolors[block_num][1]+';"/>'+
    			'</svg>';
    },
    trial_duration: function(){
    	return block_info[block_num][0].TimeCueStim[trial_num];
    },
    choices: jsPsych.NO_KEYS,
    data : {test_part: 'stimulus_and_cue'},
    on_load: function(){
    	drawStimuli(stim, gabor_posn_left, gabor_posn_right);
    },
    on_finish: function(data){
    	data.stimulus = '';
    }
};

var blank_phase = {
    type: 'html-keyboard-response',
    stimulus: function(){
    	return	'<svg>' +
			    '<circle class="fixation-point"/>' +
			    '<circle class="reward-cue-left"  style="fill:'+rewardcolors[block_num][0]+';"/>'+
			    '<circle class="reward-cue-right" style="fill:'+rewardcolors[block_num][1]+';"/>'+
			    '</svg>';
    },
    choices: jsPsych.NO_KEYS,
    trial_duration: t_blank,
    data : {test_part: 'blank'}
};

var stimulus_change_phase = {
    type: 'html-keyboard-response',
    stimulus: function(){
    	return 	'<canvas id="stimChangeCanvas" width="'+ window_w +'" height="'+ window_h +'"></canvas>' +
    			'<svg>' +
			    '<circle class="fixation-point"/>' + 
			    '<circle class="reward-cue-left"  style="fill:'+rewardcolors[block_num][0]+';"/>'+
			    '<circle class="reward-cue-right" style="fill:'+rewardcolors[block_num][1]+';"/>'+
			    '</svg>'; 
    },
    trial_duration: t_change,
    choices: jsPsych.NO_KEYS,
    data : {test_part: 'Change'},
    on_load: function(){
    	drawStimuliChange(stim, gabor_posn_left, gabor_posn_right);
    },
    on_finish: function(data){
    	data.stimulus = '';
    }
};

var probe_and_response_phase = {
    type: 'html-keyboard-response',
    stimulus: function(){
    	return	'<svg>' +
    			getstim_probe() +
			    '<circle class="fixation-point"/>' +
			    '<circle class="reward-cue-left"  style="fill:'+rewardcolors[block_num][0]+';"/>'+
			    '<circle class="reward-cue-right" style="fill:'+rewardcolors[block_num][1]+';"/>'+
			    '</svg>';
    },
    trial_duration: t_response,
    choices: [ResponseCode.no_change_key, ResponseCode.change_key],
    data: {test_part: 'Probe_and_response'},
    on_finish: function(data){
    	[score, feedback_text, Resp] = assessResponse(data.key_press, ResponseCode, block_num, trial_num, score);
    }
};

var response_feedback_gap = {
	type: 'html-keyboard-response',
	stimulus: function(){
    	return	'<svg>' +
    			'<circle class="fixation-point"/>' + 
			    '<circle class="reward-cue-left"  style="fill:'+rewardcolors[block_num][0]+';"/>'+
			    '<circle class="reward-cue-right" style="fill:'+rewardcolors[block_num][1]+';"/>'+
			    '</svg>';
	},
    data: {test_part: 'Response_feedback_gap'},
	choices: jsPsych.NO_KEYS,
	trial_duration: function(){
		return block_info[block_num][0].TimeRespFB_Break[trial_num];
	}
};

var feedback_phase = {
	type: 'audio-keyboard-response',
	stimulus: function(){
		return getAudioFeedback(Resp);
	},
	trial_duration: t_feedback,
	prompt: function(){
		return '<svg>'+
		    '<svg id="feedback-pie-chart" x="42.1875%" y="42.1875%" width="15.745%" height="15.745%" viewBox="-1 -1 2 2"></svg>' + 
		    '<circle class="reward-cue-left"  style="fill:'+rewardcolors[block_num][0]+';"/>'+
			'<circle class="reward-cue-right" style="fill:'+rewardcolors[block_num][1]+';"/>'+
		    '</svg>'+
		    '<p style="position:relative;z-index:1;">'+feedback_text+'</p>';
	},
	choices: jsPsych.NO_KEYS,
    data: {test_part: 'Feedback'},
	on_load: function(){
		drawPieFeedback(score, block_num, trial_num);
	},
	on_finish: function(){
    	console.log(`block: ${block_num}...trial: ${trial_num}`); /* Debug code (Remove later) */
    	if(trial_num == numtrials-1){
    		block_num = block_num + 1; 
    		trial_num = 0;
    	} else {
    		trial_num++;
    	}
    }
};

var cumulative_feedback = {
	type: 'html-keyboard-response',
	stimulus: function(){
		return '<p class="score-text" style="transform:translateY(29.255%);">Total Score</p>' +
			'<svg>'+
		    '<svg id="feedback-pie-chart" x="42.1875%" y="42.1875%" width="15.745%" height="15.745%" viewBox="-1 -1 2 2"></svg>' + 
		    '<circle class="reward-cue-left"  style="fill:'+rewardcolors[block_num][0]+';"/>'+
			'<circle class="reward-cue-right" style="fill:'+rewardcolors[block_num][1]+';"/>'+
		    '</svg>'+
		    '<p style="position:relative;z-index:1;">'+get_cumulative_feedback_text(score.total)+'</p>';
	},
	trial_duration: t_cumulative_fb,
	choices: jsPsych.NO_KEYS,
    data: {test_part: 'Cumulative_feedback'},
	on_load: function(){
		drawCumulativePieFeedback(trial_num);
	},
	post_trial_gap: t_post_cumulative_fb_gap
}; 


/************************************/
/* Generate experiment timeline */
/************************************/

experiment_timeline.push(fullscr);
experiment_timeline.push(welcome);

for(block_idx=0; block_idx<numblocks; block_idx++){
	experiment_timeline.push(begin_block);

	for(trial_idx=0; trial_idx<numtrials; trial_idx++){
		experiment_timeline.push(fixation_phase);
		experiment_timeline.push(stimulus_and_cue_phase);
		experiment_timeline.push(blank_phase);
		experiment_timeline.push(stimulus_change_phase);
		experiment_timeline.push(probe_and_response_phase);
		experiment_timeline.push(response_feedback_gap);
		experiment_timeline.push(feedback_phase);
		experiment_timeline.push(inter_trial_break);	
		if(trial_idx == ((numtrials*0.5)-1)){
			experiment_timeline.push(mid_block_break);
		}
	}
	experiment_timeline.push(cumulative_feedback);
	experiment_timeline.push(inter_block_break);
}