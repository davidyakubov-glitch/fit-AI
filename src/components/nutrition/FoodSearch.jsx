import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function FoodSearch({ onSelectFood }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Given the food query "${searchQuery}", provide nutritional information for a typical serving. Return data for the most common interpretation of this food.`,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            serving_size: { type: "string" },
            calories: { type: "number" },
            protein: { type: "number" },
            carbs: { type: "number" },
            fat: { type: "number" }
          },
          required: ["name", "serving_size", "calories", "protein", "carbs", "fat"]
        }
      });
      
      setResults([response]);
    } catch (error) {
      toast.error('Failed to search for food');
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAISearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search for a food (e.g., 'chicken breast 100g', 'banana')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button 
          onClick={handleAISearch} 
          disabled={searching || !searchQuery.trim()}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {searching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((food, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelectFood(food)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{food.name}</h4>
                    <p className="text-sm text-gray-600">{food.serving_size}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{food.calories} cal</Badge>
                      <Badge variant="outline">P: {food.protein}g</Badge>
                      <Badge variant="outline">C: {food.carbs}g</Badge>
                      <Badge variant="outline">F: {food.fat}g</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="ml-4">
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