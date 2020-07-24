function assessResponse(keypress, ResponseCode, block_num, trial_num){
	var Response, Resp, feedback_text, change;
	if(keypress == ResponseCode.change_key){
		Response = 1;
	}
	else if(keypress ==  ResponseCode.no_change_key){
		Response = 0;
	}
	else{
		Response =5;
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