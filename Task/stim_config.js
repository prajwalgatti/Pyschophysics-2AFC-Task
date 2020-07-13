/* Stimulus configuration */

/******************************/
/* Reward Cue Colors */
/******************************/

const red 	 = '#960000';
const blue 	 = '#000096';
const green  = '#006400';
const violet = '#640064';

const color_code = 1;
var gain_norm_color, gain_skew_color, loss_norm_color, loss_skew_color;
switch(color_code){
	case 1:
		gain_norm_color = red;
		gain_skew_color = blue;
		loss_norm_color = green;
		loss_skew_color = violet;
		break;
	case 2:
		gain_norm_color = red;
		gain_skew_color = blue;
		loss_norm_color = violet;
		loss_skew_color = green;
		break;
	case 3:
		gain_norm_color = blue;
		gain_skew_color = red;
		loss_norm_color = green;
		loss_skew_color = violet;
		break;
	case 4:
		gain_norm_color = blue;
		gain_skew_color = red;
		loss_norm_color = violet;
		loss_skew_color = green;
}

/***********************************/
/* Time Stamps (in milliseconds) */
/***********************************/

/* keypress to start/resume a block */
const wait_forblock = 600000;

/* period after keypress to start/resume a block */
const t_startblockin = 1000;
const t_resumeblockin = 60000;

/* Min and max duration of stimulus display before cue appears */
const t_cuestim_min = 200;
const t_cuestim_max = 600;

/* duration of fixation before trial begins */
const t_fixation = 500;

/* Duration of blank phase before change occurs*/
const t_blank = 200;

/* Duration of stimulus display after change */
const t_change = 200;

/* Response Period */
const t_response = 1500;

/* Min and max duration of break between response and feedback onset */
const t_respfb_break_min = 500;
const t_respfb_break_max = 1000;

/* Duration of trial feedback text display */
const t_feedback = 2000;
const t_pie_animation = 1000;

/* Duration of cumulative block feedback display*/
const t_cumulative_fb = 3000;
const t_post_cumulative_fb_gap = 1000;

/* Inter-trial interval */
const t_intertrialbreak = 2000;

/* Inter-block interval */
const t_interblockbreak = 10000;

/* Duration of NoResponse Reset Instruction Display */
const t_noresp_reset = 5000;

/***********************************/
/* Feedback  */
/***********************************/
const audio_files = ['audio_files/correct.wav', 'audio_files/incorrect.wav', 'audio_files/noresp.wav'];

/***********************************/
/* Assign stimulus dimensions */
/***********************************/

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

var fixation_point_attr = {
	cx: '50%',
	cy: '50%',
	r: '0.416667%'
};

var reward_cue_L_attr = {
	cx: '8.33333%',
	cy: '50%',
	r: '0.78125%'
};

var reward_cue_R_attr = {
	cx: '91.66666%',
	cy: '50%',
	r: '0.78125%'
};

var pie_attr = {
	x: '42.1875%',
	y: '42.1875%',
	width: '15.745%',
	height: '15.745%'
}

var score_text_attr = {
	y: '29.255%'
}

function set_dimensions(PPI){
	/*
	arguments: 
	return: need not return anything, editing css selector attributes and global vars

	***********************
	! regenerate initial stim
	
	Variables to change

	stim_size
	stim_radius
	probe_height
	probe_width
	gabor_posn_left, gabor_posn_right

	css changes
	.reward-cue-left
	.reward-cue-right
	.fixation-point
	.score-text
	#stimulusCanvas (window_w, window_h values)
	#stimChangeCanvas (window_w, window_h values)
	#feedback-pie-chart
	
	*/

	/* Init */
	// Task dimensions in degrees of visual angle
	var task_dimensions = {
		cueArrowHeight: 0.26212748,
		fixationRadius: 0.2097024691,
		stimWinPix: 6.524877734,
		pixShift: 9.097296349,
		cue_locn: 15.34967358,
		cue_radius: 0.393187713,
		pieRadius: 3.925783839,
		total_width: 29.36764513
	};

	var allowed_distances_from_screen = [60, 55, 50, 45, 40]; /* in cm */
	var allowance = 0.125; /*in inches*/
	var exclude_flag = false;
	/* screen dimensions in inches */
	var screen_width = window.screen.width/PPI;
	var screen_height = window.screen.height/PPI;
	var total_width;
	var dist;

	/* Check for best fit */
	for(var i=0; i<allowed_distances_from_screen.length; i++){
		total_width = Math.tan(task_dimensions.total_width * Math.PI/180) * allowed_distances_from_screen[i]/2.54;
		if(total_width <= screen_width - allowance){
			dist = allowed_distances_from_screen[i];
			break;
		}
	}
	if(dist == undefined){
		/* Exclude the screen */
		exclude_flag = true;
		/* Do something to show exclude screen */
	}

	/* Set dimensions */
	stim_size = Math.tan(task_dimensions.stimWinPix*Math.PI/180) * dist * PPI /2.54;
	stim_radius = stim_size/2;
	probe_height = 2.5 * Math.tan(task_dimensions.cueArrowHeight*Math.PI/180) * dist * PPI /2.54;
	probe_width = 2.0 * Math.tan(task_dimensions.cueArrowHeight*Math.PI/180) * dist * PPI /2.54;
	gabor_posn_left = NaN;
	gabor_posn_right = NaN;

}