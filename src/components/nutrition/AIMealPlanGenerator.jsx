import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, RefreshCw, Flame, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const GOALS   = ['Weight Loss', 'Muscle Gain', 'Maintenance', 'Endurance'];
const DIETS   = ['No Restriction', 'Vegetarian', 'Vegan', 'Keto', 'Gluten-Free'];
const CALORIES = ['1500', '1800', '2000', '2200', '2500', '3000'];

const MEAL_COLORS = {
  breakfast: 'bg-orange-50 border-orange-200',
  lunch:     'bg-green-50 border-green-200',
  dinner:    'bg-blue-50 border-blue-200',
  snack:     'bg-purple-50 border-purple-200',
};

// ─── Meal templates ───────────────────────────────────────────────────────────
// Each entry: { name, meal_type, base_calories, protein, carbs, fat, ingredients, instructions, diets, goals }
// diets: which diet restrictions it fits ('all' = fits everything)
const MEAL_TEMPLATES = [
  // BREAKFAST
  {
    name: 'Oatmeal with Berries & Honey', meal_type: 'breakfast',
    base_cal: 380, protein: 12, carbs: 65, fat: 8,
    ingredients: ['1 cup rolled oats', '200ml milk or water', '½ cup mixed berries', '1 tbsp honey', '1 tbsp chia seeds', 'Pinch of cinnamon'],
    instructions: 'Cook oats with milk over medium heat for 5 minutes, stirring occasionally. Top with berries, honey, and chia seeds.',
    diets: ['No Restriction', 'Vegetarian', 'Gluten-Free'], goals: ['all'],
  },
  {
    name: 'Scrambled Eggs with Whole-Grain Toast', meal_type: 'breakfast',
    base_cal: 420, protein: 26, carbs: 38, fat: 16,
    ingredients: ['3 large eggs', '2 slices whole-grain bread', '1 tbsp butter', '50g spinach', 'Salt and pepper', 'Cherry tomatoes'],
    instructions: 'Whisk eggs and cook in butter over low heat, stirring gently. Toast bread and serve with spinach and tomatoes.',
    diets: ['No Restriction', 'Vegetarian'], goals: ['Muscle Gain', 'Maintenance', 'Endurance'],
  },
  {
    name: 'Greek Yogurt Parfait', meal_type: 'breakfast',
    base_cal: 320, protein: 20, carbs: 42, fat: 6,
    ingredients: ['200g Greek yogurt (0%)', '½ cup granola', '1 banana, sliced', '1 tbsp honey', '¼ cup blueberries'],
    instructions: 'Layer yogurt, granola, and fruit in a glass. Drizzle with honey and serve immediately.',
    diets: ['No Restriction', 'Vegetarian', 'Gluten-Free'], goals: ['Weight Loss', 'Maintenance'],
  },
  {
    name: 'Avocado Toast with Poached Eggs', meal_type: 'breakfast',
    base_cal: 450, protein: 18, carbs: 40, fat: 24,
    ingredients: ['2 slices sourdough bread', '1 ripe avocado', '2 eggs', 'Red pepper flakes', 'Lemon juice', 'Salt and pepper'],
    instructions: 'Toast bread. Mash avocado with lemon juice and seasoning. Poach eggs for 3 minutes. Assemble and top with flakes.',
    diets: ['No Restriction', 'Vegetarian'], goals: ['Maintenance', 'Endurance'],
  },
  {
    name: 'Vegan Smoothie Bowl', meal_type: 'breakfast',
    base_cal: 350, protein: 8, carbs: 58, fat: 10,
    ingredients: ['1 frozen banana', '½ cup frozen mango', '200ml almond milk', '2 tbsp almond butter', 'Granola for topping', 'Fresh fruit to garnish'],
    instructions: 'Blend banana, mango, and almond milk until thick. Pour into bowl and top with granola, almond butter, and fruit.',
    diets: ['Vegan', 'Vegetarian', 'Gluten-Free'], goals: ['all'],
  },
  {
    name: 'Keto Bacon & Egg Cups', meal_type: 'breakfast',
    base_cal: 390, protein: 28, carbs: 3, fat: 30,
    ingredients: ['4 strips bacon', '4 eggs', '30g cheddar cheese', 'Salt and pepper', 'Fresh chives'],
    instructions: 'Line muffin tin with bacon. Crack egg into each cup. Top with cheese. Bake at 180°C for 15 minutes.',
    diets: ['Keto', 'No Restriction', 'Gluten-Free'], goals: ['Weight Loss', 'Muscle Gain'],
  },

  // LUNCH
  {
    name: 'Grilled Chicken Rice Bowl', meal_type: 'lunch',
    base_cal: 550, protein: 45, carbs: 58, fat: 10,
    ingredients: ['150g chicken breast', '200g cooked brown rice', '1 cup broccoli', '1 tbsp soy sauce', '1 tsp sesame oil', 'Garlic & ginger'],
    instructions: 'Grill seasoned chicken for 6 minutes each side. Steam broccoli. Serve over rice with soy sauce dressing.',
    diets: ['No Restriction', 'Gluten-Free'], goals: ['Muscle Gain', 'Endurance'],
  },
  {
    name: 'Quinoa & Chickpea Salad', meal_type: 'lunch',
    base_cal: 480, protein: 18, carbs: 62, fat: 16,
    ingredients: ['150g cooked quinoa', '100g canned chickpeas', '1 cucumber, diced', '1 tomato, diced', '50g feta cheese', 'Olive oil & lemon dressing'],
    instructions: 'Combine quinoa, chickpeas, and vegetables. Crumble feta on top. Drizzle with olive oil and lemon. Season to taste.',
    diets: ['Vegetarian', 'Gluten-Free'], goals: ['all'],
  },
  {
    name: 'Tuna Whole-Grain Wrap', meal_type: 'lunch',
    base_cal: 490, protein: 38, carbs: 48, fat: 12,
    ingredients: ['1 whole-grain wrap', '120g canned tuna in water', '2 tbsp Greek yogurt', '¼ avocado', 'Romaine lettuce', 'Lemon juice'],
    instructions: 'Mix tuna with Greek yogurt and lemon. Layer onto wrap with avocado and lettuce. Roll tightly and serve.',
    diets: ['No Restriction'], goals: ['Weight Loss', 'Muscle Gain'],
  },
  {
    name: 'Lentil Soup with Bread', meal_type: 'lunch',
    base_cal: 420, protein: 20, carbs: 65, fat: 7,
    ingredients: ['200g red lentils', '1 carrot, diced', '1 onion, diced', '2 garlic cloves', '1 tsp cumin', '2 slices whole-grain bread'],
    instructions: 'Sauté onion and garlic. Add lentils, carrot, cumin, and 600ml water. Simmer 25 minutes. Blend partially. Serve with bread.',
    diets: ['Vegan', 'Vegetarian', 'No Restriction'], goals: ['all'],
  },
  {
    name: 'Keto Cobb Salad', meal_type: 'lunch',
    base_cal: 520, protein: 36, carbs: 8, fat: 38,
    ingredients: ['120g grilled chicken breast', '2 hard-boiled eggs', '4 strips bacon', '1 avocado', 'Romaine lettuce', 'Blue cheese dressing'],
    instructions: 'Slice chicken, eggs, and avocado. Arrange on romaine. Top with crumbled bacon and blue cheese dressing.',
    diets: ['Keto', 'No Restriction', 'Gluten-Free'], goals: ['Weight Loss', 'Muscle Gain'],
  },
  {
    name: 'Vegan Buddha Bowl', meal_type: 'lunch',
    base_cal: 500, protein: 16, carbs: 70, fat: 18,
    ingredients: ['150g cooked quinoa', '100g roasted sweet potato', '100g edamame', '1 cup baby spinach', 'Tahini dressing', 'Pumpkin seeds'],
    instructions: 'Roast sweet potato at 200°C for 25 minutes. Assemble bowl with quinoa, edamame, spinach. Drizzle tahini and top with seeds.',
    diets: ['Vegan', 'Vegetarian', 'Gluten-Free'], goals: ['all'],
  },

  // DINNER
  {
    name: 'Baked Salmon with Asparagus', meal_type: 'dinner',
    base_cal: 520, protein: 42, carbs: 20, fat: 28,
    ingredients: ['180g salmon fillet', '200g asparagus', '1 lemon', '2 tbsp olive oil', 'Garlic powder', 'Fresh dill'],
    instructions: 'Place salmon and asparagus on baking sheet. Drizzle with oil, season. Bake at 200°C for 15-18 minutes. Serve with lemon.',
    diets: ['No Restriction', 'Gluten-Free', 'Keto'], goals: ['all'],
  },
  {
    name: 'Chicken Stir-Fry with Vegetables', meal_type: 'dinner',
    base_cal: 480, protein: 40, carbs: 45, fat: 12,
    ingredients: ['150g chicken breast, sliced', '1 bell pepper', '1 zucchini', '100g snap peas', '2 tbsp soy sauce', '150g cooked rice'],
    instructions: 'Stir-fry chicken in oil for 5 minutes. Add vegetables, cook 3 more minutes. Add soy sauce. Serve over rice.',
    diets: ['No Restriction'], goals: ['Muscle Gain', 'Endurance'],
  },
  {
    name: 'Beef & Vegetable Stew', meal_type: 'dinner',
    base_cal: 560, protein: 38, carbs: 42, fat: 20,
    ingredients: ['200g lean beef, cubed', '2 potatoes, diced', '2 carrots', '1 onion', '2 garlic cloves', 'Beef broth & herbs'],
    instructions: 'Brown beef. Add vegetables, garlic, and broth. Simmer covered for 45 minutes until tender. Season to taste.',
    diets: ['No Restriction', 'Gluten-Free'], goals: ['Muscle Gain', 'Endurance'],
  },
  {
    name: 'Vegetarian Pasta Primavera', meal_type: 'dinner',
    base_cal: 510, protein: 16, carbs: 78, fat: 14,
    ingredients: ['150g whole-grain pasta', '1 zucchini', '1 bell pepper', '100g cherry tomatoes', '50g parmesan', 'Olive oil & garlic'],
    instructions: 'Cook pasta. Sauté vegetables in olive oil with garlic. Toss pasta with vegetables and top with parmesan.',
    diets: ['Vegetarian'], goals: ['Maintenance', 'Endurance'],
  },
  {
    name: 'Vegan Thai Curry', meal_type: 'dinner',
    base_cal: 490, protein: 14, carbs: 62, fat: 22,
    ingredients: ['200g tofu, cubed', '400ml coconut milk', '1 tbsp red curry paste', '1 cup broccoli', '150g cooked jasmine rice', 'Lime & cilantro'],
    instructions: 'Fry tofu until golden. Add curry paste, then coconut milk. Add broccoli, simmer 10 minutes. Serve over rice with lime.',
    diets: ['Vegan', 'Vegetarian', 'Gluten-Free'], goals: ['all'],
  },
  {
    name: 'Keto Zucchini Noodles with Meatballs', meal_type: 'dinner',
    base_cal: 540, protein: 38, carbs: 10, fat: 40,
    ingredients: ['200g ground beef', '2 large zucchinis (spiralized)', '200g tomato sauce (sugar-free)', '30g parmesan', 'Garlic & Italian herbs'],
    instructions: 'Form and bake meatballs at 200°C for 20 minutes. Sauté zucchini noodles 2 minutes. Serve with sauce and parmesan.',
    diets: ['Keto', 'No Restriction', 'Gluten-Free'], goals: ['Weight Loss', 'Muscle Gain'],
  },

  // SNACK
  {
    name: 'Apple with Almond Butter', meal_type: 'snack',
    base_cal: 200, protein: 5, carbs: 28, fat: 9,
    ingredients: ['1 medium apple', '2 tbsp almond butter'],
    instructions: 'Slice apple and serve with almond butter for dipping.',
    diets: ['all'], goals: ['all'],
  },
  {
    name: 'Mixed Nuts & Dark Chocolate', meal_type: 'snack',
    base_cal: 240, protein: 6, carbs: 18, fat: 16,
    ingredients: ['30g mixed nuts', '20g dark chocolate (70%+)'],
    instructions: 'Portion nuts and chocolate into a small bowl. Enjoy as a balanced snack.',
    diets: ['all'], goals: ['all'],
  },
  {
    name: 'Protein Shake', meal_type: 'snack',
    base_cal: 220, protein: 28, carbs: 14, fat: 4,
    ingredients: ['1 scoop whey protein', '300ml milk', '1 banana', 'Ice cubes'],
    instructions: 'Blend all ingredients until smooth. Drink immediately post-workout or as a snack.',
    diets: ['No Restriction', 'Vegetarian', 'Gluten-Free'], goals: ['Muscle Gain', 'Endurance'],
  },
  {
    name: 'Hummus with Veggie Sticks', meal_type: 'snack',
    base_cal: 180, protein: 6, carbs: 22, fat: 8,
    ingredients: ['80g hummus', '1 carrot, sticks', '1 celery stalk, sticks', '½ cucumber, slices'],
    instructions: 'Portion hummus into a small bowl. Arrange vegetable sticks alongside for dipping.',
    diets: ['Vegan', 'Vegetarian', 'Gluten-Free'], goals: ['all'],
  },
  {
    name: 'Keto Cheese & Pepperoni', meal_type: 'snack',
    base_cal: 210, protein: 14, carbs: 2, fat: 16,
    ingredients: ['50g cheddar cheese, cubed', '30g pepperoni slices'],
    instructions: 'Arrange cheese and pepperoni on a plate. No prep needed.',
    diets: ['Keto', 'No Restriction', 'Gluten-Free'], goals: ['Weight Loss'],
  },
];

// ─── Plan generator ───────────────────────────────────────────────────────────
function getMealsForDiet(diet) {
  return MEAL_TEMPLATES.filter(m =>
    m.diets.includes('all') || m.diets.includes(diet)
  );
}

function pickMeal(pool, mealType, usedNames) {
  const options = pool.filter(m => m.meal_type === mealType && !usedNames.has(m.name));
  if (!options.length) return pool.find(m => m.meal_type === mealType) || null;
  return options[Math.floor(Math.random() * options.length)];
}

function scaleMeal(meal, targetCal) {
  const ratio = targetCal / meal.base_cal;
  return {
    meal_type:    meal.meal_type,
    name:         meal.name,
    calories:     Math.round(meal.base_cal * ratio),
    protein:      Math.round(meal.protein * ratio),
    carbs:        Math.round(meal.carbs * ratio),
    fat:          Math.round(meal.fat * ratio),
    ingredients:  meal.ingredients,
    instructions: meal.instructions,
  };
}

const CALORIE_SPLITS = {
  breakfast: 0.25,
  lunch:     0.35,
  dinner:    0.30,
  snack:     0.10,
};

const GOAL_TIPS = {
  'Weight Loss':  ['Eat slowly and stop at 80% full', 'Prioritize protein to stay full longer', 'Drink water before each meal'],
  'Muscle Gain':  ['Eat within 30 min after training', 'Aim for 1.6–2g protein per kg bodyweight', 'Don\'t skip carbs — they fuel your workouts'],
  'Maintenance':  ['Consistency beats perfection', 'Track meals for at least 2 weeks to find your baseline', 'Balance treats with nutrient-dense foods'],
  'Endurance':    ['Carbohydrate-load before long sessions', 'Stay hydrated throughout the day', 'Replenish electrolytes after sweating'],
};

function generateMealPlan(goal, diet, targetCalories) {
  const pool = getMealsForDiet(diet);
  const cal  = Number(targetCalories);
  const used = new Set();
  const meals = [];

  for (const type of ['breakfast', 'lunch', 'dinner', 'snack']) {
    const meal = pickMeal(pool, type, used);
    if (!meal) continue;
    used.add(meal.name);
    const typeCal = Math.round(cal * CALORIE_SPLITS[type]);
    meals.push(scaleMeal(meal, typeCal));
  }

  const total_calories = meals.reduce((s, m) => s + m.calories, 0);
  const total_protein  = meals.reduce((s, m) => s + m.protein,  0);
  const total_carbs    = meals.reduce((s, m) => s + m.carbs,    0);
  const total_fat      = meals.reduce((s, m) => s + m.fat,      0);

  return {
    summary: {
      total_calories,
      total_protein,
      total_carbs,
      total_fat,
      tips: GOAL_TIPS[goal] || GOAL_TIPS['Maintenance'],
    },
    meals,
  };
}

// ─── MealCard ─────────────────────────────────────────────────────────────────
function MealCard({ meal }) {
  const [open, setOpen] = useState(false);
  const colorClass = MEAL_COLORS[meal.meal_type] || 'bg-gray-50 border-gray-200';

  return (
    <div className={cn('border rounded-xl overflow-hidden', colorClass)}>
      <button className="w-full flex items-center justify-between p-3 text-left" onClick={() => setOpen(o => !o)}>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500 capitalize">{meal.meal_type}</span>
          <div className="font-semibold text-gray-900 text-sm mt-0.5">{meal.name}</div>
          <div className="flex gap-2 mt-1 flex-wrap">
            <span className="text-xs text-orange-600 flex items-center gap-0.5"><Flame className="h-3 w-3" />{meal.calories} kcal</span>
            <span className="text-xs text-blue-600">P {meal.protein}g</span>
            <span className="text-xs text-green-600">C {meal.carbs}g</span>
            <span className="text-xs text-yellow-600">F {meal.fat}g</span>
          </div>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2 border-t border-black/5 pt-2">
          {meal.ingredients?.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Ingredients</div>
              <ul className="space-y-0.5">
                {meal.ingredients.map((ing, i) => (
                  <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                    <span className="text-gray-400 mt-0.5">•</span>{ing}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {meal.instructions && (
            <div>
              <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">How to prepare</div>
              <p className="text-xs text-gray-700 leading-relaxed">{meal.instructions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AIMealPlanGenerator() {
  const [goal,     setGoal]     = useState('Maintenance');
  const [diet,     setDiet]     = useState('No Restriction');
  const [calories, setCalories] = useState('2000');
  const [loading,  setLoading]  = useState(false);
  const [plan,     setPlan]     = useState(null);

  const generate = async () => {
    setLoading(true);
    setPlan(null);
    await new Promise(r => setTimeout(r, 500));
    try {
      const result = generateMealPlan(goal, diet, calories);
      setPlan(result);
      toast.success('Meal plan generated!');
    } catch {
      toast.error('Failed to generate meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border p-4 space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" /> Customize your plan
        </h3>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Goal</div>
          <div className="flex flex-wrap gap-2">
            {GOALS.map(g => (
              <button key={g} onClick={() => setGoal(g)}
                className={cn('px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                  goal === g ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300')}>
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Diet</div>
          <div className="flex flex-wrap gap-2">
            {DIETS.map(d => (
              <button key={d} onClick={() => setDiet(d)}
                className={cn('px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                  diet === d ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-300')}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Daily Calories Target</div>
          <div className="flex flex-wrap gap-2">
            {CALORIES.map(c => (
              <button key={c} onClick={() => setCalories(c)}
                className={cn('px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                  calories === c ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300')}>
                {c} kcal
              </button>
            ))}
          </div>
        </div>

        <Button onClick={generate} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
          {loading
            ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating your plan…</>
            : <><Sparkles className="h-4 w-4 mr-2" />Generate Meal Plan</>}
        </Button>
      </div>

      {plan && (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-4">
            <div className="font-bold text-sm mb-2">Daily Totals</div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'Calories', value: plan.summary.total_calories, unit: 'kcal' },
                { label: 'Protein',  value: plan.summary.total_protein,  unit: 'g' },
                { label: 'Carbs',    value: plan.summary.total_carbs,    unit: 'g' },
                { label: 'Fat',      value: plan.summary.total_fat,      unit: 'g' },
              ].map(s => (
                <div key={s.label} className="bg-white/15 rounded-lg p-2">
                  <div className="text-lg font-black">{s.value}</div>
                  <div className="text-[10px] opacity-80">{s.label}</div>
                </div>
              ))}
            </div>
            {plan.summary.tips?.length > 0 && (
              <div className="mt-3 space-y-1">
                {plan.summary.tips.map((tip, i) => (
                  <div key={i} className="text-xs opacity-90 flex items-start gap-1.5">
                    <span className="mt-0.5">💡</span>{tip}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            {plan.meals.map((meal, i) => <MealCard key={i} meal={meal} />)}
          </div>

          <Button variant="outline" onClick={generate} disabled={loading} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" /> Regenerate Plan
          </Button>
        </div>
      )}
    </div>
  );
}
