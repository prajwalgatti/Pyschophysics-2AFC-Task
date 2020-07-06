function assessResponse(keypress){
	var cont, oldscore, respcounter;

	/* Determining response type */
	if(keypress == change_key){
		ResponseKey[block_num][trial_num] = [keypress, 1]; 
	}
	else if(keypress == no_change_key){
		ResponseKey[block_num][trial_num] = [keypress, 0];	
	}
	else {
		ResponseKey[block_num][trial_num] = [NaN, 5];
	}

	if((block_info[block_num][0].Probe[trial_num] == -1 && block_info[block_num][0].Change_Angle_L[trial_num] != 0) || 
		(block_info[block_num][0].Probe[trial_num] == 1 && block_info[block_num][0].Change_Angle_R[trial_num] != 0)) {
		// Change occured
		if(ResponseKey[block_num][trial_num][1] == 0){
			Resp = 'Miss';
		}
		else if(ResponseKey[block_num][trial_num][1] == 1){
			Resp = 'Hit';
		}
		else if(ResponseKey[block_num][trial_num][1] == 5){
			Resp = 'NoResp';
		}
	}
	else if((block_info[block_num][0].Probe[trial_num] == -1 && block_info[block_num][0].Change_Angle_L[trial_num] == 0) ||
	 		 (block_info[block_num][0].Probe[trial_num] == 1 && block_info[block_num][0].Change_Angle_R[trial_num] == 0)){
		// No change occured
		if(ResponseKey[block_num][trial_num][1] == 0){
			Resp = 'CR';
		}
		else if(ResponseKey[block_num][trial_num][1] == 1){
			Resp = 'FA';
		}
		else if(ResponseKey[block_num][trial_num][1] == 5){
			Resp = 'NoResp';
		}
	}

	/* Reward Allocation */
	if(block_info[block_num][0].Probe[trial_num] == -1){
		rwrd = block_info[block_num][0].Reward_L[trial_num]/Math.abs(block_info[block_num][0].Reward_L[trial_num]);
	}
	else{
		rwrd = -block_info[block_num][0].Reward_L[trial_num]/Math.abs(block_info[block_num][0].Reward_L[trial_num]);
	}

	if(rwrd == 1 && block_info[block_num][0].RewardSkew_Cue[trial_num] == 0){
		cont = nrGain;
		textcolor = gain_norm_color;
	}
	else if(rwrd == 1 && block_info[block_num][0].RewardSkew_Cue[trial_num] != 0){
		if 		(block_info[block_num][0].RewardSkew_Cue[trial_num]==1){ cont = skGain1;}
		else if (block_info[block_num][0].RewardSkew_Cue[trial_num]==2){ cont = skGain2; }
		textcolor = gain_skew_color;
	}
	else if(rwrd == -1 && block_info[block_num][0].RewardSkew_Cue[trial_num] == 0){
		cont = nrLoss;
		textcolor = loss_norm_color;
	}
	else if(rwrd == -1 && block_info[block_num][0].RewardSkew_Cue[trial_num] != 0){
		if 		(block_info[block_num][0].RewardSkew_Cue[trial_num]==1){ cont = skLoss1;}
		else if (block_info[block_num][0].RewardSkew_Cue[trial_num]==2){ cont = skLoss2; }
		textcolor = loss_skew_color;
	}

	oldscore = score;

	if(Resp == 'Hit'){
		respcounter = [[1,0],[0,0]];
		trial_score = cont.hit;
		score.total += cont.hit;
		if(rwrd == 1){
			score.gi += cont.hit;
			score.gf -= cont.fa;
		} else {
			score.li += cont.hit;
			score.la -= cont.fa;
		}
	}
	else if(Resp == 'CR'){
		respcounter =[[0,0],[0,1]];
		trial_score = cont.cr;
		score.total += cont.cr;
		if(rwrd == 1){
			score.gi += cont.cr;
			score.gf -= cont.miss;
		} else {
			score.li += cont.cr;
			score.la -= cont.fa;
		}
	}
	else if(Resp == 'Miss'){
		respcounter = [[0,1],[0,0]];
		trial_score = cont.miss;
		score.total += cont.miss;
		if(rwrd == 1){
			score.gi += cont.miss;
			score.gf -= cont.cr;
		} else {
			score.li += cont.miss;
			score.la -= cont.cr;
		}
	}
	else if(Resp == 'FA'){
		respcounter = [[0,0],[1,0]];
		trial_score = cont.fa;
		score.total += cont.fa;
		if(rwrd==1){
			score.gi += cont.fa;
			score.gf -= cont.hit;
		} else {
			score.li += cont.fa;
			score.la -= cont.hit;
		}
	}
	else{
		respcounter = 0;
		trial_score = cont.noresp;
		score.total += cont.noresp;
		if(rwrd==1){
			score.gi += cont.noresp;
			score.gf -= cont.hit;
		} else {
			score.li += cont.noresp;
			score.la -= cont.hit;
		}
	}

	score.netgi = score.gi + score.li;
	score.netla = score.la + score.gf;
}
