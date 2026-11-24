/* OVERFLOWISM · The Living Mind, phase one.
   Pure emotional model. Intensity is not a moral label: joy, loss and love can coexist. */
(function(root){
  'use strict';
  const STATES = Object.freeze({
    bloom: Object.freeze({light:[249,184,112],shadow:[65,35,31],intensity:.74,fire:.7,dust:.9,weather:'clear',artist:'paint'}),
    heart: Object.freeze({light:[217,101,124],shadow:[60,18,42],intensity:.72,fire:1,dust:.52,weather:'clear',artist:'roses'}),
    noise: Object.freeze({light:[196,83,123],shadow:[30,19,53],intensity:.92,fire:1,dust:.85,weather:'clouded',artist:'dance'}),
    spiral: Object.freeze({light:[149,130,185],shadow:[40,27,60],intensity:.64,fire:.6,dust:.7,weather:'haze',artist:'code'}),
    watchers: Object.freeze({light:[141,159,189],shadow:[24,31,56],intensity:.45,fire:.45,dust:.38,weather:'night',artist:'windows'}),
    sadness: Object.freeze({light:[114,142,164],shadow:[28,38,53],intensity:.38,fire:.27,dust:.35,weather:'clouded',artist:'windows'}),
    peace: Object.freeze({light:[213,187,166],shadow:[43,35,49],intensity:.28,fire:.5,dust:.36,weather:'haze',artist:'fire'})
  });
  const names = Object.keys(STATES);
  const LIMITS = Object.freeze({minDwell:28000,maxDwell:72000});
  const clamp = n => Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
  const mix = (a,b,t) => a.map((v,i)=>Math.round(v*(1-t)+b[i]*t));
  function select(current,random=Math.random){
    const choices=names.filter(n=>n!==current);
    return choices[Math.min(choices.length-1,Math.floor(clamp(random())*choices.length))];
  }
  function next(current,random=Math.random){
    const name=select(current,random);
    const undertone=select(name,random);
    const weight=.08+clamp(random())*.28;
    const one=STATES[name],two=STATES[undertone];
    const intensity=clamp(one.intensity*(1-weight)+two.intensity*weight);
    const dwell=Math.round(LIMITS.minDwell+clamp(random())*(LIMITS.maxDwell-LIMITS.minDwell));
    return Object.freeze({
      name,undertone,weight,intensity,dwell,
      light:mix(one.light,two.light,weight),
      shadow:mix(one.shadow,two.shadow,weight),
      fire:clamp(one.fire*(1-weight)+two.fire*weight),
      dust:clamp(one.dust*(1-weight)+two.dust*weight),
      weather:one.weather,
      artist:one.artist
    });
  }
  root.OVERFLOW_EMOTIONS=Object.freeze({STATES,LIMITS,names,select,next});
})(window);
