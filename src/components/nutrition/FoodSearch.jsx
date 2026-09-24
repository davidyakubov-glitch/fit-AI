import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Plus } from 'lucide-react';

// Common foods with nutritional info per typical serving
const FOOD_DATABASE = [
  { name: 'Chicken Breast (100g)',    serving_size: '100g',          calories: 165, protein: 31, carbs: 0,  fat: 3.6 },
  { name: 'Chicken Breast (150g)',    serving_size: '150g',          calories: 248, protein: 46, carbs: 0,  fat: 5.4 },
  { name: 'Ground Beef 80% (100g)',   serving_size: '100g',          calories: 254, protein: 17, carbs: 0,  fat: 20  },
  { name: 'Salmon Fillet (100g)',     serving_size: '100g',          calories: 208, protein: 20, carbs: 0,  fat: 13  },
  { name: 'Tuna, canned (100g)',      serving_size: '100g',          calories: 116, protein: 26, carbs: 0,  fat: 1   },
  { name: 'Egg (1 large)',            serving_size: '1 egg (50g)',   calories: 78,  protein: 6,  carbs: 1,  fat: 5   },
  { name: 'Greek Yogurt (200g)',      serving_size: '200g',          calories: 130, protein: 17, carbs: 9,  fat: 4   },
  { name: 'Cottage Cheese (100g)',    serving_size: '100g',          calories: 98,  protein: 11, carbs: 3,  fat: 4   },
  { name: 'Milk (250ml)',             serving_size: '250ml glass',   calories: 150, protein: 8,  carbs: 12, fat: 8   },
  { name: 'Whey Protein (1 scoop)',   serving_size: '30g scoop',     calories: 120, protein: 24, carbs: 3,  fat: 2   },

  { name: 'White Rice, cooked (100g)',serving_size: '100g cooked',   calories: 130, protein: 2,  carbs: 28, fat: 0.3 },
  { name: 'Brown Rice, cooked (100g)',serving_size: '100g cooked',   calories: 112, protein: 2,  carbs: 24, fat: 0.9 },
  { name: 'Oats (100g dry)',          serving_size: '100g',          calories: 389, protein: 17, carbs: 66, fat: 7   },
  { name: 'Whole-Grain Bread (1 slice)',serving_size: '1 slice (40g)',calories: 92, protein: 4,  carbs: 17, fat: 1.5 },
  { name: 'Pasta, cooked (100g)',     serving_size: '100g cooked',   calories: 131, protein: 5,  carbs: 25, fat: 1   },
  { name: 'Quinoa, cooked (100g)',    serving_size: '100g cooked',   calories: 120, protein: 4,  carbs: 21, fat: 2   },
  { name: 'Sweet Potato (100g)',      serving_size: '100g',          calories: 86,  protein: 2,  carbs: 20, fat: 0.1 },
  { name: 'Potato, boiled (100g)',    serving_size: '100g',          calories: 87,  protein: 2,  carbs: 20, fat: 0.1 },

  { name: 'Banana (1 medium)',        serving_size: '1 banana (120g)',calories: 107,protein: 1,  carbs: 27, fat: 0.4 },
  { name: 'Apple (1 medium)',         serving_size: '1 apple (180g)', calories: 95, protein: 0,  carbs: 25, fat: 0.3 },
  { name: 'Orange (1 medium)',        serving_size: '1 orange (130g)',calories: 62, protein: 1,  carbs: 15, fat: 0.2 },
  { name: 'Blueberries (100g)',       serving_size: '100g',          calories: 57,  protein: 1,  carbs: 14, fat: 0.3 },
  { name: 'Strawberries (100g)',      serving_size: '100g',          calories: 32,  protein: 1,  carbs: 8,  fat: 0.3 },
  { name: 'Avocado (½ fruit)',        serving_size: '½ avocado (75g)',calories: 120,protein: 1,  carbs: 6,  fat: 11  },

  { name: 'Broccoli (100g)',          serving_size: '100g',          calories: 34,  protein: 3,  carbs: 7,  fat: 0.4 },
  { name: 'Spinach (100g)',           serving_size: '100g',          calories: 23,  protein: 3,  carbs: 4,  fat: 0.4 },
  { name: 'Cucumber (100g)',          serving_size: '100g',          calories: 16,  protein: 1,  carbs: 4,  fat: 0.1 },
  { name: 'Tomato (1 medium)',        serving_size: '1 tomato (120g)',calories: 22, protein: 1,  carbs: 5,  fat: 0.2 },
  { name: 'Bell Pepper (1 medium)',   serving_size: '1 pepper (120g)',calories: 37, protein: 1,  carbs: 9,  fat: 0.3 },
  { name: 'Carrot (1 medium)',        serving_size: '1 carrot (60g)', calories: 25, protein: 1,  carbs: 6,  fat: 0.1 },

  { name: 'Almonds (30g)',            serving_size: '30g (~23 nuts)', calories: 173, protein: 6,  carbs: 6,  fat: 15  },
  { name: 'Peanut Butter (2 tbsp)',   serving_size: '2 tbsp (32g)',  calories: 190, protein: 8,  carbs: 6,  fat: 16  },
  { name: 'Almond Butter (2 tbsp)',   serving_size: '2 tbsp (32g)',  calories: 196, protein: 7,  carbs: 6,  fat: 18  },
  { name: 'Olive Oil (1 tbsp)',       serving_size: '1 tbsp (14g)',  calories: 119, protein: 0,  carbs: 0,  fat: 14  },
  { name: 'Cheddar Cheese (30g)',     serving_size: '30g slice',     calories: 120, protein: 7,  carbs: 0,  fat: 10  },

  { name: 'Chickpeas, cooked (100g)',serving_size: '100g',          calories: 164, protein: 9,  carbs: 27, fat: 2.6 },
  { name: 'Lentils, cooked (100g)',  serving_size: '100g',          calories: 116, protein: 9,  carbs: 20, fat: 0.4 },
  { name: 'Black Beans, cooked (100g)',serving_size: '100g',        calories: 132, protein: 9,  carbs: 24, fat: 0.5 },
  { name: 'Tofu, firm (100g)',       serving_size: '100g',          calories: 76,  protein: 8,  carbs: 2,  fat: 4   },
  { name: 'Edamame (100g)',          serving_size: '100g shelled',  calories: 121, protein: 11, carbs: 9,  fat: 5   },

  { name: 'Coffee, black (250ml)',   serving_size: '250ml cup',     calories: 5,   protein: 0,  carbs: 1,  fat: 0   },
  { name: 'Orange Juice (250ml)',    serving_size: '250ml glass',   calories: 112, protein: 2,  carbs: 26, fat: 0.5 },
  { name: 'Dark Chocolate (30g)',    serving_size: '30g (3 squares)',calories: 170,protein: 2,  carbs: 13, fat: 12  },
  { name: 'Honey (1 tbsp)',          serving_size: '1 tbsp (21g)',  calories: 64,  protein: 0,  carbs: 17, fat: 0   },
];

function searchFoods(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return FOOD_DATABASE.filter(f => f.name.toLowerCase().includes(q)).slice(0, 6);
}

export default function FoodSearch({ onSelectFood }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching,   setSearching]   = useState(false);
  const [results,     setResults]     = useState([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    // Small delay so UI feels responsive
    await new Promise(r => setTimeout(r, 200));
    setResults(searchFoods(searchQuery));
    setSearching(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search food (e.g. 'chicken', 'banana', 'oats')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          onClick={handleSearch}
          disabled={searching || !searchQuery.trim()}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {searching
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <><Search className="h-4 w-4 mr-2" />Search</>}
        </Button>
      </div>

      {results.length === 0 && searchQuery.trim() && !searching && (
        <p className="text-sm text-gray-500 text-center py-4">
          No results for "{searchQuery}". Try a different term.
        </p>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((food, idx) => (
            <Card
              key={idx}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectFood(food)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{food.name}</h4>
                    <p className="text-sm text-gray-600">{food.serving_size}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge variant="secondary">{food.calories} cal</Badge>
                      <Badge variant="outline">P: {food.protein}g</Badge>
                      <Badge variant="outline">C: {food.carbs}g</Badge>
                      <Badge variant="outline">F: {food.fat}g</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="ml-4" onClick={(e) => { e.stopPropagation(); onSelectFood(food); }}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
