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

	Contable[block_num][0] = Contable[block_num][0] + respcounter[0];
	Contable[block_num][1] = Contable[block_num][1] + respcounter[1];
	Contable[block_num][2] = Contable[block_num][2] + respcounter[2];
	Contable[block_num][3] = Contable[block_num][3] + respcounter[3];

	return Resp;
};

function update_change_angle(block_num, change_angle){
	Accuracy[block_num] = (Contable[block_num][0] + Contable[block_num][3])/numtrials;
	Change_angles[block_num] = change_angle;
	if(Accuracy[block_num] <= 0.625 || change_angle == 0){
		change_angle = change_angle + increment;
	}
	else if(Accuracy[block_num] > 0.625){
		change_angle = change_angle - increment;
	}

	/* Dynamic step-size for Stair-case */
	if(block_num > 0){
		if((Accuracy[block_num] < 0.625 && Accuracy[block_num-1] < 0.625) ||
			(Accuracy[block_num] > 0.750 && Accuracy[block_num-1] > 0.750)){
			increment = 5;
		}
		else if((Accuracy[block_num] > 0.750 && Accuracy[block_num-1] < 0.625) || 
			(Accuracy[block_num-1] > 0.750 && Accuracy[block_num] < 0.625)){
			increment = 3.5;
		}
		else if((Accuracy[block_num-1] <= 0.750 && Accuracy[block_num] >= 0.625) ||
			(Accuracy[block_num] <= 0.750 && Accuracy[block_num-1] >= 0.625)){
			increment = 2;
		}
	}

	return change_angle;
};