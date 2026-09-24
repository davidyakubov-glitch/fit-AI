const RU_EXERCISES = {
  squat: {
    name: 'Приседание с собственным весом',
    description: 'Базовое упражнение для ног: квадрицепсы, задняя поверхность бедра и ягодицы.',
    cameraAngle: 'сбоку или под небольшим углом, всё тело должно быть видно',
  },
  lunge: {
    name: 'Выпад вперёд',
    description: 'Упражнение на одну ногу для баланса и силы ног.',
    cameraAngle: 'вид сбоку, всё тело должно быть видно',
  },
  push_up: {
    name: 'Отжимание',
    description: 'Классическое жимовое упражнение для груди, плеч и трицепсов.',
    cameraAngle: 'вид сбоку, тело горизонтально и полностью видно',
  },
  plank: {
    name: 'Планка',
    description: 'Изометрическое упражнение для кора, стабильности и контроля корпуса.',
    cameraAngle: 'вид сбоку, тело горизонтально и полностью видно',
  },
  sit_up: {
    name: 'Скручивание / подъём корпуса',
    description: 'Упражнение на сгибание корпуса для прямой мышцы живота.',
    cameraAngle: 'вид сбоку, должны быть видны корпус и ноги',
  },
  glute_bridge: {
    name: 'Ягодичный мостик',
    description: 'Разгибание бедра с акцентом на ягодицы и заднюю поверхность бедра.',
    cameraAngle: 'вид сбоку, положение лёжа, всё тело должно быть видно',
  },
  mountain_climber: {
    name: 'Альпинист',
    description: 'Динамическое кардио-упражнение для кора из положения планки.',
    cameraAngle: 'вид сбоку, всё тело в планке должно быть видно',
  },
  burpee: {
    name: 'Бёрпи',
    description: 'Упражнение на всё тело: присед, планка, отжимание и прыжок.',
    cameraAngle: 'вид сбоку, нужно место, чтобы видеть полный рост',
  },
  jump_squat: {
    name: 'Приседание с прыжком',
    description: 'Плиометрический присед для развития взрывной силы ног.',
    cameraAngle: 'вид сбоку, должно быть видно пространство над головой',
  },
  single_leg_squat: {
    name: 'Приседание на одной ноге',
    description: 'Сложный присед на одну ногу для баланса, силы и мобильности.',
    cameraAngle: 'спереди или под небольшим углом, всё тело должно быть видно',
  },
  barbell_squat: {
    name: 'Приседание со штангой на спине',
    description: 'Ключевое упражнение для низа тела: штанга на верхней части спины, присед до параллели или ниже.',
    cameraAngle: 'вид сбоку, должны быть видны всё тело и стойка',
  },
  deadlift: {
    name: 'Становая тяга',
    description: 'Базовое упражнение для задней цепи: бёдра, ягодицы, разгибатели спины и широчайшие.',
    cameraAngle: 'вид сбоку, должны быть видны всё тело и штанга на полу',
  },
  bench_press: {
    name: 'Жим штанги лёжа',
    description: 'Основное горизонтальное жимовое упражнение для груди, передних дельт и трицепсов.',
    cameraAngle: 'вид сбоку, лёжа на скамье, должна быть видна траектория штанги',
  },
  shoulder_press: {
    name: 'Жим над головой',
    description: 'Вертикальное жимовое упражнение для плеч и верхней части груди.',
    cameraAngle: 'вид сбоку или спереди, должен быть виден весь корпус',
  },
  lat_pulldown: {
    name: 'Тяга верхнего блока',
    description: 'Вертикальная тяга для широчайших мышц спины и бицепсов.',
    cameraAngle: 'спереди или немного сбоку, руки должны быть полностью видны',
  },
  pull_up: {
    name: 'Подтягивание',
    description: 'Вертикальная тяга с собственным весом для спины и бицепсов.',
    cameraAngle: 'сбоку или спереди, всё тело в висе должно быть видно',
  },
  barbell_row: {
    name: 'Тяга штанги в наклоне',
    description: 'Горизонтальная тяга для середины и верха спины, широчайших и бицепсов.',
    cameraAngle: 'вид сбоку, должны быть видны наклон корпуса и штанга',
  },
  leg_press: {
    name: 'Жим ногами',
    description: 'Жимовое упражнение в тренажёре для квадрицепсов и ягодиц.',
    cameraAngle: 'вид сбоку, должны быть видны сиденье тренажёра и ноги',
  },
  leg_curl: {
    name: 'Сгибание ног',
    description: 'Изолирующее упражнение для задней поверхности бедра в тренажёре.',
    cameraAngle: 'вид сбоку, ноги и валик тренажёра должны быть хорошо видны',
  },
  leg_extension: {
    name: 'Разгибание ног',
    description: 'Изолирующее упражнение для квадрицепсов в тренажёре сидя.',
    cameraAngle: 'вид сбоку, сидя, должна быть видна вся нога',
  },
  bicep_curl: {
    name: 'Сгибание рук на бицепс',
    description: 'Классическое сгибание локтя для изоляции бицепса.',
    cameraAngle: 'вид спереди или сбоку, руки должны быть полностью видны',
  },
  tricep_extension: {
    name: 'Разгибание рук на трицепс',
    description: 'Разгибание локтя для изоляции трицепса.',
    cameraAngle: 'вид сбоку, должна быть видна вся рука',
  },
};

const RU_BY_NAME = Object.fromEntries(
  Object.values(RU_EXERCISES).map((exercise) => [exercise.name, exercise.name])
);

const RU_ENGLISH_NAME_MAP = {
  'Bodyweight Squat': RU_EXERCISES.squat.name,
  'Bodyweight Squats': 'Приседания с собственным весом',
  'Forward Lunge': RU_EXERCISES.lunge.name,
  'Push-Up': RU_EXERCISES.push_up.name,
  Plank: RU_EXERCISES.plank.name,
  'Sit-Up / Crunch': RU_EXERCISES.sit_up.name,
  'Glute Bridge': RU_EXERCISES.glute_bridge.name,
  'Glute Bridges': 'Ягодичные мостики',
  'Mountain Climbers': RU_EXERCISES.mountain_climber.name,
  Burpee: RU_EXERCISES.burpee.name,
  'Jump Squat': RU_EXERCISES.jump_squat.name,
  'Jump Squats': 'Приседания с прыжком',
  'Single-Leg Squat (Pistol)': RU_EXERCISES.single_leg_squat.name,
  'Barbell Back Squat': RU_EXERCISES.barbell_squat.name,
  Deadlift: RU_EXERCISES.deadlift.name,
  'Barbell Bench Press': RU_EXERCISES.bench_press.name,
  'Overhead Press': RU_EXERCISES.shoulder_press.name,
  'Lat Pulldown': RU_EXERCISES.lat_pulldown.name,
  'Pull-Up': RU_EXERCISES.pull_up.name,
  'Barbell Row': RU_EXERCISES.barbell_row.name,
  'Leg Press': RU_EXERCISES.leg_press.name,
  'Leg Curl': RU_EXERCISES.leg_curl.name,
  'Leg Extension': RU_EXERCISES.leg_extension.name,
  'Bicep Curl': RU_EXERCISES.bicep_curl.name,
  'Tricep Extension': RU_EXERCISES.tricep_extension.name,
};

export const RU_LABELS = {
  All: 'Все',
  'All Levels': 'Все уровни',
  'All Places': 'Все места',
  'All Locations': 'Все места',
  'All Muscles': 'Все мышцы',
  'Choose Exercise': 'Выберите упражнение',
  'Search exercises...': 'Поиск упражнений...',
  'Search exercises…': 'Поиск упражнений...',
  'No exercises match your filters': 'Нет упражнений по выбранным фильтрам',
  exercises: 'упражнений',
  beginner: 'Новичок',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
  home: 'Дом',
  gym: 'Зал',
  both: 'Дом и зал',
  Legs: 'Ноги',
  Glutes: 'Ягодицы',
  Chest: 'Грудь',
  Back: 'Спина',
  Shoulders: 'Плечи',
  Arms: 'Руки',
  Core: 'Кор',
  'Full Body': 'Всё тело',
  Bodyweight: 'с собственным весом',
  none: 'без оборудования',
  dumbbells: 'гантели',
  barbell: 'штанга',
  'resistance band': 'эспандер',
  'pull-up bar': 'турник',
  bench: 'скамья',
  machine: 'тренажёр',
  'cable machine': 'блочный тренажёр',
  'leg press machine': 'тренажёр для жима ногами',
  'No equipment': 'без оборудования',
};

function isRussian(lang) {
  return String(lang || '').toLowerCase().startsWith('ru');
}

export function translateExerciseName(name, lang) {
  if (!isRussian(lang)) return name;
  return RU_ENGLISH_NAME_MAP[name] || RU_BY_NAME[name] || name;
}

export function translateExerciseValue(value, lang) {
  if (!isRussian(lang)) return value;
  return RU_LABELS[value] || translateExerciseName(value, lang);
}

export function localizeExercise(exercise, lang) {
  if (!exercise || !isRussian(lang)) return exercise;
  const ru = RU_EXERCISES[exercise.id] || {};

  return {
    ...exercise,
    name: ru.name || translateExerciseName(exercise.name, lang),
    description: ru.description || exercise.description,
    cameraAngle: ru.cameraAngle || exercise.cameraAngle,
    muscleGroup: translateExerciseValue(exercise.muscleGroup, lang),
    difficulty: translateExerciseValue(exercise.difficulty, lang),
    location: translateExerciseValue(exercise.location, lang),
    equipment: (exercise.equipment || []).map((item) => translateExerciseValue(item, lang)),
  };
}
