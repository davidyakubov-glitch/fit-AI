import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const TEXT_TRANSLATIONS = {
  'Loading...': 'Загрузка...',
  Loading: 'Загрузка',
  Back: 'Назад',
  Cancel: 'Отмена',
  Save: 'Сохранить',
  Clear: 'Очистить',
  Reset: 'Сбросить',
  Apply: 'Применить',
  Share: 'Поделиться',
  Start: 'Начать',
  Stop: 'Остановить',
  History: 'История',
  Feed: 'Лента',
  Leaderboard: 'Рейтинг',
  Community: 'Сообщество',
  Nutrition: 'Питание',
  Progress: 'Прогресс',
  Settings: 'Настройки',
  Workout: 'Тренировка',
  Workouts: 'Тренировки',
  Exercises: 'Упражнения',
  Achievements: 'Достижения',
  Body: 'Тело',
  Goal: 'Цель',
  Today: 'Сегодня',
  Browse: 'Обзор',

  'AI Fitness Coach': 'AI Фитнес-тренер',
  'Free real-time AI form analysis for everyone': 'Бесплатный AI-анализ техники в реальном времени для всех',
  'Exercise Catalog': 'Каталог упражнений',
  'Workout Plans': 'Планы тренировок',
  'Progress Dashboard': 'Панель прогресса',
  'Referral Program': 'Реферальная программа',
  'Privacy Policy & Terms': 'Политика конфиденциальности и условия',
  'About AI Coach': 'Об AI-тренере',
  'About Your AI Fitness Coach': 'О вашем AI фитнес-тренере',
  'Personalized workout guidance powered by AI': 'Персональные рекомендации для тренировок на базе AI',

  'Search exercises...': 'Поиск упражнений...',
  'All Levels': 'Все уровни',
  'All Places': 'Все места',
  'All': 'Все',
  'Home': 'Дом',
  'Gym': 'Зал',
  'Both': 'Дом и зал',
  Beginner: 'Новичок',
  Intermediate: 'Средний',
  Advanced: 'Продвинутый',
  Legs: 'Ноги',
  Glutes: 'Ягодицы',
  Chest: 'Грудь',
  Shoulders: 'Плечи',
  Arms: 'Руки',
  Core: 'Кор',
  'Full Body': 'Всё тело',
  Bodyweight: 'С собственным весом',
  none: 'без оборудования',
  dumbbells: 'гантели',
  barbell: 'штанга',
  'resistance band': 'эспандер',
  'pull-up bar': 'турник',
  bench: 'скамья',
  machine: 'тренажёр',
  'cable machine': 'блочный тренажёр',
  'leg press machine': 'тренажёр для жима ногами',
  'No equipment': 'Без оборудования',
  'No exercises match your filters': 'Нет упражнений по выбранным фильтрам',
  'No description available.': 'Описание недоступно.',
  Hide: 'Скрыть',
  'Change Exercise': 'Сменить упражнение',
  Overview: 'Обзор',
  Steps: 'Шаги',
  Mistakes: 'Ошибки',
  Tips: 'Советы',
  'Best camera angle': 'Лучший угол камеры',
  Equipment: 'Оборудование',
  'Watch Video Demonstration': 'Смотреть видео-демонстрацию',
  'Video unavailable.': 'Видео недоступно.',
  'Video unavailable': 'Видео недоступно',
  Retry: 'Повторить',
  'Search YouTube': 'Поиск на YouTube',
  'Hide video': 'Скрыть видео',
  'Choose Exercise': 'Выберите упражнение',
  'Search exercises…': 'Поиск упражнений...',
  'All Locations': 'Все места',
  'All Muscles': 'Все мышцы',
  'Watch:': 'Смотреть:',
  'View 3D Skeleton Demo': 'Показать 3D-демо скелета',
  'Switch to 3D demo': 'Переключиться на 3D-демо',
  'Switch to video': 'Переключиться на видео',
  'Loading 3D…': 'Загрузка 3D...',
  'Video unavailable, loading alternative…': 'Видео недоступно, загружаем альтернативу...',
  'Follow each phase in order. The AI camera will track these phases in real time.':
    'Выполняйте фазы по порядку. AI-камера будет отслеживать их в реальном времени.',
  'Our AI camera will detect and alert you to these issues in real time.':
    'AI-камера будет находить эти ошибки и предупреждать о них в реальном времени.',
  'No common mistakes listed.': 'Типичные ошибки не указаны.',
  'No tips available.': 'Советы недоступны.',
  'Knee angle:': 'Угол колена:',
  'Elbow angle:': 'Угол локтя:',
  'Hip angle:': 'Угол таза:',

  'Bodyweight Squat': 'Приседание с собственным весом',
  'Forward Lunge': 'Выпад вперёд',
  'Push-Up': 'Отжимание',
  Plank: 'Планка',
  'Sit-Up / Crunch': 'Скручивание / подъём корпуса',
  'Glute Bridge': 'Ягодичный мостик',
  'Mountain Climbers': 'Альпинист',
  Burpee: 'Бёрпи',
  'Jump Squat': 'Прыжковый присед',
  'Single-Leg Squat (Pistol)': 'Присед на одной ноге (пистолетик)',
  'Barbell Back Squat': 'Присед со штангой на спине',
  Deadlift: 'Становая тяга',
  'Barbell Bench Press': 'Жим штанги лёжа',
  'Overhead Press': 'Жим над головой',
  'Lat Pulldown': 'Тяга верхнего блока',
  'Pull-Up': 'Подтягивание',
  'Barbell Row': 'Тяга штанги в наклоне',
  'Leg Press': 'Жим ногами',
  'Leg Curl': 'Сгибание ног',
  'Leg Extension': 'Разгибание ног',
  'Bicep Curl': 'Сгибание на бицепс',
  'Tricep Extension': 'Разгибание на трицепс',

  'Fundamental lower-body movement targeting quads, hamstrings and glutes.':
    'Базовое упражнение для нижней части тела: квадрицепсы, задняя поверхность бедра и ягодицы.',
  'Unilateral lower-body exercise improving balance and leg strength.':
    'Упражнение на одну ногу, развивающее баланс и силу ног.',
  'Classic upper-body pressing movement targeting chest, shoulders and triceps.':
    'Классическое жимовое упражнение для груди, плеч и трицепсов.',
  'Isometric core exercise building stability and anti-extension strength.':
    'Изометрическое упражнение для кора, развивающее стабильность и контроль корпуса.',
  'Core flexion exercise targeting the rectus abdominis.':
    'Упражнение на сгибание корпуса для прямой мышцы живота.',
  'Hip extension exercise isolating the glutes and hamstrings.':
    'Упражнение на разгибание бедра для ягодиц и задней поверхности бедра.',
  'Dynamic cardio + core exercise performed in plank position.':
    'Динамическое кардио-упражнение для кора из положения планки.',
  'Full-body conditioning exercise combining squat, plank, push-up and jump.':
    'Упражнение на всё тело, объединяющее присед, планку, отжимание и прыжок.',
  'Plyometric squat developing explosive leg power.':
    'Плиометрический присед для развития взрывной силы ног.',
  'Unilateral squat demanding balance, strength and mobility.':
    'Присед на одной ноге, требующий баланса, силы и подвижности.',
  'King of lower-body exercises. Barbell on upper traps, squat to parallel or below.':
    'Король упражнений для низа тела. Штанга на верхней части спины, присед до параллели или ниже.',
  'Posterior chain king — hamstrings, glutes, erectors and lats under load.':
    'Главное упражнение для задней цепи: задняя поверхность бедра, ягодицы, разгибатели спины и широчайшие.',
  'Primary horizontal pressing movement for chest, anterior delts and triceps.':
    'Основное горизонтальное жимовое движение для груди, передних дельт и трицепсов.',
  'Vertical pressing movement targeting deltoids and upper chest.':
    'Вертикальное жимовое движение для дельт и верхней части груди.',
  'Vertical pulling movement targeting latissimus dorsi and biceps.':
    'Вертикальная тяга для широчайших мышц спины и бицепсов.',
  'Bodyweight vertical pulling exercise. Excellent lat and bicep developer.':
    'Вертикальная тяга с собственным весом. Отлично развивает широчайшие и бицепсы.',
  'Horizontal pulling movement for mid/upper back, lats and biceps.':
    'Горизонтальная тяга для средней и верхней части спины, широчайших и бицепсов.',
  'Machine-based quad/glute pressing exercise. Lower injury risk than barbell squat.':
    'Жимовое упражнение в тренажёре для квадрицепсов и ягодиц, с меньшей нагрузкой на спину, чем присед со штангой.',
  'Hamstring isolation exercise on a lying or seated machine.':
    'Изолирующее упражнение для задней поверхности бедра в тренажёре лёжа или сидя.',
  'Quad isolation exercise on a seated machine.':
    'Изолирующее упражнение для квадрицепсов в тренажёре сидя.',
  'Classic elbow flexion exercise isolating the biceps brachii.':
    'Классическое сгибание локтя для изоляции бицепса.',
  'Elbow extension exercise isolating the triceps brachii.':
    'Разгибание локтя для изоляции трицепса.',

  'side or slight angle — full body visible': 'сбоку или под небольшим углом — всё тело видно',
  'side view — full body visible': 'вид сбоку — всё тело видно',
  'side view — full body horizontal': 'вид сбоку — тело горизонтально и полностью видно',
  'side view — torso and legs visible': 'вид сбоку — видны корпус и ноги',
  'side view — lying position, full body visible': 'вид сбоку — положение лёжа, всё тело видно',
  'side view — full body in plank': 'вид сбоку — всё тело в планке',
  'side view — enough space to see full height': 'вид сбоку — достаточно места, чтобы видеть полный рост',
  'side view — enough vertical space visible': 'вид сбоку — достаточно вертикального пространства',
  'front or slight angle — full body visible': 'спереди или под небольшим углом — всё тело видно',
  'side view — full body, rack visible': 'вид сбоку — всё тело и стойка видны',
  'side view — full body, bar on floor visible': 'вид сбоку — всё тело и штанга на полу видны',
  'side view — lying on bench, bar path visible': 'вид сбоку — лёжа на скамье, видна траектория штанги',
  'side or front view — full torso visible': 'вид сбоку или спереди — весь корпус виден',
  'front or slight side view — arms fully visible': 'спереди или немного сбоку — руки полностью видны',
  'side or front view — full hanging body visible': 'вид сбоку или спереди — всё тело в висе видно',
  'side view — hinged position and bar visible': 'вид сбоку — видны наклон корпуса и штанга',
  'side view — machine seat and legs visible': 'вид сбоку — видны сиденье тренажёра и ноги',
  'side view — legs and pad clearly visible': 'вид сбоку — ноги и валик хорошо видны',
  'side view — seated, full leg visible': 'вид сбоку — сидя, вся нога видна',
  'front or side view — full arms visible': 'вид спереди или сбоку — руки полностью видны',
  'side view — full arm visible': 'вид сбоку — вся рука видна',

  'Standing upright, feet shoulder-width apart': 'Стойте прямо, стопы на ширине плеч',
  'Descending — hips hinge back, knees track toes': 'Опускание — таз уходит назад, колени направлены по линии носков',
  'Thighs parallel or below parallel to floor': 'Бёдра параллельны полу или ниже',
  'Driving through heels to rise': 'Подъём через пятки',
  'Full hip and knee extension at top': 'Полное разгибание таза и коленей в верхней точке',
  'Stand tall, feet together': 'Встаньте прямо, стопы вместе',
  'Step forward, lower back knee toward floor': 'Шагните вперёд и опустите заднее колено к полу',
  'Front thigh parallel, back knee near floor': 'Переднее бедро параллельно полу, заднее колено близко к полу',
  'Push through front heel to return': 'Оттолкнитесь передней пяткой, чтобы вернуться',
  'Feet together, standing tall': 'Стопы вместе, корпус прямой',
  'Arms extended, body straight (plank position)': 'Руки выпрямлены, тело ровное как в планке',
  'Lower chest toward floor, elbows 45° from torso': 'Опускайте грудь к полу, локти примерно под 45° к корпусу',
  'Chest near floor, elbows fully bent': 'Грудь близко к полу, локти полностью согнуты',
  'Press up through palms': 'Отожмитесь вверх через ладони',
  'Arms extended, body still straight': 'Руки выпрямлены, тело остаётся ровным',
  'Body forms straight line from head to heels': 'Тело образует прямую линию от головы до пяток',
  'Lying flat, knees bent ~90°': 'Лёжа на спине, колени согнуты примерно на 90°',
  'Curl torso toward knees': 'Скручивайте корпус к коленям',
  'Shoulder blades fully off floor': 'Лопатки полностью оторваны от пола',
  'Lower back down with control': 'Опускайтесь вниз подконтрольно',
  'Lying on back, knees bent, feet flat': 'Лёжа на спине, колени согнуты, стопы на полу',
  'Drive hips up, squeezing glutes': 'Поднимайте таз вверх, сжимая ягодицы',
  'Hips fully extended — shoulder-hip-knee line': 'Таз полностью разогнут — плечо, таз и колено на одной линии',
  'Lower hips back to floor': 'Опустите таз обратно к полу',
  'Arms extended, body straight': 'Руки выпрямлены, тело ровное',
  'Left knee drives toward chest': 'Левое колено движется к груди',
  'Left leg returns': 'Левая нога возвращается назад',
  'Right knee drives toward chest': 'Правое колено движется к груди',
  'Standing upright': 'Стойте прямо',
  'Hinge to squat, hands to floor': 'Наклонитесь в присед, руки к полу',
  'Jump or step feet back to plank': 'Прыгните или шагните ногами назад в планку',
  'Optional: perform a push-up': 'По желанию выполните отжимание',
  'Jump or step feet to hands': 'Прыгните или шагните ногами к рукам',
  'Explosive jump with arms overhead': 'Взрывной прыжок с руками над головой',
  'Standing, feet shoulder-width': 'Стойте, стопы на ширине плеч',
  'Rapid squat down, loading energy': 'Быстро опуститесь в присед, накапливая энергию',
  'Explosive drive through floor': 'Взрывное отталкивание от пола',
  'Full body off the ground': 'Всё тело отрывается от земли',
  'Soft landing, absorb through ankles-knees-hips': 'Мягкая посадка, амортизируйте через голеностоп, колени и таз',
  'Standing on one leg, other extended forward': 'Стойте на одной ноге, вторую вытяните вперёд',
  'Lower on stance leg, keep extended leg up': 'Опускайтесь на опорной ноге, вторую держите поднятой',
  'Stance knee at max flexion, balanced': 'Опорное колено максимально согнуто, баланс сохранён',
  'Drive back up through stance heel': 'Поднимайтесь через пятку опорной ноги',
  'Lift bar from rack, step back, brace': 'Снимите штангу со стоек, шагните назад и напрягите корпус',
  'Standing with bar, braced': 'Стойте со штангой, корпус напряжён',
  'Hips back and down, knees track toes': 'Таз назад и вниз, колени по линии носков',
  'At or below parallel': 'На уровне параллели или ниже',
  'Drive through floor, hips and chest rise together': 'Давите в пол, таз и грудь поднимаются вместе',
  'Full extension': 'Полное разгибание',
  'Bar over mid-foot, hip-width stance, neutral spine': 'Штанга над серединой стопы, стойка на ширине таза, спина нейтральная',
  'Push floor away, bar stays close to body, hips and shoulders rise together':
    'Толкайте пол от себя, штанга идёт близко к телу, таз и плечи поднимаются вместе',
  'Full hip and knee extension, shoulders behind bar': 'Полное разгибание таза и коленей, плечи за линией штанги',
  'Hinge at hips first, then bend knees as bar passes knees':
    'Сначала сгибайтесь в тазу, затем сгибайте колени, когда штанга проходит их уровень',
  'Arch, retract scapula, feet flat, bar over lower chest':
    'Прогнитесь, сведите лопатки, стопы на полу, штанга над нижней частью груди',
  "Bar over chest at arm's length": 'Штанга над грудью на выпрямленных руках',
  'Lower bar to lower chest, elbows ~45-75° from torso':
    'Опускайте штангу к нижней части груди, локти примерно 45-75° от корпуса',
  'Bar touches chest — no bounce': 'Штанга касается груди — без отбива',
  'Press to lockout, bar travels slight arc': 'Жмите до выпрямления, штанга движется по небольшой дуге',
  'Arms locked out, bar over lower chest': 'Руки выпрямлены, штанга над нижней частью груди',
  'Bar at clavicle height, elbows slightly forward': 'Штанга на уровне ключиц, локти немного вперёд',
  'Press bar vertically over base of skull': 'Жмите штангу вертикально над основанием черепа',
  'Arms locked, bar stacked over hips': 'Руки выпрямлены, штанга над тазом',
  'Lower bar back to clavicle level': 'Опустите штангу обратно к ключицам',
  'Arms extended overhead, slight lean back': 'Руки выпрямлены над головой, лёгкий наклон назад',
  'Pull bar to upper chest, elbows drive down': 'Тяните рукоять к верхней части груди, локти вниз',
  'Bar at upper chest, elbows at sides': 'Рукоять у верхней части груди, локти у корпуса',
  "Control bar back to start — don't let it pull you": 'Верните рукоять подконтрольно — не позволяйте ей тянуть вас',
  'Full hang, arms extended, shoulders packed': 'Полный вис, руки выпрямлены, плечи собраны',
  'Pull chest toward bar, elbows drive down': 'Тяните грудь к перекладине, локти вниз',
  'Chin or chest above bar': 'Подбородок или грудь выше перекладины',
  'Slow controlled descent to dead hang': 'Медленный контролируемый спуск в полный вис',
  'Hip hinge ~45°, bar hanging, neutral spine': 'Наклон корпуса примерно 45°, штанга висит, спина нейтральная',
  'Row bar toward lower chest, elbows drive back': 'Тяните штангу к нижней части груди, локти назад',
  'Bar touches lower ribcage, elbows behind torso': 'Штанга касается нижних рёбер, локти за корпусом',
  'Lower bar under control, maintain hinge': 'Опускайте штангу подконтрольно, сохраняйте наклон',
  'Legs extended, feet hip-width on platform': 'Ноги выпрямлены, стопы на платформе на ширине таза',
  'Lower platform toward chest': 'Опускайте платформу к груди',
  'Knees near chest, lower back stays on seat': 'Колени близко к груди, поясница прижата к сиденью',
  'Press platform away through full extension': 'Выжимайте платформу до полного разгибания',
  'Legs extended — do not lock knees fully': 'Ноги выпрямлены — не блокируйте колени полностью',
  'Legs extended on pad': 'Ноги выпрямлены на валике',
  'Curl heels toward glutes': 'Сгибайте ноги, направляя пятки к ягодицам',
  'Heels near glutes': 'Пятки близко к ягодицам',
  'Slow controlled extension': 'Медленное контролируемое разгибание',
  'Seated, knees at ~90°': 'Сидя, колени примерно под 90°',
  'Extend legs to near full extension': 'Разгибайте ноги почти полностью',
  'Quads fully contracted': 'Квадрицепсы полностью сокращены',
  'Controlled return to start': 'Контролируемое возвращение в исходное положение',
  'Arms hanging, palms forward': 'Руки опущены, ладони вперёд',
  'Curl weight toward shoulders': 'Сгибайте вес к плечам',
  'Peak contraction, squeeze bicep': 'Пиковое сокращение, сожмите бицепс',
  'Lower with control to full extension': 'Опускайте подконтрольно до полного разгибания',
  'Elbows bent, upper arms stationary': 'Локти согнуты, плечи неподвижны',
  'Controlled bend toward full flexion': 'Контролируемое сгибание до полной амплитуды',
  'Extend arms fully': 'Полностью разгибайте руки',
  'Arms straight, triceps contracted': 'Руки прямые, трицепсы сокращены',

  'Keep chest up and core braced': 'Держите грудь выше и напрягайте корпус',
  'Drive knees out over little toes': 'Направляйте колени наружу к мизинцам',
  'Weight through mid-foot and heels': 'Вес держите на середине стопы и пятках',
  'Keep your torso upright': 'Держите корпус вертикально',
  'Front knee tracks over second toe': 'Переднее колено идёт по линии второго пальца стопы',
  'Lower slowly — 2 seconds down': 'Опускайтесь медленно — около 2 секунд',
  'Keep a rigid plank throughout': 'Сохраняйте жёсткую планку всё движение',
  'Elbows at ~45° to your torso': 'Локти примерно под 45° к корпусу',
  'Full range: chest within 5cm of floor': 'Полная амплитуда: грудь в пределах 5 см от пола',
  'Squeeze glutes and abs simultaneously': 'Одновременно напрягайте ягодицы и пресс',
  'Neutral neck — look at floor slightly ahead': 'Шея нейтральна — смотрите в пол немного перед собой',
  "Breathe steadily; don't hold your breath": 'Дышите ровно, не задерживайте дыхание',
  "Cross arms on chest or fingertips behind ears — don't pull": 'Скрестите руки на груди или держите пальцы за ушами — не тяните шею',
  'Exhale on the way up': 'Выдыхайте на подъёме',
  "Control the descent — don't flop down": 'Контролируйте опускание — не падайте вниз',
  'Squeeze glutes hard at the top': 'Сильно сжимайте ягодицы в верхней точке',
  'Push through heels, not toes': 'Толкайтесь пятками, а не носками',
  "Keep ribs down — don't flare them": 'Держите рёбра опущенными, не выпячивайте их',
  'Maintain a tight plank throughout': 'Сохраняйте напряжённую планку всё время',
  'Drive knees toward opposite elbow for oblique activation': 'Тяните колени к противоположному локтю для активации косых мышц',
  'Control speed — quality over pace': 'Контролируйте скорость — качество важнее темпа',
  'Land softly from the jump to protect joints': 'Приземляйтесь мягко, чтобы защитить суставы',
  'Keep core tight throughout all phases': 'Держите корпус напряжённым во всех фазах',
  'Scale by stepping instead of jumping': 'Упростите движение, делая шаги вместо прыжков',
  'Land toe-ball-heel to absorb impact': 'Приземляйтесь носок-подушечка-пятка для амортизации',
  'Keep core tight through the entire rep': 'Держите корпус напряжённым весь повтор',
  'Aim for consistent depth each rep': 'Сохраняйте одинаковую глубину в каждом повторе',
  'Use a wall or TRX for assistance when learning': 'Используйте стену или TRX для помощи при обучении',
  'Keep extended leg straight and at hip height': 'Держите вытянутую ногу прямой на уровне таза',
  'Focus point ahead to maintain balance': 'Смотрите в одну точку впереди для баланса',
  "Brace your core like you're about to be punched": 'Напрягите корпус так, будто ждёте удар',
  'Chest up — bar stays over mid-foot': 'Грудь вверх — штанга остаётся над серединой стопы',
  'Cue: "spread the floor" with your feet': 'Подсказка: «раздвигайте пол» стопами',
  'Neutral spine from setup to lockout': 'Нейтральная спина от старта до фиксации',
  'Pull the bar into your shins — keep it close': 'Тяните штангу к голеням — держите её близко',
  'Think "push the floor away" not "pull the bar up"': 'Думайте «толкнуть пол», а не «поднять штангу»',
  'Retract and depress scapulae before each set': 'Сведите и опустите лопатки перед подходом',
  'Elbows at 45-60° to torso to protect shoulders': 'Локти 45-60° к корпусу, чтобы защитить плечи',
  'Drive feet into floor for leg drive': 'Упирайтесь стопами в пол для помощи ногами',
  'Brace core hard — this protects your spine': 'Сильно напрягайте корпус — это защищает позвоночник',
  'Bar should travel in straight vertical line': 'Штанга должна двигаться по прямой вертикальной линии',
  'At lockout — shrug slightly to pack shoulders': 'В верхней точке слегка пожмите плечами, чтобы стабилизировать их',
  'Lead with elbows — think of them as hooks': 'Ведите движение локтями — представьте, что они крюки',
  'Slight backward lean is fine; avoid excessive swing': 'Лёгкий наклон назад допустим, избегайте сильной раскачки',
  'Squeeze lats at the bottom of the rep': 'Сжимайте широчайшие в нижней точке',
  'Start every rep from a full dead hang': 'Начинайте каждый повтор из полного виса',
  'Pack shoulders before initiating the pull': 'Соберите плечи перед началом тяги',
  'Cross ankles and keep legs straight to reduce swing': 'Скрестите лодыжки и держите ноги прямыми, чтобы уменьшить раскачку',
  'Maintain a neutral spine throughout': 'Сохраняйте нейтральную спину всё время',
  "Drive elbows past torso — don't just lift arms": 'Ведите локти за корпус — не просто поднимайте руки',
  'Squeeze shoulder blades together at the top': 'Сведите лопатки в верхней точке',
  'Never fully lock out your knees at extension': 'Никогда полностью не блокируйте колени при разгибании',
  'Feet higher on platform = more glutes; lower = more quads': 'Стопы выше на платформе — больше ягодиц; ниже — больше квадрицепсов',
  'Keep lower back pressed into the pad': 'Держите поясницу прижатой к спинке',
  'Keep hips pressed into the pad': 'Держите таз прижатым к подушке',
  "Control the eccentric — don't let weight crash": 'Контролируйте негативную фазу — не бросайте вес',
  'Full range: heels as close to glutes as possible': 'Полная амплитуда: пятки как можно ближе к ягодицам',
  'Slow eccentric (3-4 seconds) for better quad stimulus': 'Медленная негативная фаза 3-4 секунды лучше нагружает квадрицепсы',
  'Pause and squeeze at the top': 'Сделайте паузу и сожмите мышцы вверху',
  'Toes slightly up to increase VMO activation': 'Носки немного вверх, чтобы сильнее включить медиальную часть квадрицепса',
  'Keep elbows pinned to sides throughout': 'Держите локти прижатыми к корпусу всё движение',
  'Supinate (rotate) wrist at the top for peak contraction': 'Супинируйте кисть вверху для пикового сокращения',
  'Slow eccentric = more muscle stimulus': 'Медленная негативная фаза = больше мышечного стимула',
  'Keep upper arms perpendicular to floor': 'Держите плечи перпендикулярно полу',
  'Only your forearms should move': 'Двигаться должны только предплечья',
  'Squeeze triceps hard at full extension': 'Сильно сжимайте трицепс при полном разгибании',

  start: 'старт',
  eccentric: 'опускание',
  bottom: 'нижняя точка',
  concentric: 'подъём',
  lockout: 'фиксация',
  step: 'шаг',
  'push back': 'возврат',
  hold: 'удержание',
  top: 'верхняя точка',
  plank: 'планка',
  'drive left': 'левое колено вперёд',
  'extend left': 'левая нога назад',
  'drive right': 'правое колено вперёд',
  stand: 'стойка',
  'squat down': 'присед вниз',
  'push up': 'отжимание',
  'jump in': 'прыжок к рукам',
  'jump up': 'прыжок вверх',
  launch: 'отталкивание',
  airborne: 'полёт',
  landing: 'приземление',
  unrack: 'снятие со стоек',
  setup: 'подготовка',
  pull: 'тяга',
  touch: 'касание',
  rack: 'исходная стойка',
  press: 'жим',
  'dead hang': 'полный вис',
  peak: 'пиковое сокращение',

  'Knees collapse inward (valgus)': 'Колени заваливаются внутрь (вальгус)',
  'Heels rise off the floor': 'Пятки отрываются от пола',
  'Squat not reaching parallel': 'Присед не доходит до параллели',
  'Torso leans too far forward': 'Корпус слишком сильно наклоняется вперёд',
  'Hips shift laterally': 'Таз смещается в сторону',
  'One leg leads the movement': 'Одна нога опережает движение',
  'Feet too close together': 'Стопы стоят слишком близко',
  'Front knee collapses inward': 'Переднее колено заваливается внутрь',
  'Front knee extends far past toes': 'Переднее колено слишком далеко выходит за носок',
  'Torso leans forward excessively': 'Корпус чрезмерно наклоняется вперёд',
  'Back knee not near floor': 'Заднее колено не опускается близко к полу',
  'Hip drops to one side': 'Таз проседает в одну сторону',
  'Hips drop below straight line': 'Таз опускается ниже прямой линии тела',
  'Hips rise above straight line': 'Таз поднимается выше прямой линии тела',
  'Elbows flare > 90° from torso': 'Локти уходят в стороны более чем на 90° от корпуса',
  'Head droops / chin juts forward': 'Голова опускается или подбородок уходит вперёд',
  'Chest does not reach near floor': 'Грудь не опускается достаточно близко к полу',
  'Hips drop': 'Таз провисает',
  'Hips rise above shoulders': 'Таз поднимается выше плеч',
  'Head drops toward floor': 'Голова опускается к полу',
  'Hands pulling on neck': 'Руки тянут шею',
  'Feet lift off floor': 'Стопы отрываются от пола',
  'Shoulder blades stay on floor': 'Лопатки остаются на полу',
  'Knees fall inward at top': 'Колени заваливаются внутрь в верхней точке',
  'Hips not fully extended at top': 'Таз не полностью разогнут в верхней точке',
  'Lower back arches excessively': 'Поясница чрезмерно прогибается',
  'Hips pike up during climbers': 'Таз поднимается вверх во время альпиниста',
  'Hips sag below straight line': 'Таз провисает ниже прямой линии',
  'Knee not reaching chest': 'Колено не доходит до груди',
  'Hips sag in plank phase': 'Таз провисает в фазе планки',
  'Jump phase missing / minimal': 'Фаза прыжка отсутствует или слишком слабая',
  'Uncontrolled foot placement': 'Неконтролируемая постановка стоп',
  'Knees cave on landing': 'Колени заваливаются при приземлении',
  'Landing with locked knees': 'Приземление на заблокированные колени',
  'Squat too shallow before jump': 'Слишком неглубокий присед перед прыжком',
  'Stance knee caves inward': 'Опорное колено заваливается внутрь',
  'Non-stance hip drops': 'Таз со стороны свободной ноги проседает',
  'Excessive forward torso lean': 'Чрезмерный наклон корпуса вперёд',
  'Hips rise faster than shoulders': 'Таз поднимается быстрее плеч',
  'Knee valgus under load': 'Вальгус коленей под нагрузкой',
  'Pelvis posteriorly tilts at bottom': 'Таз подкручивается в нижней точке',
  'Heels rise under load': 'Пятки отрываются под нагрузкой',
  'Above parallel at bottom': 'Нижняя точка выше параллели',
  'Lumbar spine rounds under load': 'Поясница округляется под нагрузкой',
  'Bar swings away from body': 'Штанга уходит от тела',
  'Hips rise before shoulders': 'Таз поднимается раньше плеч',
  'Excessive back arch at lockout': 'Чрезмерный прогиб спины в фиксации',
  'Elbows >75° from torso': 'Локти более 75° от корпуса',
  'Bouncing bar off chest': 'Отбив штанги от груди',
  'Feet leave floor': 'Стопы отрываются от пола',
  'Bar not touching chest': 'Штанга не касается груди',
  'Elbows flare excessively at start': 'Локти чрезмерно расходятся в начале',
  'Excessive lower back arch': 'Чрезмерный прогиб поясницы',
  'Bar drifts forward on way up': 'Штанга уходит вперёд при подъёме',
  'Swinging torso to assist pull': 'Раскачка корпусом для помощи тяге',
  'Bar not reaching chest': 'Рукоять не доходит до груди',
  'Elbows flare forward vs down': 'Локти уходят вперёд вместо движения вниз',
  'Using hip swing for momentum': 'Раскачка тазом для инерции',
  'Arms not fully extending at bottom': 'Руки не полностью выпрямляются внизу',
  'Chin does not clear bar': 'Подбородок не поднимается выше перекладины',
  'Spine rounds during row': 'Спина округляется во время тяги',
  'Using momentum to row': 'Тяга за счёт инерции',
  'Bar pulled to upper chest (bicep row)': 'Штанга тянется к верхней груди, превращаясь в тягу бицепсом',
  'Lower back / butt lifts off seat': 'Поясница или таз отрываются от сиденья',
  'Knees track inward': 'Колени уходят внутрь',
  'Full knee lockout at top': 'Полная блокировка коленей в верхней точке',
  'Hips rise off pad during curl': 'Таз отрывается от подушки во время сгибания',
  'Heels not reaching near glutes': 'Пятки не доходят близко к ягодицам',
  'Using swing to extend': 'Разгибание за счёт раскачки',
  'Not reaching full extension': 'Нет полного разгибания',
  'Elbows swing forward': 'Локти уходят вперёд',
  'Using back swing for momentum': 'Раскачка спиной для инерции',
  'Not fully extending at bottom': 'Нет полного разгибания внизу',
  'Elbows splay outward': 'Локти расходятся наружу',
  'Upper arm swings instead of staying still': 'Плечо движется вместо того, чтобы оставаться неподвижным',
  'Arms not fully extending': 'Руки не полностью разгибаются',

  'knee width < hip width during descent': 'ширина коленей меньше ширины таза при опускании',
  'ankle angle change > 15°': 'изменение угла голеностопа больше 15°',
  'knee angle > 100° at bottom': 'угол колена больше 100° в нижней точке',
  'shoulder-hip-ankle angle > 50°': 'угол плечо-таз-голеностоп больше 50°',
  'left/right hip asymmetry > 10px': 'асимметрия таза слева/справа больше 10px',
  'knee angle difference L/R > 15°': 'разница угла коленей слева/справа больше 15°',
  'ankle width < 0.6× shoulder width': 'ширина голеностопов меньше 0.6 ширины плеч',
  'front knee x < front ankle x': 'переднее колено смещается внутрь относительно голеностопа',
  'knee x > ankle x + threshold': 'колено выходит за голеностоп сильнее допустимого',
  'shoulder-hip vertical angle > 20°': 'вертикальный угол плечо-таз больше 20°',
  'back knee y not close to ground': 'заднее колено недостаточно близко к полу',
  'hip landmark height asymmetry > 15px': 'асимметрия высоты таза больше 15px',
  'hip y > shoulder y + threshold': 'таз ниже линии плеч больше допустимого',
  'hip y < shoulder y - threshold': 'таз выше линии плеч больше допустимого',
  'elbow-shoulder-hip angle > 80°': 'угол локоть-плечо-таз больше 80°',
  'shoulder-ear alignment deviation': 'отклонение линии плечо-ухо',
  'shoulder y not near floor level': 'плечо не приближается к уровню пола',
  'hip y > shoulder y + 15px': 'таз ниже плеч больше чем на 15px',
  'hip y < shoulder y - 15px': 'таз выше плеч больше чем на 15px',
  'ear y > shoulder y + 20px': 'ухо ниже плеча больше чем на 20px',
  'wrist near ear during ascent': 'кисть близко к уху во время подъёма',
  'ankle y rises during movement': 'голеностоп поднимается во время движения',
  'shoulder y not rising sufficiently': 'плечо поднимается недостаточно',
  'knee width < ankle width': 'ширина коленей меньше ширины голеностопов',
  'hip angle < 150°': 'угол таза меньше 150°',
  'hip rises above shoulder-knee line': 'таз поднимается выше линии плечо-колено',
  'hip y above shoulder y': 'таз выше плеч',
  'hip y below shoulder y + threshold': 'таз ниже линии плеч больше допустимого',
  'knee x not reaching wrist x': 'колено не доходит до уровня запястья',
  'body height at jump < threshold': 'высота тела в прыжке ниже допустимой',
  'rapid unexpected landmark shift': 'быстрое неожиданное смещение точек тела',
  'knee width < ankle width at landing': 'ширина коленей меньше ширины голеностопов при приземлении',
  'knee angle > 160° on landing impact': 'угол колена больше 160° при приземлении',
  'min knee angle > 110° in eccentric': 'минимальный угол колена больше 110° при опускании',
  'knee x deviation from ankle': 'отклонение колена от линии голеностопа',
  'hip height asymmetry': 'асимметрия высоты таза',
  'hip ascent rate > shoulder ascent rate': 'таз поднимается быстрее плеч',
  'knee width < hip width': 'ширина коленей меньше ширины таза',
  'lumbar curve reversal': 'изменение изгиба поясницы',
  'ankle angle change': 'изменение угла голеностопа',
  'shoulder-hip-ankle angle deviation': 'отклонение угла плечо-таз-голеностоп',
  'wrist x vs ankle x separation': 'запястье уходит от линии голеностопа',
  'lumbar hyperextension angle': 'угол чрезмерного прогиба поясницы',
  'elbow-shoulder angle': 'угол локоть-плечо',
  'sudden velocity spike at touch': 'резкий скачок скорости при касании',
  'ankle landmark rises': 'точка голеностопа поднимается',
  'wrist not reaching chest level': 'запястье не доходит до уровня груди',
  'elbow position behind bar': 'локоть находится позади штанги',
  'hip-shoulder angle > 15°': 'угол таз-плечо больше 15°',
  'wrist x deviation from shoulder x': 'запястье отклоняется от линии плеча',
  'shoulder x oscillation > threshold': 'раскачка плеч больше допустимого',
  'wrist y not reaching shoulder y': 'запястье не доходит до уровня плеча',
  'elbow x deviation': 'отклонение локтя',
  'hip x oscillation': 'раскачка таза',
  'elbow angle < 150° at bottom': 'угол локтя меньше 150° в нижней точке',
  'wrist y vs chin y': 'соотношение высоты запястья и подбородка',
  'shoulder-hip angle deviation': 'отклонение угла плечо-таз',
  'sudden velocity spike': 'резкий скачок скорости',
  'wrist reaching too high': 'запястье поднимается слишком высоко',
  'hip y changes on seat': 'таз смещается на сиденье',
  'knee angle > 175°': 'угол колена больше 175°',
  'hip y rises significantly': 'таз заметно поднимается',
  'knee angle > 100° at peak': 'угол колена больше 100° в пиковой точке',
  'velocity spike at start': 'скачок скорости в начале',
  'knee angle < 150° at peak': 'угол колена меньше 150° в пиковой точке',
  'elbow x moves ahead of shoulder x': 'локоть уходит вперёд относительно плеча',
  'shoulder x oscillation': 'раскачка плеч',
  'elbow x > shoulder x': 'локоть уходит наружу относительно плеча',
  'elbow y movement > threshold': 'вертикальное движение локтя больше допустимого',
  'elbow angle < 150° at lockout': 'угол локтя меньше 150° в фиксации',

  'Generate AI Workout (Free)': 'Создать AI-тренировку бесплатно',
  'Current Workout:': 'Текущая тренировка:',
  'Start Free Workout': 'Начать бесплатную тренировку',
  'Stop & Save': 'Остановить и сохранить',
  'Saving...': 'Сохранение...',
  'Camera Feed': 'Камера',
  'AI Vision Ready': 'AI-зрение готово',
  'AI form analysis is active and free for all users.': 'AI-анализ техники активен и бесплатен для всех пользователей.',
  'Activate Free AI Analysis': 'Активировать бесплатный AI-анализ',
  'Real-time Feedback': 'Обратная связь в реальном времени',
  'Start your workout to see feedback': 'Начните тренировку, чтобы увидеть подсказки',
  'Great rep!': 'Отличное повторение!',
  'Current exercise': 'Текущее упражнение',
  clean: 'чисто',
  'Starting camera...': 'Запуск камеры...',
  'Camera paused': 'Камера на паузе',
  'Camera ready': 'Камера готова',
  'Tracking body': 'Тело отслеживается',
  'No body detected': 'Тело не найдено',
  'How to Use': 'Как пользоваться',
  'Select your exercise from the picker above': 'Выберите упражнение выше',
  'Allow camera access when prompted': 'Разрешите доступ к камере, когда появится запрос',
  'Click "Start Free Workout" and begin moving': 'Нажмите «Начать бесплатную тренировку» и начните движение',
  'Follow real-time feedback to improve form': 'Следуйте подсказкам в реальном времени, чтобы улучшать технику',
  'Click "Stop & Save" to record your session': 'Нажмите «Остановить и сохранить», чтобы записать занятие',
  'Form Tips:': 'Советы по технике:',

  'Choose a preset, generate with AI, or start your session': 'Выберите готовый план, создайте AI-план или начните занятие',
  'Ready to go': 'Готово к старту',
  'Browse Plans': 'Готовые планы',
  'AI Generate': 'AI-генерация',
  'No completed workouts yet': 'Завершённых тренировок пока нет',
  'Complete a plan to see your history here': 'Завершите план, чтобы увидеть историю здесь',
  'Workout cancelled': 'Тренировка отменена',
  'selected! Ready to start.': 'выбран! Можно начинать.',

  'Share workouts, compete, and get inspired': 'Делитесь тренировками, соревнуйтесь и вдохновляйтесь',
  'Please sign in to access the Community': 'Войдите, чтобы открыть сообщество',
  Template: 'Шаблон',
  Athlete: 'Атлет',
  'Use Template': 'Использовать шаблон',
  Like: 'Нравится',
  'Share Workout': 'Поделиться тренировкой',
  'Add a caption... (optional)': 'Добавьте подпись... (необязательно)',
  'Who can see this?': 'Кто это увидит?',
  Everyone: 'Все',
  Friends: 'Друзья',
  'Only me': 'Только я',
  Shared: 'Опубликовано',

  'Track your daily food intake': 'Отслеживайте ежедневное питание',
  'Set Goal': 'Задать цель',
  'Log Meal': 'Записать приём пищи',
  Macronutrients: 'Макронутриенты',
  Protein: 'Белки',
  Carbohydrates: 'Углеводы',
  Carbs: 'Углеводы',
  Fat: 'Жиры',
  Breakfast: 'Завтрак',
  Lunch: 'Обед',
  Dinner: 'Ужин',
  Snack: 'Перекус',
  breakfast: 'завтрак',
  lunch: 'обед',
  dinner: 'ужин',
  snack: 'перекус',
  'Daily Calories — Last 7 Days': 'Калории за день — последние 7 дней',
  'Macro Trends': 'Динамика макронутриентов',
  'Recent Meals': 'Недавние приёмы пищи',
  'No meals logged yet': 'Приёмов пищи пока нет',
  Calories: 'Калории',

  'Visualize your fitness journey over time': 'Отслеживайте свой фитнес-прогресс во времени',
  'Please log in to view your progress': 'Войдите, чтобы увидеть прогресс',
  'No sessions found': 'Занятия не найдены',
  'Try a different date range or exercise filter.': 'Попробуйте другой период или фильтр упражнений.',
  'Total Workouts': 'Всего тренировок',
  'Total Reps': 'Всего повторений',
  'Good Rep Rate': 'Доля хороших повторений',
  'Avg Form Score': 'Средняя оценка техники',
  'Avg Squat Depth': 'Средняя глубина приседа',
  'Total Duration': 'Общая длительность',
  'Good Reps': 'Хорошие повторения',
  'Sessions Logged': 'Записано занятий',
  'Form Score & Squat Depth Over Time': 'Оценка техники и глубина приседа со временем',
  'Track how your technique improves session to session': 'Смотрите, как техника улучшается от занятия к занятию',
  'Form Score %': 'Техника %',
  'Depth %': 'Глубина %',
  'Reps Per Workout': 'Повторения за тренировку',
  'Total vs good form reps': 'Всего повторений и повторений с хорошей техникой',
  'Good Form Reps': 'Повторения с хорошей техникой',
  'Good Rep Breakdown': 'Разбор хороших повторений',
  'Good Form': 'Хорошая техника',
  'Needs Work': 'Нужно улучшить',
  'Workout Duration': 'Длительность тренировки',
  'Minutes spent per session': 'Минут за занятие',
  'Recent Sessions': 'Недавние занятия',
  'Body Measurements': 'Замеры тела',
  'Track your body composition over time': 'Отслеживайте состав тела со временем',
  'Log Measurement': 'Записать замер',
  'Current Weight': 'Текущий вес',
  'Body Fat': 'Процент жира',
  'Muscle Mass': 'Мышечная масса',
  'Weight Change': 'Изменение веса',
  'Weight Progress': 'Прогресс веса',
  'Measurement History': 'История замеров',
  Weight: 'Вес',
  Waist: 'Талия',
  'No Measurements Yet': 'Замеров пока нет',
  'Start tracking your body composition': 'Начните отслеживать состав тела',
  'Log First Measurement': 'Записать первый замер',
  'Personal Bests': 'Личные рекорды',
  'Exercise Performance': 'Результаты по упражнениям',
  'Your best results per exercise': 'Ваши лучшие результаты по каждому упражнению',
  'No Exercise Logs Yet': 'Записей упражнений пока нет',
  'Log individual exercises to track performance here': 'Записывайте отдельные упражнения, чтобы отслеживать результаты здесь',
  'Current Streak': 'Текущая серия',
  'Best Streak': 'Лучшая серия',
  unlocked: 'открыто',

  'Earn $2 for every friend you bring to AI Fitness Coach': 'Получайте $2 за каждого друга, которого приведёте в AI Фитнес-тренер',
  'Total Earned': 'Всего заработано',
  Referrals: 'Рефералы',
  'Per Referral': 'За реферала',
  'Your Referral Code': 'Ваш реферальный код',
  'Share this code with friends. You earn $2 when they sign up.': 'Поделитесь кодом с друзьями. Вы получите $2 после их регистрации.',
  'Share My Code': 'Поделиться кодом',
  'Got a Referral Code?': 'Есть реферальный код?',
  "Enter a friend's code to give them credit": 'Введите код друга, чтобы начислить ему бонус',
  'Enter code (e.g. JOHN3X)': 'Введите код, например JOHN3X',
  'How It Works': 'Как это работает',
  'Share your code': 'Поделитесь кодом',
  'Send your unique code to friends via any channel': 'Отправьте уникальный код друзьям любым способом',
  'Friend signs up': 'Друг регистрируется',
  'They create an account and enter your code': 'Он создаёт аккаунт и вводит ваш код',
  'You earn $2': 'Вы получаете $2',
  'Commission is credited instantly to your balance': 'Комиссия сразу зачисляется на баланс',
  'Cash out': 'Вывод средств',
  'Request payout once you reach $10 (contact support)': 'Запросите выплату после достижения $10 через поддержку',
  'Referral History': 'История рефералов',
  Pending: 'Ожидает',

  'What the AI Uses': 'Что использует AI',
  Privacy: 'Конфиденциальность',
  'Your fitness goals': 'Ваши фитнес-цели',
  'Workout selections': 'Выбранные тренировки',
  'Training progress': 'Прогресс тренировок',
  'Exercise preferences': 'Предпочтения упражнений',
  'Learn More About Privacy': 'Подробнее о конфиденциальности',
  'Last updated: February 25, 2026': 'Последнее обновление: 25 февраля 2026',
  'Go Back': 'Назад',

  'Access Restricted': 'Доступ ограничен',
  'You are not registered to use this application. Please contact the app administrator to request access.':
    'Вы не зарегистрированы для использования этого приложения. Свяжитесь с администратором, чтобы запросить доступ.',
  'If you believe this is an error, you can:': 'Если вы считаете, что это ошибка, вы можете:',
  'Verify you are logged in with the correct account': 'Проверьте, что вошли в правильный аккаунт',
  'Contact the app administrator for access': 'Связаться с администратором для получения доступа',
  'Try logging out and back in again': 'Попробовать выйти и войти снова',
};

const REVERSE_TRANSLATIONS = Object.fromEntries(
  Object.entries(TEXT_TRANSLATIONS).map(([en, ru]) => [ru, en])
);

const ORIGINAL_TEXT = new WeakMap();
const ORIGINAL_ATTRS = new WeakMap();
const ATTRIBUTES = ['placeholder', 'title', 'aria-label'];

function normalize(value) {
  return String(value).replace(/\s+/g, ' ').trim();
}

function withOriginalSpacing(source, translated) {
  const leading = source.match(/^\s*/)?.[0] || '';
  const trailing = source.match(/\s*$/)?.[0] || '';
  return `${leading}${translated}${trailing}`;
}

function translateDynamicText(text, lang) {
  const dictionary = lang === 'ru' ? TEXT_TRANSLATIONS : REVERSE_TRANSLATIONS;
  const value = normalize(text);

  if (!value) return text;
  if (dictionary[value]) return withOriginalSpacing(text, dictionary[value]);

  if (lang === 'ru') {
    const patterns = [
      [/^(\d+) exercises$/, '$1 упражнений'],
      [/^(\d+) exercise$/, '$1 упражнение'],
      [/^(\d+) reps$/, '$1 повторений'],
      [/^(\d+) good$/, '$1 хороших'],
      [/^(\d+)min$/, '$1 мин'],
      [/^(\d+) min$/, '$1 мин'],
      [/^(\d+)m$/, '$1 мин'],
      [/^(\d+) total sets$/, '$1 подходов всего'],
      [/^(\d+) sessions$/, '$1 занятий'],
      [/^(\d+) completed workouts$/, '$1 завершённых тренировок'],
      [/^(\d+) completed workout$/, '$1 завершённая тренировка'],
      [/^Max (\d+) reps$/, 'Макс. $1 повторений'],
      [/^(\d+)% form$/, '$1% техника'],
      [/^(\d+)% depth$/, '$1% глубина'],
      [/^(\d+)% of reps with good form$/, '$1% повторений с хорошей техникой'],
      [/^(\d+) \/ 8 unlocked$/, '$1 / 8 открыто'],
      [/^(.+) exercises$/, '$1 упражнений'],
      [/^(.+) reps$/, '$1 повторений'],
      [/^Duration \(min\)$/, 'Длительность (мин)'],
      [/^Protein \(g\)$/, 'Белки (г)'],
      [/^Carbs \(g\)$/, 'Углеводы (г)'],
      [/^Fat \(g\)$/, 'Жиры (г)'],
      [/^Body Fat %$/, 'Жир %'],
    ];

    for (const [pattern, replacement] of patterns) {
      if (pattern.test(value)) {
        return withOriginalSpacing(text, value.replace(pattern, replacement));
      }
    }
  }

  return text;
}

export function translateUiText(text, lang) {
  return translateDynamicText(text, lang === 'ru' ? 'ru' : 'en');
}

function shouldSkipNode(node) {
  const parent = node.parentElement;
  if (!parent) return true;

  return parent.closest(
    'script, style, code, pre, textarea, [data-no-translate="true"]'
  );
}

function translateTextNode(node, lang) {
  if (shouldSkipNode(node)) return;

  const current = node.nodeValue || '';
  if (!normalize(current)) return;

  if (!ORIGINAL_TEXT.has(node)) {
    const original = lang === 'en' ? current : REVERSE_TRANSLATIONS[normalize(current)] || current;
    ORIGINAL_TEXT.set(node, original);
  }

  const original = ORIGINAL_TEXT.get(node);
  const next = lang === 'ru' ? translateDynamicText(original, lang) : original;

  if (node.nodeValue !== next) {
    node.nodeValue = next;
  }
}

function translateAttributes(element, lang) {
  if (element.closest?.('[data-no-translate="true"]')) return;

  let originals = ORIGINAL_ATTRS.get(element);
  if (!originals) {
    originals = {};
    ORIGINAL_ATTRS.set(element, originals);
  }

  ATTRIBUTES.forEach((attribute) => {
    const current = element.getAttribute(attribute);
    if (!current) return;

    if (!originals[attribute]) {
      originals[attribute] =
        lang === 'en' ? current : REVERSE_TRANSLATIONS[normalize(current)] || current;
    }

    const next =
      lang === 'ru'
        ? translateDynamicText(originals[attribute], lang)
        : originals[attribute];

    if (current !== next) {
      element.setAttribute(attribute, next);
    }
  });
}

function translateTree(root, lang) {
  if (!root) return;

  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root, lang);
    return;
  }

  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) {
    return;
  }

  if (root.nodeType === Node.ELEMENT_NODE) {
    translateAttributes(root, lang);
  }

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
  );

  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      translateTextNode(node, lang);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      translateAttributes(node, lang);
    }

    node = walker.nextNode();
  }
}

export default function AutoTranslator() {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language || 'ru';

  useEffect(() => {
    if (typeof document === 'undefined' || !document.body) return undefined;

    document.documentElement.lang = lang === 'en' ? 'en' : 'ru';

    let scheduled = false;
    const run = () => {
      scheduled = false;
      translateTree(document.body, lang === 'en' ? 'en' : 'ru');
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(run);
    };

    schedule();

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRIBUTES,
    });

    return () => observer.disconnect();
  }, [lang]);

  return null;
}
