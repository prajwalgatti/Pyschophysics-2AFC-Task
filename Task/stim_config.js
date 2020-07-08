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

/***********************************/
/* Feedback  */
/***********************************/
const audio_files = ['audio_files/correct.wav', 'audio_files/incorrect.wav', 'audio_files/noresp.wav'];