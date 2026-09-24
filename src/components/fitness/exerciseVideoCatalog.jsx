export const EXERCISE_VIDEO_CATALOG = {
  squat:            { id: 'aclHkVaku9U', thumb: 'https://img.youtube.com/vi/aclHkVaku9U/hqdefault.jpg' },
  lunge:            { id: 'L8fvypPrzzs', thumb: 'https://img.youtube.com/vi/L8fvypPrzzs/hqdefault.jpg' },
  push_up:          { id: 'IODxDxX7oi4', thumb: 'https://img.youtube.com/vi/IODxDxX7oi4/hqdefault.jpg' },
  plank:            { id: 'pSHjTRCQxIw', thumb: 'https://img.youtube.com/vi/pSHjTRCQxIw/hqdefault.jpg' },
  sit_up:           { id: 'jDwoBqPH0jk', thumb: 'https://img.youtube.com/vi/jDwoBqPH0jk/hqdefault.jpg' },
  glute_bridge:     { id: 'wPM8icPu6H8', thumb: 'https://img.youtube.com/vi/wPM8icPu6H8/hqdefault.jpg' },
  mountain_climber: { id: 'nmwgirgXLYM', thumb: 'https://img.youtube.com/vi/nmwgirgXLYM/hqdefault.jpg' },
  burpee:           { id: 'auBLPXO8Fww', thumb: 'https://img.youtube.com/vi/auBLPXO8Fww/hqdefault.jpg' },
  jump_squat:       { id: 'CVaEhXotL7M', thumb: 'https://img.youtube.com/vi/CVaEhXotL7M/hqdefault.jpg' },
  single_leg_squat: { id: 'qDcniqddTeE', thumb: 'https://img.youtube.com/vi/qDcniqddTeE/hqdefault.jpg' },
  barbell_squat:    { id: '1oed-UmAxFs', thumb: 'https://img.youtube.com/vi/1oed-UmAxFs/hqdefault.jpg' },
  deadlift:         { id: 'op9kVnSso6Q', thumb: 'https://img.youtube.com/vi/op9kVnSso6Q/hqdefault.jpg' },
  bench_press:      { id: 'SCVCLChPQac', thumb: 'https://img.youtube.com/vi/SCVCLChPQac/hqdefault.jpg' },
  shoulder_press:   { id: '2yjwXTZQDDI', thumb: 'https://img.youtube.com/vi/2yjwXTZQDDI/hqdefault.jpg' },
  lat_pulldown:     { id: 'CAwf7n6Luuc', thumb: 'https://img.youtube.com/vi/CAwf7n6Luuc/hqdefault.jpg' },
  pull_up:          { id: 'eGo4IYlbE5g', thumb: 'https://img.youtube.com/vi/eGo4IYlbE5g/hqdefault.jpg' },
  barbell_row:      { id: 'FWJR5Ve8bnQ', thumb: 'https://img.youtube.com/vi/FWJR5Ve8bnQ/hqdefault.jpg' },
  leg_press:        { id: 'IZxyjW7MPJQ', thumb: 'https://img.youtube.com/vi/IZxyjW7MPJQ/hqdefault.jpg' },
  leg_curl:         { id: 'ELOCsoDSmrg', thumb: 'https://img.youtube.com/vi/ELOCsoDSmrg/hqdefault.jpg' },
  leg_extension:    { id: 'YyvSfVjQeL0', thumb: 'https://img.youtube.com/vi/YyvSfVjQeL0/hqdefault.jpg' },
  bicep_curl:       { id: 'ykJmrZ5v0Oo', thumb: 'https://img.youtube.com/vi/ykJmrZ5v0Oo/hqdefault.jpg' },
  tricep_extension: { id: 'nRiJVZDpdL0', thumb: 'https://img.youtube.com/vi/nRiJVZDpdL0/hqdefault.jpg' },
};

export const EXERCISE_VIDEO_URLS = Object.fromEntries(
  Object.entries(EXERCISE_VIDEO_CATALOG).map(([exerciseId, data]) => [
    exerciseId,
    `https://www.youtube.com/embed/${data.id}`,
  ])
);
