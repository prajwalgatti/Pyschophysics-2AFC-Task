function assessResponse(keypress, ResponseCode, block_num, trial_num){
	var Response, Resp, respcounter;

	if(keypress == ResponseCode.change_key){
		Response = 1;
		ResponseKey[block_num][trial_num] = [keypress, 1];
	}
	else if(keypress ==  ResponseCode.no_change_key){
		Response = 0;
		ResponseKey[block_num][trial_num] = [keypress, 0];
	}
	else{
		Response = 5;
		ResponseKey[block_num][trial_num] = [NaN, 5];
		ResponseTime[block_num][trial_num] = NaN;
	}

	/* Determine response */
	if((block_info[block_num][0].Probe[trial_num] == -1 && block_info[block_num][0].Change_Angle_L[trial_num] != 0) ||
		(block_info[block_num][0].Probe[trial_num] == 1 && block_info[block_num][0].Change_Angle_R[trial_num] != 0)){
		change = true;
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
		change = false;
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

	switch(Resp){
		case 'Hit':
			respcounter = [1,0,0,0];
			break;
		
		case 'CR':
			respcounter = [0,0,0,1];
			break;

		case 'Miss':
			respcounter = [0,1,0,0];
			break;

		case 'FA':
			respcounter = [0,0,1,0];
			break;

		case 'NoResp':
			respcounter = [0,0,0,0];
			break;
	}

	/* Update  Contable */
	Contable[block_num][0] = Contable[block_num][0] + respcounter[0];
	Contable[block_num][1] = Contable[block_num][1] + respcounter[1];
	Contable[block_num][2] = Contable[block_num][2] + respcounter[2];
	Contable[block_num][3] = Contable[block_num][3] + respcounter[3];

	/* Generate feedback text */
	feedback_text = (change)? 'Change on the probed side' : 'No change on the probed side';
	if(Resp == 'Hit' || Resp == 'CR'){
		feedback_text = 'Correct response<br>' + feedback_text; 
	}
	else if(Resp == 'Miss' || Resp == 'FA'){
		feedback_text = 'Incorrect response<br>' + feedback_text;
	}
	else if(Resp == 'NoResp'){
		feedback_text = 'No response recorded';
	}

	return feedback_text;
}