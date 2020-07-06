/* Script to define the experiment timeline */

/******************************/
/* Experiment functions */
/******************************/

function generateGaborStimulus(block_num, trial_num, size) {
	var contrast = 100.0;
	var spatial_freq = 50.0;
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

function getstim_change_phase(stim, stim_radius){
	var left_stim, right_stim;
	left_stim = (stim[2]==0)?  '<image class="left-stim"  href="'+ stim[0] + '" style="transform:translate('+ (-stim_radius) +'px,'+ (-stim_radius) +'px)"/>' 
							:  '<image class="left-stim"  href="'+ stim[2] + '" style="transform:translate('+ (-stim_radius) +'px,'+ (-stim_radius) +'px)"/>';
	right_stim = (stim[3]==0)? '<image class="right-stim" href="'+ stim[1] + '" style="transform:translate('+ (-stim_radius) +'px,'+ (-stim_radius) +'px)"/>' 
							:  '<image class="right-stim" href="'+ stim[3] + '" style="transform:translate('+ (-stim_radius) +'px,'+ (-stim_radius) +'px)"/>';
	return left_stim + right_stim;
}

function getstim_probe(){
	var probe = block_info[block_num][0].Probe[trial_num];
	if(probe == -1){
		return '<polygon class="probe-fill"  points= "'+ left_probe_path +'"/><polygon class="probe-empty" points= "'+ right_probe_path +'"/>'; 
	}
	else if(probe == 1){
		return '<polygon class="probe-empty" points= "'+ left_probe_path +'"/><polygon class="probe-fill"  points= "'+ right_probe_path +'"/>';
	}
}

function get_score_text(){
	var score_text;
	if(Resp == 'NoResp'){
		score_text = "<p>X</p><br><p>- "+ -trial_score + "</p>";
	}
	else if(trial_score > 0 && block_cue[block_num] == 6){
		score_text = "<p>- " + trial_score + "</p";
	}
	else if(trial_score > 0 && block_cue[block_num] == 3){
		score_text = "<p>+ " + trial_score + "</p";
	}
	else if(trial_score < 0){
		score_text = "<p>- " + -trial_score + "</p>"
	}
	else if(trial_score == 0 && rwrd == -1){
		score_text = "<p>+ " + trial_score + "</p>"
	}
	else if(trial_score == 0 && rwrd == 1){
		score_text = "<p>- " + trial_score + "</p>"
	}
	Resp = NaN, rwrd = NaN;
	return score_text;
}

/******************************/
/* Variables */
/******************************/

var experiment_timeline = [];
var bock_idx, trial_idx;
var block_num=0, trial_num=0;
const no_change_key = 73, change_key = 77;

window_h = window.screen.height;
window_w = window.screen.width;
var stim_size = (500*window_w)/1920;
var stim_radius = stim_size/2;
cx = window_w/2;
cy = window_h/2;
probe_height = (25*window_w)/1920;
probe_width  = (10*window_h)/1080;
right_probe_path = ''+(cx+2)+','+(cy+probe_width)+' '+ (cx+2+2*probe_height)+','+(cy)+' '+(cx+2)+','+(cy-probe_width)+'';
left_probe_path = ''+(cx-2)+','+(cy+probe_width)+' '+ (cx-2-2*probe_height)+','+(cy)+' '+(cx-2)+','+(cy-probe_width)+'';

var stim = generateGaborStimulus(block_num, trial_num, stim_size);
var Resp, rwrd = NaN;
var score_arr = [];
var score = {total:0, gi:0, li:0, net:0};
var trial_score = 0;
var ResponseKey = new Array(numblocks);
for(var i=0;i<numblocks;i++){
	ResponseKey[i] = [];
}


/******************************/
/* Experiment Phases/Nodes */
/******************************/

var fullscr = {
    type:'fullscreen',
    fullscreen_mode: true
};

var welcome = {
    type: 'html-keyboard-response',
    stimulus: 'Welcome to the experiment. Press any key to begin.'
};

var begin_block = {
	type: 'html-keyboard-response',
	stimulus: 'Press any key to begin block.',
	trial_duration: wait_forblock,
	post_trial_gap: t_startblockin
};

var mid_block_break = {
	type: 'html-keyboard-response',
	stimulus: 'BREAK. Maintain position. Press any key to skip.',
	trial_duration: t_resumeblockin,
};

var inter_block_break = {
	type:'html-keyboard-response',
	stimulus: 'Next block starts soon.',
	trial_duration: t_interblockbreak,
	choices: jsPsych.NO_KEYS,
	on_finish: function(){
		score_arr.push(score);
		score = {total:0, gi:0, li:0, net:0};
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
    	return	'<svg>' +
    			'<circle class="fixation-point"/>' + 
			    '<circle class="reward-cue-left"  style="fill:'+rewardcolors[block_num][0]+';"/>'+
			    '<circle class="reward-cue-right" style="fill:'+rewardcolors[block_num][1]+';"/>'+
    			'<image class="left-stim" href="' + stim[0] + '" style="transform:translate('+ (-stim_radius) +'px,'+ (-stim_radius) +'px)"/>' +
    			'<image class="right-stim" href="'+ stim[1] + '" style="transform:translate('+ (-stim_radius) +'px,'+ (-stim_radius) +'px)"/>' +
    			'</svg>';
    },
    trial_duration: function(){
    	return block_info[block_num][0].TimeCueStim[trial_num];
    },
    choices: jsPsych.NO_KEYS,
    data : {test_part: 'stimulus_and_cue'},
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
    	return '<svg>' +
			    '<circle class="fixation-point"/>' + 
			    '<circle class="reward-cue-left"  style="fill:'+rewardcolors[block_num][0]+';"/>'+
			    '<circle class="reward-cue-right" style="fill:'+rewardcolors[block_num][1]+';"/>'+
			    getstim_change_phase(stim, stim_radius) +
			    '</svg>'; 
    },
    trial_duration: t_change,
    choices: jsPsych.NO_KEYS,
    data : {test_part: 'Change'},
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
    choices: [no_change_key, change_key],
    data : {test_part: 'Probe_and_response'},
    on_finish: function(data){
    	assessResponse(data.key_press);
    }
};

var response_feedback_gap = {
	type: 'html-keyboard-response',
	stimulus: function(){
    	return	'<svg>' +
			    '<circle class="reward-cue-left"  style="fill:'+rewardcolors[block_num][0]+';"/>'+
			    '<circle class="reward-cue-right" style="fill:'+rewardcolors[block_num][1]+';"/>'+
			    '</svg>';
	},
	choices: jsPsych.NO_KEYS,
	trial_duration: function(){
		return block_info[block_num][0].TimeRespFB_Break[trial_num];
	}
}

var feedback_phase = {
    type: 'html-keyboard-response',
    stimulus: function(){
    	return	get_score_text() +
    			'<svg id="svg">' +
			    '<circle class="reward-cue-left"  style="fill:'+rewardcolors[block_num][0]+';"/>'+
			    '<circle class="reward-cue-right" style="fill:'+rewardcolors[block_num][1]+';"/>'+
	            '</svg>';
    },
    trial_duration: t_feedback,
    choices: jsPsych.NO_KEYS,
    data : {test_part: 'feedback'},
    on_finish: function(){
    	console.log(`block: ${block_num}...trial: ${trial_num}`);
    	if(trial_num == numtrials-1){
    		block_num = block_num + 1; 
    		trial_num = 0;
    	} else {
    		trial_num++;
    	}

    }
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
	experiment_timeline.push(inter_block_break);
}