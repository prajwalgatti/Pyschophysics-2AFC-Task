const deg_per_score = 180/max_score;
var old_angle;

function drawPieChart(old_angle, new_angle, animate_flag = true){
    function getPath(angle, pie){
        var x, y, angle_in_rads;
        if(angle>180){
            angle = 180;
        }
        else if(angle<0){
        	angle = 0;
        }
        angle_in_rads = (90+angle) * Math.PI/180;
        y = pie.r * (1 - Math.sin(angle_in_rads));
        x = pie.r * Math.cos(angle_in_rads);
        return "m"+[pie.cx, pie.cy]+"v"+[-pie.r]+"a"+[pie.r,pie.r]+' 0 0,0 ' + [x,y] +'z' + 
            "m"+[pie.cx, pie.cy]+"v"+[-pie.r]+"a"+[pie.r,pie.r]+' 0 0,1 ' + [-x,y] +'z'; 
        }
    var pie = {cx:0, cy:0, r: 0.98};

    var s = Snap("#feedback-pie-chart");
    var disc = s.circle(pie.cx, pie.cy, pie.r);
    disc.attr({
        fill:'none',
        stroke:'#FFFFFF',
        style:'stroke-width: 0.02'
    });
    var sector = s.path(getPath(old_angle, pie));
    sector.attr({
        fill:'#FFFFFF',
    });
    if(animate_flag){
        Snap.animate(old_angle, new_angle, function(val){
                sector.attr({
                    d: getPath(val, pie)
                });
        }, t_pie_animation);
    }
};

function drawPieFeedback(scores, block_num, trial_num){
	var new_angle;
	if(trial_num == 0){
		old_angle = 0;
	}
	if(block_cue[block_num] == 3 && score.trial < 0){
		new_angle = old_angle - deg_per_score * Math.abs(scores.trial);
	} else {
	new_angle = old_angle + deg_per_score * Math.abs(scores.trial);		
	}
	drawPieChart(old_angle, new_angle, true);
	if(new_angle < 0){ new_angle = 0;}
	if(new_angle > 180){ new_angle = 180;}
	old_angle = new_angle;
	return;
};

function drawCumulativePieFeedback(){
	drawPieChart(old_angle, old_angle, false);
	return;
};

function getAudioFeedback(Resp){
	if(Resp == 'Hit'|| Resp == 'CR'){
		return audio_files[0];
	}
	else if(Resp == 'Miss' || Resp == 'FA'){
		return audio_files[1];
	}
	else if(Resp == 'NoResp'){
		return audio_files[2];
	}
};