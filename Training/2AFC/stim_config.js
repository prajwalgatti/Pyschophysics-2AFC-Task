/* Stimulus configuration */

/******************************/
/* Reward Cue Colors */
/******************************/

const rewardcuecolor = '#FFFFFF';

/***********************************/
/* Time Stamps (in milliseconds) */
/***********************************/

/* keypress to start/resume a block */
const wait_forblock = 30000;

/* period after keypress to start/resume a block */
const t_startblockin = 1000;

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

/* Inter-trial interval */
const t_intertrialbreak = 2000;

/* Inter-block interval */
const t_interblockbreak = 2000;

/* Duration of welcome screen */
const t_welcome_scr = 4000;

/* Duration between end of training and resart of training */
const t_train_again_onset = 3000;

/***********************************/
/* Media files  */
/***********************************/
const image_files = ['img/cns.jpg'];

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
var distance_from_screen;

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

function set_dimensions(PPI = 85.33333333333333){

	/* Init */
	// Task dimensions in degrees of visual angle
	var task_dimensions = {
		cueArrowHeight: 0.26212748,
		fixationRadius: 0.2097024691,
		stimWinPix: 6.524877734,
		pixShift: 9.097296349,
		cue_locn: 15.34967358,
		cue_radius: 0.393187713,
		total_width: 29.36764513
	};

	var allowed_distances_from_screen = [60, 55, 50, 45, 40]; /* in cm */
	var allowance = 1/8; /*in inches*/
	var exclude_flag = false;
	/* screen dimensions in inches */
	var screen_width = window.screen.width/PPI;
	var screen_height = window.screen.height/PPI;
	// var total_width;
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
		console.log('Can\'t work with this screen. Please contact experimenter. ');
		return NaN;
		/* Do something to show exclude screen */
	}

	/* Set dimensions */
	stim_size = Math.tan(task_dimensions.stimWinPix*Math.PI/180) * dist * PPI /2.54;
	stim_radius = stim_size/2;
	
	probe_height = 2.5 * Math.tan(task_dimensions.cueArrowHeight*Math.PI/180) * dist * PPI /2.54;
	probe_width = 2.0 * Math.tan(task_dimensions.cueArrowHeight*Math.PI/180) * dist * PPI /2.54;
	
	var pixShift = Math.tan(task_dimensions.pixShift*Math.PI/180) * dist * PPI /2.54;
	gabor_posn_left = [window_w/2-pixShift-stim_radius, window_h/2-stim_radius];
	gabor_posn_right = [window_w/2+pixShift-stim_radius, window_h/2-stim_radius];

	fixation_point_attr.cx = '50%';
	fixation_point_attr.cy = '50%';
	fixation_point_attr.r = ((100*Math.tan(task_dimensions.fixationRadius*Math.PI/180)/window_w) * dist * PPI /2.54) + '%';

	var cue_locn = Math.tan(task_dimensions.cue_locn*Math.PI/180) * dist * PPI /2.54;
	reward_cue_L_attr.cx = (100*(window_w/2 - cue_locn)/window_w) + '%';
	reward_cue_L_attr.cy = '50%'
	reward_cue_L_attr.r = ((100*Math.tan(task_dimensions.cue_radius*Math.PI/180) * dist * PPI /2.54)/window_w) + '%';

	reward_cue_R_attr.cx = (100*(window_w/2 + cue_locn)/window_w) + '%';
	reward_cue_R_attr.cy = '50%';
	reward_cue_R_attr.r = ((100*Math.tan(task_dimensions.cue_radius*Math.PI/180) * dist * PPI /2.54)/window_w) + '%';

	/* Generate first set of stimuli  */	
	stim = generateGaborStimulus(block_num, trial_num, stim_size);

	/* Debug code (remove later) */
	console.log(dist);
	
	return dist;
};