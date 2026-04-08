import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function BodyMeasurementForm({ onClose }) {
  const queryClient = useQueryClient();
  const [measurement, setMeasurement] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    body_fat_percentage: '',
    muscle_mass: '',
    waist: '',
    chest: '',
    hips: '',
    notes: ''
  });

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.BodyMeasurement.create(data),
    onMutate: async (newMeasurement) => {
      await queryClient.cancelQueries({ queryKey: ['bodyMeasurements'] });
      const previousMeasurements = queryClient.getQueryData(['bodyMeasurements']);
      
      queryClient.setQueryData(['bodyMeasurements'], (old) => {
        return [{ ...newMeasurement, id: 'temp-' + Date.now() }, ...(old || [])];
      });
      
      return { previousMeasurements };
    },
    onError: (err, newMeasurement, context) => {
      queryClient.setQueryData(['bodyMeasurements'], context.previousMeasurements);
      toast.error('Failed to save measurement');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bodyMeasurements'] });
      toast.success('Measurement saved!');
      onClose?.();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      date: new Date(measurement.date).toISOString(),
      weight: parseFloat(measurement.weight),
      body_fat_percentage: measurement.body_fat_percentage ? parseFloat(measurement.body_fat_percentage) : undefined,
      muscle_mass: measurement.muscle_mass ? parseFloat(measurement.muscle_mass) : undefined,
      waist: measurement.waist ? parseFloat(measurement.waist) : undefined,
      chest: measurement.chest ? parseFloat(measurement.chest) : undefined,
      hips: measurement.hips ? parseFloat(measurement.hips) : undefined,
      notes: measurement.notes || undefined
    };
    saveMutation.mutate(data);
  };

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-purple-600" />
            Log Body Measurements
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Date *</Label>
              <Input
                type="date"
                value={measurement.date}
                onChange={(e) => setMeasurement({ ...measurement, date: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label>Weight (kg/lbs) *</Label>
              <Input
                type="number"
                step="0.1"
                value={measurement.weight}
                onChange={(e) => setMeasurement({ ...measurement, weight: e.target.value })}
                placeholder="70.5"
                required
              />
            </div>

            <div>
              <Label>Body Fat %</Label>
              <Input
                type="number"
                step="0.1"
                value={measurement.body_fat_percentage}
                onChange={(e) => setMeasurement({ ...measurement, body_fat_percentage: e.target.value })}
                placeholder="15.5"
              />
            </div>

            <div>
              <Label>Muscle Mass (kg/lbs)</Label>
              <Input
                type="number"
                step="0.1"
                value={measurement.muscle_mass}
                onChange={(e) => setMeasurement({ ...measurement, muscle_mass: e.target.value })}
                placeholder="60.0"
              />
            </div>

            <div>
              <Label>Waist (cm/in)</Label>
              <Input
                type="number"
                step="0.1"
                value={measurement.waist}
                onChange={(e) => setMeasurement({ ...measurement, waist: e.target.value })}
                placeholder="80.0"
              />
            </div>

            <div>
              <Label>Chest (cm/in)</Label>
              <Input
                type="number"
                step="0.1"
                value={measurement.chest}
                onChange={(e) => setMeasurement({ ...measurement, chest: e.target.value })}
                placeholder="100.0"
              />
            </div>

            <div>
              <Label>Hips (cm/in)</Label>
              <Input
                type="number"
                step="0.1"
                value={measurement.hips}
                onChange={(e) => setMeasurement({ ...measurement, hips: e.target.value })}
                placeholder="95.0"
              />
            </div>
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              value={measurement.notes}
              onChange={(e) => setMeasurement({ ...measurement, notes: e.target.value })}
              placeholder="How you're feeling, energy levels, etc."
              rows={2}
            />
          </div>

          <Button
            type="submit"
            disabled={saveMutation.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {saveMutation.isPending ? 'Saving...' : 'Save Measurement'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}