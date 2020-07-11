// Generated by CoffeeScript 1.10.0
var arrmax, arrmin, deg2rad, gaborgen, meshgrid, pi, rescale, rescale_core;

gaborgen = function(tilt, sf, _contrast, _size) {
  var a, aspectratio, b, contrast, gab_x, gab_y, gridArray, i, j, m, multConst, phase, preSinWave, ref, reso, sc, scaledM, sf_max, sf_min, sinWave, tilt_max, tilt_min, varScale, x, x_centered, x_factor, y, y_centered, y_factor, base_image;
  // if ((tilt > 100 || tilt < 1) || (sf > 100 || sf < 1)) {
  //   console.log("ERROR: gaborgen arguenment input out of bounds");
  // }
  reso = _size;
  phase = 0;
  sc = 50.0;
  contrast = _contrast;
  aspectratio = 1.0;
  tilt_min = 0;
  tilt_max = 90;
  sf_min = .01;
  sf_max = .1;
  // tilt = rescale_core(tilt, tilt_min, tilt_max, 1, 100);
  sf = rescale_core(sf, sf_min, sf_max, 1, 100);
  x = reso / 2;
  y = reso / 2;
  a = numeric.cos([deg2rad(tilt)]) * sf * 360;
  b = numeric.sin([deg2rad(tilt)]) * sf * 360;
  multConst = 1 / (numeric.sqrt([2 * pi]) * sc);
  varScale = 2 * numeric.pow([sc], 2);
  gridArray = numeric.linspace(0, reso);
  ref = meshgrid(gridArray), gab_x = ref[0], gab_y = ref[1];
  x_centered = numeric.sub(gab_x, x);
  y_centered = numeric.sub(gab_y, y);
  x_factor = numeric.mul(numeric.pow(x_centered, 2), -1);
  y_factor = numeric.mul(numeric.pow(y_centered, 2), -1);
  preSinWave = numeric.add(numeric.add(numeric.mul(a, x_centered), numeric.mul(b, y_centered)), phase);
  i = 0;
  while (i < reso) {
    j = 0;
    while (j < reso) {
      preSinWave[i][j] = deg2rad(preSinWave[i][j]);
      j += 1;
    }
    i += 1;
  }
  sinWave = numeric.sin(preSinWave);
  m = numeric.add(.5, numeric.mul(contrast, numeric.transpose(numeric.mul(numeric.mul(multConst, numeric.exp(numeric.add(numeric.div(x_factor, varScale), numeric.div(y_factor, varScale)))), sinWave))));
  scaledM = rescale(m, 0, 254);
  base_image = new Image();
  base_image.src = numeric.imageURL([scaledM, scaledM, scaledM]);
  return base_image;
};

pi = 3.1416;

deg2rad = function(degrees) {
  return (degrees * pi) / 180;
};

arrmax = numeric.mapreduce('if(xi > accum) accum=xi;', '-Infinity');

arrmin = numeric.mapreduce('if(xi < accum) accum=xi;', 'Infinity');

meshgrid = function(value) {
  var i, m, value_length;
  m = [];
  value_length = value.length;
  i = 0;
  while (i < value_length) {
    m.push(value);
    i += 1;
  }
  return [m, numeric.transpose(m)];
};

rescale_core = function(y, a, b, m, M) {
  if (M - m < .0000001) {
    y;
  }
  return numeric.add(numeric.mul(b - a, numeric.div(numeric.sub(y, m), M - m)), a);
};

rescale = function(y, a, b) {
  return rescale_core(y, a, b, arrmin(y), arrmax(y));
};

//# sourceMappingURL=gab.js.map
