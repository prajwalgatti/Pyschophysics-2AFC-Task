const deg_per_score = max_score/180;
var old_angle;
// var init_angle, new_angle;

function drawPieChart(old_angle, new_angle){
    function getPath(angle, pie){
        var x, y, angle_in_rads;
        if(angle>180){
            console.log('Warning! Pie chart feedback angle greater than 180 deg.');
            angle = 180;
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
    var sector = s.path(getPath(0, pie));
    sector.attr({
        fill:'#FFFFFF',
    });
    Snap.animate(old_angle, new_angle, function(val){
            sector.attr({
                d: getPath(val, pie)
            });
    }, 1000);
}

function drawPieFeedback(scores, trial_num){
	var new_angle;
	if(trial_num == 0){
		old_angle = 0;
		new_angle = 0;
	}
	else if(trial_num == numtrials-1){
		
	}
	else{
		new_angle = deg_per_score * Math.abs(scores.trial);
	}
	drawPieChart(old_angle, new_angle);
}