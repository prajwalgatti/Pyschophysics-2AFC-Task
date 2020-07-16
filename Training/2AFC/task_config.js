/* Script to generate task information */

/******************************/
/* Helper Functions*/
/******************************/

function create2darray(num_row, num_col, val){
	/* https://stackoverflow.com/a/46792350 */
	return Array.from(Array(num_row), _ => Array(num_col).fill(val));
}

function createNSeq(N, oneIndexed){
	/* https://stackoverflow.com/a/33352604	*/
	if (oneIndexed){
		return Array.from(Array(N), (_, i) => i + 1);
	}
	else {
		return [...Array(N).keys()];
	}
}

function getAllIndexes(arr, val) {
	/* https://stackoverflow.com/a/20798567 */
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}

function linspace(startValue, stopValue, cardinality) {
  /* https://stackoverflow.com/a/40475362 */
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return arr;
}

function transpose(arr){
	return arr[0].map((_, colIndex) => arr.map(row => row[colIndex]));
}

/* function for deep copy */
const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);

/******************************/
/* Experimental Variables */
/******************************/

const numtrials = 8;
const numblocks = 5;
const change_angles = [25, 25];

function getTaskDesign(block){
	var temp_array, i;
	var trialnum = createNSeq(N=numtrials, oneIndexed=true);
	var n4 = 0.25*numtrials;

	var probe_arr 	= jsPsych.randomization.shuffle(Array(numtrials/2).fill(-1).concat(Array(numtrials/2).fill(1)));
	var left_probe	= getAllIndexes(probe_arr, -1);
	var right_probe = getAllIndexes(probe_arr, 1);

	/* Change motif  */
	var motif_arr = [1,2,3,4]; // 1:[1,1], 2:[1,0], 3:[0,1], 4:[0,0]
	var change = jsPsych.randomization.repeat(motif_arr, numtrials/motif_arr.length);

	/* Expanded version of change array: 1->[1,1], 2->[1,0], 3->[0,1], 4->[0,0] */
	var change_ = new Array(numtrials);
	for(i=0; i<numtrials; i++){
		switch(change[i]){
			case 1:
				change_[i] = [1, 1];
				continue;
			case 2:
				change_[i] = [1, 0];
				continue;
			case 3:
				change_[i] = [0, 1];
				continue;
			case 4:
				change_[i] = [0, 0];
		}
	}

	var delta = new Array(numtrials);
	for(i=0; i<change.length; i++){
		switch(change[i]){
			case 1:
				delta[i] = [change_angles[0], change_angles[1]];
				continue;
			case 2:
				delta[i] = [change_angles[0], 0];
				continue;
			case 3:
				delta[i] = [0, change_angles[1]];
				continue;
			case 4:	
				delta[i] = [0, 0];
		}
	}

	/* Assigning initial angles (theta) */
	var theta = linspace(15, 75, numtrials);
	var tilt_stim = transpose([jsPsych.randomization.shuffle(Array(numtrials*0.5).fill(-1).concat(Array(numtrials*0.5).fill(1))) ,
		jsPsych.randomization.shuffle(Array(numtrials*0.5).fill(-1).concat(Array(numtrials*0.5).fill(1)))]);

	/* Assigns the angles of the stimuli BEFORE change: */
	var alpha = new Array(numtrials);
	temp_array = transpose([jsPsych.randomization.shuffle(theta), jsPsych.randomization.shuffle(theta)]);
	for(i=0; i<alpha.length; i++){
		alpha[i] = [tilt_stim[i][0]*temp_array[i][0], tilt_stim[i][1]*temp_array[i][1]];
	}

	// Assigning tilt AFTER change: 0:no change, (-1):L tilt, 1:R tilt
	var changetilt = new Array(numtrials);

	temp_array = [jsPsych.randomization.shuffle(Array(numtrials*0.125).fill(-1).concat(Array(numtrials*0.125).fill(1))),
	jsPsych.randomization.shuffle(Array(numtrials*0.125).fill(-1).concat(Array(numtrials*0.125).fill(1))),
	jsPsych.randomization.shuffle(Array(numtrials*0.125).fill(-1).concat(Array(numtrials*0.125).fill(1))),
	jsPsych.randomization.shuffle(Array(numtrials*0.125).fill(-1).concat(Array(numtrials*0.125).fill(1)))]

	for(i=0; i<changetilt.length; i++){
		switch(change[i]){
			case 1:
				changetilt[i] = [temp_array[0].pop(), temp_array[1].pop()];
				continue;
			case 2:
				changetilt[i] = [temp_array[2].pop(), 0];
				continue;
			case 3:
				changetilt[i] = [0, temp_array[3].pop()];
				continue;
			case 4:
				changetilt[i] = [0, 0];
		}
	}

	// Calculating the change_angle and direction of change
	var delta_ = new Array(numtrials);
	for(i=0;i<numtrials; i++){
		delta_[i] = [changetilt[i][0]*delta[i][0], changetilt[i][1]*delta[i][1]];
	}

	// Assigning the angle AFTER change
	var beta = new Array(numtrials);
	for(i=0; i<numtrials; i++){
		beta[i] = [alpha[i][0]+delta_[i][0], alpha[i][1]+delta_[i][1]];
	}

	/* Assign t_cuestim */
	var lambda_cs = 4;
	var exprnd_cs = d3.randomExponential(lambda_cs);
	var t_cuestimulus = new Array();
	var t_cuestim;
	var temp_expval_cs;
	for(i=0; i<20*numtrials; i++){
		temp_expval_cs = t_cuestim_min + exprnd_cs()*1000;
		if (temp_expval_cs < t_cuestim_max){
			t_cuestimulus.push(temp_expval_cs);
		}
		if(i==20*numtrials-1){
			if(t_cuestimulus.length<2*numtrials){
				i = 10*numtrials;
			}
		}
	}
	t_cuestimulus = jsPsych.randomization.shuffle(t_cuestimulus).slice(0,numtrials);
	t_cuestim = jsPsych.randomization.shuffle(t_cuestimulus);

	/* Assign t_resp_fbonset_break */
	var lambda_rf = 2;
	var exprnd_rf = d3.randomExponential(lambda_rf);
	var t_respfb_break = new Array();
	var t_resp_fbonset_break;
	var temp_expval_rf;
	for(i=0; i<20*numtrials; i++){
		temp_expval_rf = t_respfb_break_min + exprnd_rf() * 1000;
		if(temp_expval_rf < t_respfb_break_max){
			t_respfb_break.push(temp_expval_rf);
		}
		if(i==20*numtrials-1){
			if(t_respfb_break.length<2*numtrials){
				i = 10*numtrials;
			}
		}
	}
	t_respfb_break = jsPsych.randomization.shuffle(t_respfb_break).slice(0,numtrials);
	t_resp_fbonset_break = jsPsych.randomization.shuffle(t_respfb_break);

	/* Generating tables for trials and angle config */

	delta_  = transpose(delta_);
	change_ = transpose(change_);
	alpha 	= transpose(alpha);
	beta 	= transpose(beta);

	var trial_info_table = {
		Block_num: block,
		Trial_num: clone(trialnum),
		Probe: clone(probe_arr),
		Change_Angle_L: clone(delta_[0]),
		Change_Angle_R: clone(delta_[1]),
		Motif: clone(change),
		Change_L: clone(change_[0]),
		Change_R: clone(change_[1]),
		TimeCueStim: clone(t_cuestim),
		TimeRespFB_Break: clone(t_resp_fbonset_break) 
	}

	var angle_info_table = {
		Block_num: block,
		Trial_num: clone(trialnum),
		Probe: clone(probe_arr),
		Alpha_L: clone(alpha[0]),
		Alpha_R: clone(alpha[1]),
		Delta_L: clone(delta_[0]),
		Delta_R: clone(delta_[1]),
		Beta_L: clone(beta[0]),
		Beta_R: clone(beta[1])
	}

	return [trial_info_table, angle_info_table];
}

var block_info = new Array(numblocks);
for(let i=0; i<numblocks; i++){
	block_info[i] = getTaskDesign(block=i+1);
}