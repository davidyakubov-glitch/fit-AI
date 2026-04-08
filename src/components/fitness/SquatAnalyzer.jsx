import { useEffect, useRef, useState } from 'react';
// ИСПРАВЛЕНО: Используем абсолютный путь через @, чтобы Vite не терялся
import { calcAngle as calculateAngle } from '@/components/fitness/exerciseAnalyzers/utils';

export default function SquatAnalyzer({ landmarks, onSquatComplete, onFeedbackUpdate }) {
  const [squatState, setSquatState] = useState('standing');
  const [repCount, setRepCount] = useState(0);
  const [currentDepth, setCurrentDepth] = useState(0);
  const [formIssues, setFormIssues] = useState([]);
  
  const prevStateRef = useRef('standing');
  const prevAnkleHeightRef = useRef({ left: 0, right: 0 });
  const currentRepDataRef = useRef({
    maxDepth: 0,
    issues: []
  });

  useEffect(() => {
    if (!landmarks) return;

    // Расчет углов в коленях
    const leftKneeAngle = calculateAngle(
      landmarks.leftHip,
      landmarks.leftKnee,
      landmarks.leftAnkle
    );
    const rightKneeAngle = calculateAngle(
      landmarks.rightHip,
      landmarks.rightKnee,
      landmarks.rightAnkle
    );
    const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

    // Расчет угла спины
    const leftBackAngle = calculateAngle(
      landmarks.leftAnkle,
      landmarks.leftHip,
      landmarks.leftShoulder
    );
    const rightBackAngle = calculateAngle(
      landmarks.rightAnkle,
      landmarks.rightHip,
      landmarks.rightShoulder
    );
    const avgBackAngle = (leftBackAngle + rightBackAngle) / 2;

    // Расчет глубины
    const depth = Math.max(0, Math.min(100, ((170 - avgKneeAngle) / 100) * 100));
    setCurrentDepth(Math.round(depth));

    if (depth > currentRepDataRef.current.maxDepth) {
      currentRepDataRef.current.maxDepth = depth;
    }

    // --- ДЕТЕКЦИЯ ОШИБОК ФОРМЫ ---
    const issues = [];
    const issueDetails = {};
    
    // 1. Глубина
    if (squatState === 'squatting' && avgKneeAngle > 120) {
      issues.push('insufficient_depth');
      issueDetails.insufficient_depth = {
        severity: avgKneeAngle > 140 ? 'high' : 'medium',
        currentAngle: Math.round(avgKneeAngle)
      };
    }

    // 2. Завал коленей внутрь
    const leftKneeX = landmarks.leftKnee.x;
    const rightKneeX = landmarks.rightKnee.x;
    const leftHipX = landmarks.leftHip.x;
    const rightHipX = landmarks.rightHip.x;
    const leftAnkleX = landmarks.leftAnkle.x;
    const rightAnkleX = landmarks.rightAnkle.x;
    
    const leftKneeAnkleDist = Math.abs(leftKneeX - leftAnkleX);
    const leftHipAnkleDist = Math.abs(leftHipX - leftAnkleX);
    const rightKneeAnkleDist = Math.abs(rightKneeX - rightAnkleX);
    const rightHipAnkleDist = Math.abs(rightHipX - rightAnkleX);
    
    const leftKneeCaving = leftKneeAnkleDist < leftHipAnkleDist * 0.6;
    const rightKneeCaving = rightKneeAnkleDist < rightHipAnkleDist * 0.6;
    
    if (squatState === 'squatting' && (leftKneeCaving || rightKneeCaving)) {
      issues.push('knees_caving_in');
      issueDetails.knees_caving_in = {
        severity: (leftKneeCaving && rightKneeCaving) ? 'high' : 'medium',
        side: leftKneeCaving && rightKneeCaving ? 'both' : leftKneeCaving ? 'left' : 'right'
      };
    }

    // 3. Отрыв пяток
    const leftAnkleY = landmarks.leftAnkle.y;
    const rightAnkleY = landmarks.rightAnkle.y;
    
    if (squatState === 'squatting' && prevStateRef.current === 'squatting') {
      const leftHeelLift = prevAnkleHeightRef.current.left > 0 && 
                           (leftAnkleY < prevAnkleHeightRef.current.left - 0.02);
      const rightHeelLift = prevAnkleHeightRef.current.right > 0 && 
                            (rightAnkleY < prevAnkleHeightRef.current.right - 0.02);
      
      if (leftHeelLift || rightHeelLift) {
        issues.push('heels_lifting');
        issueDetails.heels_lifting = {
          severity: (leftHeelLift && rightHeelLift) ? 'high' : 'medium',
          side: leftHeelLift && rightHeelLift ? 'both' : leftHeelLift ? 'left' : 'right'
        };
      }
    }
    
    prevAnkleHeightRef.current = { left: leftAnkleY, right: rightAnkleY };

    // 4. Колени слишком далеко вперед
    const leftKneeForward = Math.abs(leftKneeX - leftAnkleX) > 0.15;
    const rightKneeForward = Math.abs(rightKneeX - rightAnkleX) > 0.15;
    
    if (squatState === 'squatting' && (leftKneeForward || rightKneeForward)) {
      issues.push('knees_too_forward');
      issueDetails.knees_too_forward = {
        severity: (leftKneeForward && rightKneeForward) ? 'medium' : 'low',
        side: leftKneeForward && rightKneeForward ? 'both' : leftKneeForward ? 'left' : 'right'
      };
    }

    // 5. Перекос таза
    const hipHeightDiff = Math.abs(landmarks.leftHip.y - landmarks.rightHip.y);
    if (squatState === 'squatting' && hipHeightDiff > 0.05) {
      issues.push('hip_shift');
      issueDetails.hip_shift = {
        severity: hipHeightDiff > 0.08 ? 'high' : 'medium',
        side: landmarks.leftHip.y < landmarks.rightHip.y ? 'left_higher' : 'right_higher'
      };
    }

    // 6. Наклон спины
    if (avgBackAngle < 50) {
      issues.push('excessive_forward_lean');
      issueDetails.excessive_forward_lean = {
        severity: 'high',
        angle: Math.round(avgBackAngle)
      };
    }

    // 7. Узкая стойка
    const stanceWidth = Math.abs(leftAnkleX - rightAnkleX);
    const shoulderWidth = Math.abs(landmarks.leftShoulder.x - landmarks.rightShoulder.x);
    
    if (stanceWidth < shoulderWidth * 0.9) {
      issues.push('stance_too_narrow');
      issueDetails.stance_too_narrow = {
        severity: 'medium'
      };
    }

    // 8. Асимметрия спуска
    if (Math.abs(leftKneeAngle - rightKneeAngle) > 15) {
      issues.push('uneven_leg_descent');
      issueDetails.uneven_leg_descent = {
        severity: Math.abs(leftKneeAngle - rightKneeAngle) > 25 ? 'high' : 'medium',
        difference: Math.round(Math.abs(leftKneeAngle - rightKneeAngle))
      };
    }

    setFormIssues(issues);
    currentRepDataRef.current.issues = [...new Set([...currentRepDataRef.current.issues, ...issues])];

    // State machine (счетчик повторений)
    let newState = squatState;

    if (squatState === 'standing' && avgKneeAngle < 140) {
      newState = 'squatting';
    } else if (squatState === 'squatting' && avgKneeAngle > 160) {
      newState = 'standing';
      
      if (prevStateRef.current === 'squatting') {
        const repData = {
          depth: currentRepDataRef.current.maxDepth,
          issues: currentRepDataRef.current.issues,
          isGoodForm: currentRepDataRef.current.maxDepth >= 60 && currentRepDataRef.current.issues.length <= 1
        };
        
        setRepCount(prev => prev + 1);
        onSquatComplete?.(repData);
        
        currentRepDataRef.current = {
          maxDepth: 0,
          issues: []
        };
      }
    }

    if (newState !== squatState) {
      prevStateRef.current = squatState;
      setSquatState(newState);
    }

    // Отправка обратной связи родителю
    onFeedbackUpdate?.({
      state: newState,
      depth: Math.round(depth),
      kneeAngle: Math.round(avgKneeAngle),
      backAngle: Math.round(avgBackAngle),
      issues,
      issueDetails
    });

  }, [landmarks, squatState, onSquatComplete, onFeedbackUpdate]);

  // Возвращаем данные для использования в UI (если нужно)
  return {
    repCount,
    currentDepth,
    formIssues,
    squatState
  };
}