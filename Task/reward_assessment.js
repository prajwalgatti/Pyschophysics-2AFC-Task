function rewardAllocation(block_num, trial_num){
	var cont, rwrd;
	if(block_info[block_num][0].Probe[trial_num] == -1){ 
		// left probed
		rwrd = block_info[block_num][0].Reward_L[trial_num]/Math.abs(block_info[block_num][0].Reward_L[trial_num]);
	}
	else{
		// right probed
		rwrd = -1*block_info[block_num][0].Reward_L[trial_num]/Math.abs(block_info[block_num][0].Reward_L[trial_num]);
	}

	if(block_cue[block_num] == 3){
		if(block_info[block_num][0].RewardSkew_Cue[trial_num] == 0){
			cont = nrGain;
			console.log(JSON.parse(JSON.stringify('nrGain')));
		}
		else if(block_info[block_num][0].RewardSkew_Cue[trial_num] = 1){
			cont = skGain1;
			console.log(JSON.parse(JSON.stringify('skGain1')));
		}
		else if(block_info[block_num][0].RewardSkew_Cue[trial_num] = 2){
			cont = skGain2;
			console.log(JSON.parse(JSON.stringify('skGain2')));
		}		
	}
	else if(block_cue[block_num] == 6){
		if(block_info[block_num][0].RewardSkew_Cue[trial_num] == 0){
			cont = nrLoss;
			console.log(JSON.parse(JSON.stringify('nrLoss')));
		}
		else if(block_info[block_num][0].RewardSkew_Cue[trial_num] == 1){
			cont = skLoss1;
			console.log(JSON.parse(JSON.stringify('skLoss1')));	
		}
		else if(block_info[block_num][0].RewardSkew_Cue[trial_num] == 2){
			cont = skLoss2;
			console.log(JSON.parse(JSON.stringify('skLoss2')));
		}
	}

	return [rwrd, cont];
}


function assessResponse(keypress, ResponseCode, block_num, trial_num, score){
	var Response, Resp, rwrd, cont, oldscore, respcounter, feedback_text;

	if(keypress == ResponseCode.change_key){
		Response = 1;
	}
	else if(keypress ==  ResponseCode.no_change_key){
		Response = 0;
	}
	else{
		Response =5;
	}

	/* Determining response type */
	if((block_info[block_num][0].Probe[trial_num] == -1 && block_info[block_num][0].Change_Angle_L[trial_num] != 0) ||
		(block_info[block_num][0].Probe[trial_num] == 1 && block_info[block_num][0].Change_Angle_R[trial_num] != 0)){

		if(Response == 0){
			Resp = 'Miss';
		}
		else if(Response == 1){
			Resp = 'Hit';
		}
		else if(Response == 5){
			Resp = 'NoResp';
		}
	}
	else if((block_info[block_num][0].Probe[trial_num] == -1 && block_info[block_num][0].Change_Angle_L[trial_num] == 0) ||
	 (block_info[block_num][0].Probe[trial_num] == 1 && block_info[block_num][0].Change_Angle_R[trial_num] == 0)){

		if(Response == 0){
			Resp = 'CR';
		}
		else if(Response == 1){
			Resp = 'FA';
		}
		else if(Response == 5){
			Resp = 'NoResp';
		}
	}

	[rwrd, cont] = rewardAllocation(block_num, trial_num);

	// oldscore = score;

	switch(Resp){
		case 'Hit':
			respcounter = [[1,0],[0,0]];
			score.trial = cont.hit;
			score.total = score.total + cont.hit;
			if(rwrd == 1){
				score.gi = score.gi + cont.hit;
				score.gf = score.gf - cont.fa;
			}
			else{
				score.li = score.li + cont.hit;
				score.la = score.la - cont.fa;
			}
			break;
		
		case 'CR':
			respcounter = [[0,0],[0,1]];
			score.trial = cont.cr;
			score.total = score.total + cont.cr;
			if(rwrd  == 1){
				score.gi = score.gi + cont.cr;
				score.gf = score.gf - cont.miss;
			}
			else{
				score.li = score.li + cont.cr;
				score.la = score.la - cont.miss;
			}
			break;

		case 'Miss':
			respcounter = [[0,1],[0,0]];
			score.trial = cont.miss;
			score.total = score.total + cont.miss;
			if(rwrd == 1){
				score.gi = score.gi + cont.miss;
				score.gf = score.gf - cont.cr;
			}
			else{
				score.li = score.li + cont.miss;
				score.la = score.la - cont.cr;
			}
			break;

		case 'FA':
			respcounter = [[0,0],[1,0]];
			score.trial = cont.fa;
			score.total = score.total + cont.fa;
			if(rwrd == 1){
				score.gi = score.gi + cont.fa;
				score.gf = score.gf - cont.hit;
			}
			else{
				score.li = score.li + cont.fa;
				score.la = score.la - cont.hit;
			}
			break;

		case 'NoResp':
			respcounter = 0;
			score.trial = cont.noresp;
			score.total = score.total + cont.noresp;
			if(rwrd == 1){
				score.gi = score.gi + cont.noresp;
				score.gf = score.gf - cont.hit;
			}
			else{
				score.li = score.li + cont.noresp;
				score.la = score.la - cont.hit;
			}
			break;
	}

	score.netgi = score.gi + score.li;
	score.netla = score.la + score.gf;

	if(Resp == 'NoResp'){
		feedback_text = '-' + (-score.trial) + '<br>X';
	}
	else if(score.trial > 0){
		feedback_text = '+' + (score.trial) ; 
	}
	else if(score.trial < 0){
		feedback_text = '-' + (-score.trial);
	}
	else if(score.trial == 0){
		feedback_text = '' + (score.trial);
	}
	return [score, feedback_text, Resp];
}
