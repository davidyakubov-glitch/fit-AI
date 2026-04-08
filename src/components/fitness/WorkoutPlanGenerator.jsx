import React from 'react';
import { base44 } from '@/api/base44Client';

export const analyzePerformance = (sessions) => {
  if (!sessions || sessions.length === 0) {
    return {
      level: 'beginner',
      focusAreas: ['basic_form', 'depth'],
      strengths: [],
      weaknesses: ['insufficient_data']
    };
  }

  const recentSessions = sessions.slice(0, 5); // Last 5 sessions
  
  // Calculate averages
  const avgDepth = recentSessions.reduce((sum, s) => sum + (s.avg_depth_score || 0), 0) / recentSessions.length;
  const avgFormScore = recentSessions.reduce((sum, s) => sum + (s.avg_form_score || 0), 0) / recentSessions.length;
  const avgReps = recentSessions.reduce((sum, s) => sum + (s.total_reps || 0), 0) / recentSessions.length;
  
  // Collect all issues
  const allIssues = recentSessions.flatMap(s => s.common_issues || []);
  const issueFrequency = {};
  allIssues.forEach(issue => {
    issueFrequency[issue] = (issueFrequency[issue] || 0) + 1;
  });

  // Determine level
  let level = 'beginner';
  if (avgFormScore >= 80 && avgDepth >= 70 && avgReps >= 15) {
    level = 'advanced';
  } else if (avgFormScore >= 60 && avgDepth >= 60 && avgReps >= 10) {
    level = 'intermediate';
  }

  // Identify focus areas
  const focusAreas = [];
  const strengths = [];
  const weaknesses = [];

  // Critical form issues (highest priority)
  if (issueFrequency['knees_caving_in'] >= 2) {
    focusAreas.push('knee_stability');
    weaknesses.push('knees_caving');
  }

  if (issueFrequency['heels_lifting'] >= 2) {
    focusAreas.push('ankle_mobility');
    weaknesses.push('heels_lifting');
  }

  if (avgDepth < 60) {
    focusAreas.push('depth');
    weaknesses.push('squat_depth');
  } else if (avgDepth >= 70) {
    strengths.push('good_depth');
  }

  if (issueFrequency['insufficient_depth'] >= 3) {
    focusAreas.push('flexibility');
    weaknesses.push('limited_flexibility');
  }

  if (issueFrequency['excessive_forward_lean'] >= 2) {
    focusAreas.push('core_strength');
    weaknesses.push('core_stability');
  }

  if (issueFrequency['uneven_leg_descent'] >= 2 || issueFrequency['hip_shift'] >= 2) {
    focusAreas.push('balance');
    weaknesses.push('leg_imbalance');
  }

  if (issueFrequency['stance_too_narrow'] >= 2) {
    focusAreas.push('setup');
    weaknesses.push('stance_width');
  }

  if (issueFrequency['knees_caving'] >= 2) {
    focusAreas.push('knee_stability');
    weaknesses.push('knee_valgus');
  }

  if (issueFrequency['heels_lifting'] >= 2) {
    focusAreas.push('ankle_mobility');
    weaknesses.push('ankle_flexibility');
  }

  if (issueFrequency['stance_too_narrow'] >= 2 || issueFrequency['stance_too_wide'] >= 2) {
    focusAreas.push('stance_optimization');
    weaknesses.push('stance_issues');
  }

  if (avgFormScore >= 75) {
    strengths.push('consistent_form');
  }

  if (avgReps < 10) {
    focusAreas.push('endurance');
    weaknesses.push('low_endurance');
  } else if (avgReps >= 20) {
    strengths.push('good_endurance');
  }

  // If no specific issues, add progression
  if (focusAreas.length === 0 && level === 'advanced') {
    focusAreas.push('progression');
  }

  return {
    level,
    focusAreas: [...new Set(focusAreas)],
    strengths: [...new Set(strengths)],
    weaknesses: [...new Set(weaknesses)],
    avgDepth,
    avgFormScore,
    avgReps
  };
};

export const generatePersonalizedWorkoutPlan = (preferences, analysis) => {
  const exercises = [];
  const tips = [];

  // Adjust based on user preferences
  const { fitness_level, primary_goal, sessions_per_week, session_duration } = preferences;
  const level = fitness_level || analysis?.level || 'beginner';

  // Base exercise parameters by level and duration
  const exerciseParams = {
    beginner: { sets: session_duration >= 45 ? 3 : 2, reps: 8 },
    intermediate: { sets: session_duration >= 45 ? 4 : 3, reps: 12 },
    advanced: { sets: session_duration >= 45 ? 5 : 4, reps: 15 }
  };

  const params = exerciseParams[level];

  // Base squat exercise (adapted to goal)
  if (primary_goal === 'strength') {
    exercises.push({
      name: 'Bodyweight Squats (Strength Focus)',
      sets: params.sets,
      reps: Math.max(5, params.reps - 3),
      description: 'Slow, controlled reps with 3-second descent',
      reason: 'Building raw strength with time under tension'
    });
  } else if (primary_goal === 'endurance') {
    exercises.push({
      name: 'High-Rep Squats',
      sets: params.sets + 1,
      reps: params.reps + 5,
      description: 'Maintain steady pace throughout',
      reason: 'Building muscular endurance and stamina'
    });
  } else if (primary_goal === 'flexibility') {
    exercises.push({
      name: 'Deep Squat Holds',
      sets: 3,
      reps: 1,
      description: 'Hold bottom position for 30-45 seconds',
      reason: 'Improves hip and ankle mobility'
    });
    exercises.push({
      name: 'Bodyweight Squats (Full ROM)',
      sets: params.sets,
      reps: params.reps,
      description: 'Focus on maximum depth with control',
      reason: 'Develops flexibility through full range of motion'
    });
  } else if (primary_goal === 'weight_loss') {
    exercises.push({
      name: 'Jump Squats (Cardio)',
      sets: params.sets,
      reps: Math.min(15, params.reps),
      description: 'Explosive jumps from squat position',
      reason: 'Burns calories with high-intensity movement'
    });
    exercises.push({
      name: 'Squat Pulses',
      sets: 3,
      reps: 20,
      description: 'Small pulses at the bottom of squat',
      reason: 'Keeps heart rate elevated for fat burning'
    });
  }

  // Add goal-specific exercises
  if (primary_goal === 'strength') {
    exercises.push({
      name: 'Bulgarian Split Squats',
      sets: params.sets,
      reps: 8,
      description: 'Single-leg squats with rear foot elevated',
      reason: 'Builds unilateral leg strength'
    });

    exercises.push({
      name: 'Wall Sits',
      sets: 3,
      reps: 1,
      description: 'Hold for 45-60 seconds',
      reason: 'Isometric strength development'
    });

    tips.push('Focus on slow, controlled movements with good form');
    tips.push('Rest 90-120 seconds between sets for strength gains');
  }

  if (primary_goal === 'endurance') {
    exercises.push({
      name: 'Squat Hold to Stand',
      sets: 4,
      reps: 20,
      description: 'Alternate between holding and standing',
      reason: 'Builds endurance through varied tempo'
    });

    exercises.push({
      name: 'Walking Lunges',
      sets: 3,
      reps: 15,
      description: 'Forward lunges with continuous movement',
      reason: 'Cardiovascular and muscular endurance'
    });

    tips.push('Keep rest periods short (30-45 seconds) to build endurance');
    tips.push('Focus on consistent breathing throughout sets');
  }

  if (primary_goal === 'flexibility') {
    exercises.push({
      name: 'Cossack Squats',
      sets: 3,
      reps: 10,
      description: 'Side-to-side squats for hip mobility',
      reason: 'Improves lateral flexibility and range of motion'
    });

    exercises.push({
      name: 'Hip Flexor Stretches',
      sets: 3,
      reps: 1,
      description: 'Hold each side for 30 seconds',
      reason: 'Opens hips for better squat depth'
    });

    exercises.push({
      name: 'Ankle Mobility Drills',
      sets: 3,
      reps: 10,
      description: 'Ankle circles and wall stretches',
      reason: 'Essential for maintaining proper form'
    });

    tips.push('Warm up thoroughly before stretching');
    tips.push('Hold stretches without bouncing for best results');
  }

  if (primary_goal === 'weight_loss') {
    exercises.push({
      name: 'Burpee Squats',
      sets: 3,
      reps: 10,
      description: 'Squat, plank, squat, jump sequence',
      reason: 'Full-body calorie burn'
    });

    exercises.push({
      name: 'Mountain Climbers',
      sets: 3,
      reps: 20,
      description: 'Fast-paced alternating knee drives',
      reason: 'Cardio blast for fat burning'
    });

    tips.push('Keep your heart rate elevated between exercises');
    tips.push('Combine with healthy eating for best weight loss results');
  }

  // If we have performance analysis, add corrective exercises
  if (analysis?.weaknesses) {

  // Base squat exercise
  if (analysis.level === 'beginner') {
    exercises.push({
      name: 'Bodyweight Squats',
      sets: 3,
      reps: 8,
      description: 'Focus on proper form and full range of motion',
      reason: 'Building foundational strength and form'
    });
  } else if (analysis.level === 'intermediate') {
    exercises.push({
      name: 'Bodyweight Squats',
      sets: 4,
      reps: 12,
      description: 'Maintain good form throughout all reps',
      reason: 'Increasing volume for strength development'
    });
  } else {
    exercises.push({
      name: 'Bodyweight Squats',
      sets: 5,
      reps: 15,
      description: 'Challenge yourself with tempo variations',
      reason: 'Advanced endurance and control'
    });
  }

  // Address specific weaknesses
  
  // Critical form issues
  if (analysis.weaknesses.includes('knees_caving')) {
    exercises.push({
      name: 'Resistance Band Squats',
      sets: 3,
      reps: 12,
      description: 'Squat with resistance band around knees, actively push knees out',
      reason: 'Trains glutes to keep knees aligned and prevents valgus collapse'
    });
    
    exercises.push({
      name: 'Clamshells',
      sets: 3,
      reps: 15,
      description: 'Lie on side with band around knees, open top knee',
      reason: 'Strengthens hip abductors to prevent knees caving in'
    });

    tips.push('Focus on pushing knees OUT during every squat');
    tips.push('Widen your stance to shoulder-width or slightly wider');
  }

  if (analysis.weaknesses.includes('heels_lifting')) {
    exercises.push({
      name: 'Ankle Mobility Drills',
      sets: 3,
      reps: 10,
      description: 'Wall ankle stretches and calf raises',
      reason: 'Improves ankle flexibility to keep heels grounded'
    });
    
    exercises.push({
      name: 'Goblet Squats',
      sets: 3,
      reps: 10,
      description: 'Hold weight in front of chest while squatting',
      reason: 'Counterbalance helps keep weight on heels'
    });

    tips.push('Focus on keeping weight on your heels throughout the movement');
    tips.push('Stretch calves daily to improve ankle mobility');
  }

  if (analysis.weaknesses.includes('squat_depth') || analysis.weaknesses.includes('limited_flexibility')) {
    exercises.push({
      name: 'Box Squats',
      sets: 3,
      reps: 10,
      description: 'Squat down to touch a box/chair, then stand up',
      reason: 'Improves depth awareness and builds confidence'
    });
    
    exercises.push({
      name: 'Deep Squat Hold',
      sets: 3,
      reps: 1,
      description: 'Hold the bottom squat position for 20-30 seconds',
      reason: 'Increases hip and ankle flexibility'
    });

    tips.push('Focus on ankle mobility exercises daily');
    tips.push('Try goblet squats to help with depth and balance');
  }

  if (analysis.weaknesses.includes('core_stability')) {
    exercises.push({
      name: 'Wall Sits',
      sets: 3,
      reps: 1,
      description: 'Hold for 30-45 seconds with back against wall',
      reason: 'Strengthens core and improves posture'
    });

    exercises.push({
      name: 'Bird Dogs',
      sets: 3,
      reps: 10,
      description: 'Alternate extending opposite arm and leg',
      reason: 'Builds core stability and balance'
    });

    tips.push('Engage your core throughout the entire squat movement');
    tips.push('Practice breathing techniques: inhale down, exhale up');
  }

  if (analysis.weaknesses.includes('leg_imbalance')) {
    exercises.push({
      name: 'Bulgarian Split Squats',
      sets: 3,
      reps: 8,
      description: 'Single-leg squats with rear foot elevated',
      reason: 'Corrects strength imbalances between legs'
    });

    exercises.push({
      name: 'Single-Leg Balance',
      sets: 3,
      reps: 1,
      description: 'Hold single-leg stance for 30 seconds each side',
      reason: 'Improves balance and stability'
    });

    tips.push('Pay extra attention to your weaker leg');
  }

  if (analysis.weaknesses.includes('knee_valgus')) {
    exercises.push({
      name: 'Banded Squats',
      sets: 3,
      reps: 12,
      description: 'Place resistance band around knees, push knees out during squat',
      reason: 'Strengthens hip abductors to prevent knee cave'
    });

    exercises.push({
      name: 'Glute Bridges',
      sets: 3,
      reps: 15,
      description: 'Lie on back, lift hips up while squeezing glutes',
      reason: 'Builds glute strength for better knee control'
    });

    exercises.push({
      name: 'Clamshells',
      sets: 3,
      reps: 15,
      description: 'Side-lying hip abduction exercise',
      reason: 'Activates and strengthens hip stabilizers'
    });

    tips.push('Think "knees out" during every squat - track them over your toes');
    tips.push('Widen your stance to shoulder-width or slightly wider');
  }

  if (analysis.weaknesses.includes('ankle_flexibility')) {
    exercises.push({
      name: 'Ankle Mobility Drills',
      sets: 3,
      reps: 10,
      description: 'Ankle circles, wall ankle stretches, calf raises',
      reason: 'Improves ankle dorsiflexion for better squat depth'
    });

    exercises.push({
      name: 'Goblet Squats',
      sets: 3,
      reps: 10,
      description: 'Hold weight at chest, squat deep with heels down',
      reason: 'Weight helps keep heels grounded and improves form'
    });

    exercises.push({
      name: 'Elevated Heel Squats',
      sets: 3,
      reps: 10,
      description: 'Place small plates under heels to reduce ankle demand',
      reason: 'Builds strength while reducing ankle mobility requirement'
    });

    tips.push('Stretch your calves daily - tight calves cause heel lift');
    tips.push('Focus on pushing through your heels, not your toes');
  }

  if (analysis.weaknesses.includes('stance_issues')) {
    exercises.push({
      name: 'Stance Width Practice',
      sets: 3,
      reps: 5,
      description: 'Practice squats at different stance widths to find optimal position',
      reason: 'Helps identify most comfortable and stable stance'
    });

    tips.push('Your stance should be shoulder-width or slightly wider');
    tips.push('Toes should point slightly outward (10-15 degrees)');
  }

  if (analysis.weaknesses.includes('low_endurance')) {
    exercises.push({
      name: 'Squat Pulses',
      sets: 3,
      reps: 15,
      description: 'Small pulses at the bottom of the squat',
      reason: 'Builds muscular endurance'
    });

    tips.push('Gradually increase reps each workout');
    tips.push('Focus on consistent breathing throughout');
  }

  // Progression for advanced users
  if (analysis.level === 'advanced' && analysis.strengths.includes('good_endurance')) {
    exercises.push({
      name: 'Jump Squats',
      sets: 3,
      reps: 10,
      description: 'Explosive jump from squat position',
      reason: 'Develops power and explosiveness'
    });

    exercises.push({
      name: 'Pistol Squat Progression',
      sets: 3,
      reps: 5,
      description: 'Work towards single-leg squats (use assistance if needed)',
      reason: 'Ultimate bodyweight squat challenge'
    });

    tips.push('Consider adding weight (dumbbells/kettlebells) for resistance');
    tips.push('Experiment with different squat variations');
  }

  // General tips based on level
  if (analysis.level === 'beginner') {
    tips.push('Quality over quantity - perfect your form first');
    tips.push('Rest 60-90 seconds between sets');
  } else if (analysis.level === 'intermediate') {
    tips.push('Challenge yourself but maintain proper form');
    tips.push('Rest 45-60 seconds between sets');
  } else {
    tips.push('Focus on progressive overload and new challenges');
    tips.push('Rest 30-45 seconds between sets for endurance');
  }

  }

  // Add session frequency tips
  if (sessions_per_week >= 5) {
    tips.push('Training 5+ times per week - ensure proper recovery');
    tips.push('Consider active recovery days (walking, light stretching)');
  } else if (sessions_per_week <= 2) {
    tips.push('With 2 sessions per week, make each one count');
    tips.push('Focus on full-body movements for efficiency');
  }

  // Duration-specific tips
  if (session_duration <= 20) {
    tips.push('Short sessions - focus on high-intensity exercises');
    tips.push('Minimize rest periods to maximize efficiency');
  } else if (session_duration >= 60) {
    tips.push('Longer sessions allow for thorough warm-up and cool-down');
    tips.push('Include variety to keep the session engaging');
  }

  tips.push('Warm up with leg swings and hip circles before starting');
  tips.push('Stay consistent with your schedule for best results');

  return {
    generated_date: new Date().toISOString(),
    difficulty_level: level,
    focus_areas: analysis?.focusAreas || [primary_goal],
    exercises: exercises,
    tips: [...new Set(tips)],
    is_active: true,
    user_preferences: preferences
  };
};

export const generateWorkoutPlan = (analysis) => {
  const exercises = [];
  const tips = [];

  // Base squat exercise
  if (analysis.level === 'beginner') {
    exercises.push({
      name: 'Bodyweight Squats',
      sets: 3,
      reps: 8,
      description: 'Focus on proper form and full range of motion',
      reason: 'Building foundational strength and form'
    });
  } else if (analysis.level === 'intermediate') {
    exercises.push({
      name: 'Bodyweight Squats',
      sets: 4,
      reps: 12,
      description: 'Maintain good form throughout all reps',
      reason: 'Increasing volume for strength development'
    });
  } else {
    exercises.push({
      name: 'Bodyweight Squats',
      sets: 5,
      reps: 15,
      description: 'Challenge yourself with tempo variations',
      reason: 'Advanced endurance and control'
    });
  }

  // Address weaknesses from analysis
  if (analysis.weaknesses.includes('knees_caving')) {
    exercises.push({
      name: 'Resistance Band Squats',
      sets: 3,
      reps: 12,
      description: 'Squat with resistance band around knees, actively push knees out',
      reason: 'Trains glutes to keep knees aligned'
    });
    tips.push('Focus on pushing knees OUT during every squat');
  }

  if (analysis.weaknesses.includes('heels_lifting')) {
    exercises.push({
      name: 'Ankle Mobility Drills',
      sets: 3,
      reps: 10,
      description: 'Wall ankle stretches and calf raises',
      reason: 'Improves ankle flexibility to keep heels grounded'
    });
    tips.push('Focus on keeping weight on your heels');
  }

  tips.push('Warm up before starting');
  tips.push('Stay consistent - aim for 3-4 workouts per week');

  return {
    generated_date: new Date().toISOString(),
    difficulty_level: analysis.level,
    focus_areas: analysis.focusAreas,
    exercises: exercises,
    tips: [...new Set(tips)],
    is_active: true
  };
};

export const generatePersonalizedPlan = async (userId, preferences = null) => {
  try {
    // Get recent workout sessions
    const sessions = await base44.entities.WorkoutSession.filter(
      { created_by: userId },
      '-created_date',
      20
    );

    // Analyze performance
    const analysis = analyzePerformance(sessions);

    // Generate plan based on preferences or analysis
    let plan;
    if (preferences) {
      plan = generatePersonalizedWorkoutPlan(preferences, analysis);
    } else {
      plan = generateWorkoutPlan(analysis);
    }

    // Deactivate old plans
    const oldPlans = await base44.entities.WorkoutPlan.filter(
      { created_by: userId, is_active: true }
    );
    
    await Promise.all(
      oldPlans.map(p => 
        base44.entities.WorkoutPlan.update(p.id, { is_active: false })
      )
    );

    // Save new plan
    const newPlan = await base44.entities.WorkoutPlan.create(plan);

    return { plan: newPlan, analysis };
  } catch (error) {
    console.error('Error generating workout plan:', error);
    throw error;
  }
};