import React, { useRef, useEffect, useState } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

export const calculateAngle = (a, b, c) => {
  if (!a || !b || !c) return 0;
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * 180 / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return angle;
};

const SKELETON_CONNECTIONS = [
  [0, 4], [0, 1],
  [11, 12],
  [11, 13], [13, 15],
  [12, 14], [14, 16],
  [15, 17], [15, 19], [15, 21],
  [16, 18], [16, 20], [16, 22],
  [11, 23], [12, 24], [23, 24],
  [23, 25], [25, 27], [27, 29], [27, 31],
  [24, 26], [26, 28], [28, 30], [28, 32],
];

// Which landmark indices are "problematic" per issue key
const ISSUE_LANDMARKS = {
  knees_caving:      [23,24,25,26,27,28],
  knees_caving_in:   [23,24,25,26,27,28],
  excessive_lean:    [11,12,23,24],
  hip_shift:         [23,24],
  hips_sagging:      [23,24,11,12],
  hips_raised:       [23,24,11,12],
  elbows_flaring:    [13,14,15,16],
  elbow_drifting:    [13,14],
  knee_too_forward:  [25,26,27,28],
  hip_rotation:      [23,24],
  insufficient_depth:[25,26,27,28],
};

const LANDMARK_MAP = {
  nose:0,leftEyeInner:1,leftEye:2,leftEyeOuter:3,rightEyeInner:4,rightEye:5,rightEyeOuter:6,
  leftEar:7,rightEar:8,mouthLeft:9,mouthRight:10,
  leftShoulder:11,rightShoulder:12,leftElbow:13,rightElbow:14,leftWrist:15,rightWrist:16,
  leftPinky:17,rightPinky:18,leftIndex:19,rightIndex:20,leftThumb:21,rightThumb:22,
  leftHip:23,rightHip:24,leftKnee:25,rightKnee:26,leftAnkle:27,rightAnkle:28,
  leftHeel:29,rightHeel:30,leftFootIndex:31,rightFootIndex:32
};

// Joint annotations per exercise: [pointA_idx, vertex_idx, pointC_idx, label, goodRange]
const ANGLE_ANNOTATIONS = {
  squat:          [[23,25,27,'L Knee',[80,110]], [24,26,28,'R Knee',[80,110]], [27,23,11,'Back',[60,90]]],
  lunge:          [[23,25,27,'F Knee',[80,110]], [24,26,28,'B Knee',[120,170]]],
  pushup:         [[11,13,15,'L Elbow',[60,100]], [12,14,16,'R Elbow',[60,100]]],
  plank:          [[11,23,27,'L Spine',[165,190]], [12,24,28,'R Spine',[165,190]]],
  bicep_curl:     [[11,13,15,'L Elbow',[30,65]], [12,14,16,'R Elbow',[30,65]]],
  shoulder_press: [[11,13,15,'L Elbow',[150,180]], [12,14,16,'R Elbow',[150,180]]],
  situp:          [[27,23,11,'Torso',[30,90]]],
  jumping_jack:   [[23,11,13,'L Arm',[120,180]], [24,12,14,'R Arm',[120,180]]],
  jump_squat:     [[23,25,27,'L Knee',[80,110]], [24,26,28,'R Knee',[80,110]]],
};

function getSegmentColor(start, end, badIdx) {
  if (badIdx.has(start) || badIdx.has(end)) return 'rgba(255,60,60,0.95)';
  if (start <= 10 || end <= 10) return 'rgba(250,200,80,0.85)';
  if (start <= 16 || end <= 16) return 'rgba(80,160,255,0.9)';
  if (start <= 24 || end <= 24) return 'rgba(130,220,130,0.9)';
  return 'rgba(255,100,100,0.85)';
}

function drawMirroredText(ctx, text, x, y, w, opts = {}) {
  ctx.save();
  ctx.scale(-1, 1);
  ctx.translate(-w, 0);
  ctx.font = opts.font || 'bold 12px Arial';
  ctx.fillStyle = opts.color || '#fff';
  ctx.textAlign = opts.align || 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 4;
  ctx.fillText(text, w - x, y);
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawAngleArc(ctx, rawLandmarks, a, b, c, label, goodRange, w, h) {
  const lmA = rawLandmarks[a];
  const lmB = rawLandmarks[b];
  const lmC = rawLandmarks[c];
  if (!lmA || !lmB || !lmC) return;
  if ((lmA.visibility ?? 1) < 0.35 || (lmB.visibility ?? 1) < 0.35 || (lmC.visibility ?? 1) < 0.35) return;

  const bx = lmB.x * w, by = lmB.y * h;
  const ax = lmA.x * w, ay = lmA.y * h;
  const cx = lmC.x * w, cy = lmC.y * h;

  const ang1 = Math.atan2(ay - by, ax - bx);
  const ang2 = Math.atan2(cy - by, cx - bx);

  // Calculate actual angle
  const rad = Math.atan2(lmC.y - lmB.y, lmC.x - lmB.x) - Math.atan2(lmA.y - lmB.y, lmA.x - lmB.x);
  let angle = Math.abs(rad * 180 / Math.PI);
  if (angle > 180) angle = 360 - angle;
  angle = Math.round(angle);

  const inGoodRange = goodRange && angle >= goodRange[0] && angle <= goodRange[1];
  const arcColor = inGoodRange ? 'rgba(80,220,120,0.9)' : 'rgba(255,100,60,0.9)';

  const radius = 28;

  // Arc
  ctx.beginPath();
  ctx.strokeStyle = arcColor;
  ctx.lineWidth = 3;
  ctx.arc(bx, by, radius, ang1, ang2);
  ctx.stroke();

  // Dot at vertex
  ctx.beginPath();
  ctx.fillStyle = arcColor;
  ctx.arc(bx, by, 5, 0, 2 * Math.PI);
  ctx.fill();

  // Angle value pill
  const midAng = (ang1 + ang2) / 2;
  const lx = bx + (radius + 22) * Math.cos(midAng);
  const ly = by + (radius + 22) * Math.sin(midAng);

  // Background pill
  ctx.save();
  ctx.scale(-1, 1);
  ctx.translate(-w, 0);
  const mx = w - lx;
  const pillW = 44, pillH = 18, pillR = 9;
  ctx.beginPath();
  ctx.roundRect(mx - pillW/2, ly - pillH/2, pillW, pillH, pillR);
  ctx.fillStyle = inGoodRange ? 'rgba(20,140,70,0.85)' : 'rgba(180,40,20,0.85)';
  ctx.fill();
  ctx.font = 'bold 11px Arial';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 2;
  ctx.fillText(`${angle}°`, mx, ly + 4);
  ctx.shadowBlur = 0;
  ctx.restore();
}

export default function PoseDetector({ onPoseDetected, isActive, feedback, exerciseId }) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const poseRef   = useRef(null);
  const cameraRef = useRef(null);
  const feedbackRef = useRef(feedback);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState(null);

  // Keep feedback ref in sync without re-running main effect
  useEffect(() => { feedbackRef.current = feedback; }, [feedback]);

  useEffect(() => {
    if (!isActive) return;

    const onResults = (results) => {
      if (!canvasRef.current || !videoRef.current) return;
      const canvas = canvasRef.current;
      const ctx    = canvas.getContext('2d');
      canvas.width  = videoRef.current.videoWidth  || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const w = canvas.width, h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(results.image, 0, 0, w, h);

      if (results.poseLandmarks) {
        const fb = feedbackRef.current;

        // Build set of "bad" landmark indices from current issues
        const badIdx = new Set();
        if (fb?.issues) {
          fb.issues.forEach(issue => {
            const affected = ISSUE_LANDMARKS[issue] || [];
            affected.forEach(i => badIdx.add(i));
          });
        }

        drawSkeleton(ctx, results.poseLandmarks, w, h, badIdx);

        // Draw angle annotations for the current exercise
        const exKey = exerciseId || 'squat';
        const annotations = ANGLE_ANNOTATIONS[exKey] || ANGLE_ANNOTATIONS.squat;
        if (annotations) {
          annotations.forEach(([a, b, c, label, goodRange]) => {
            drawAngleArc(ctx, results.poseLandmarks, a, b, c, label, goodRange, w, h);
          });
        }

        // On-canvas coaching text overlay
        if (fb?.message) {
          const msg = fb.message;
          const px = w / 2, py = h - 22;
          ctx.save();
          ctx.scale(-1, 1);
          ctx.translate(-w, 0);
          const tw = w - 32;
          ctx.beginPath();
          ctx.roundRect(w - px - tw/2, py - 14, tw, 28, 8);
          const hasHighIssue = fb?.issues?.some(k => fb?.issueDetails?.[k]?.severity === 'high');
          ctx.fillStyle = hasHighIssue ? 'rgba(180,30,30,0.85)' : fb?.issues?.length === 0 ? 'rgba(20,140,70,0.85)' : 'rgba(20,20,60,0.80)';
          ctx.fill();
          ctx.font = 'bold 13px Arial';
          ctx.fillStyle = '#fff';
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0,0,0,0.6)';
          ctx.shadowBlur = 4;
          ctx.fillText(msg.length > 60 ? msg.slice(0, 57) + '…' : msg, w - px, py + 5);
          ctx.shadowBlur = 0;
          ctx.restore();
        }

        // Build named landmark object
        const named = {};
        for (const [key, idx] of Object.entries(LANDMARK_MAP)) {
          named[key] = results.poseLandmarks[idx];
        }
        onPoseDetected?.(named);
      }
    };

    const initializePose = async () => {
      try {
        const pose = new Pose({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });
        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        pose.onResults(onResults);
        poseRef.current = pose;

        if (videoRef.current) {
          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (poseRef.current && videoRef.current) {
                await poseRef.current.send({ image: videoRef.current });
              }
            },
            width: 640,
            height: 480
          });
          await camera.start();
          cameraRef.current = camera;
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Pose init error:', err);
        setError('Failed to start camera. Please allow camera access and reload.');
        setIsLoading(false);
      }
    };

    initializePose();
    return () => {
      cameraRef.current?.stop();
      poseRef.current?.close();
    };
  }, [isActive]);

  const drawSkeleton = (ctx, landmarks, w, h, badIdx) => {
    SKELETON_CONNECTIONS.forEach(([s, e]) => {
      const p1 = landmarks[s], p2 = landmarks[e];
      if (!p1 || !p2) return;
      if ((p1.visibility ?? 1) < 0.3 || (p2.visibility ?? 1) < 0.3) return;
      const color = getSegmentColor(s, e, badIdx);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth   = badIdx.has(s) || badIdx.has(e) ? 4 : 3;
      ctx.shadowColor = color;
      ctx.shadowBlur  = badIdx.has(s) || badIdx.has(e) ? 8 : 4;
      ctx.moveTo(p1.x * w, p1.y * h);
      ctx.lineTo(p2.x * w, p2.y * h);
      ctx.stroke();
    });
    ctx.shadowBlur = 0;

    landmarks.forEach((lm, idx) => {
      if ((lm.visibility ?? 1) < 0.3) return;
      const isBad = badIdx.has(idx);
      ctx.beginPath();
      ctx.fillStyle = isBad ? 'rgba(255,60,60,1)' : getSegmentColor(idx, idx, badIdx);
      ctx.arc(lm.x * w, lm.y * h, isBad ? 5 : 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  if (error) {
    return (
      <div className="w-full h-96 bg-red-50 rounded-lg flex items-center justify-center p-4 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 rounded-lg z-10 gap-3">
          <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-300 text-sm">Loading pose detection…</p>
        </div>
      )}
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg shadow-lg"
        style={{ transform: 'scaleX(-1)' }}
      />
    </div>
  );
}