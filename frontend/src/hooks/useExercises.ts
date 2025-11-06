import { useState, useEffect, useCallback } from 'react';
import { exerciseApi, Exercise } from '@/services/api';
import { toast } from 'sonner';

interface UseExercisesOptions {
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: string;
  equipment?: string;
  muscleGroup?: string;
  search?: string;
  popular?: boolean;
}

interface UseExercisesReturn {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  pagination: {
    current: number;
    pages: number;
    total: number;
  } | null;
  filters: {
    categories: string[];
    difficulties: string[];
    equipmentTypes: string[];
    muscleGroups: string[];
  } | null;
  refetch: () => Promise<void>;
  setFilters: (filters: Partial<UseExercisesOptions>) => void;
}

export const useExercises = (options: UseExercisesOptions = {}): UseExercisesReturn => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    current: number;
    pages: number;
    total: number;
  } | null>(null);
  const [filters, setFiltersState] = useState<{
    categories: string[];
    difficulties: string[];
    equipmentTypes: string[];
    muscleGroups: string[];
  } | null>(null);
  const [currentOptions, setCurrentOptions] = useState<UseExercisesOptions>(options);

  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🏋️ Fetching exercises with options:', currentOptions);
      const response = await exerciseApi.getExercises(currentOptions);
      
      if (response.status === 'success') {
        console.log('✅ Exercises fetched successfully:', response.data.exercises.length, 'exercises');
        setExercises(response.data.exercises);
        setPagination(response.data.pagination);
        setFiltersState(response.data.filters);
      } else {
        throw new Error('Failed to fetch exercises');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exercises';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('❌ Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  }, [
    currentOptions.page,
    currentOptions.limit,
    currentOptions.category,
    currentOptions.difficulty,
    currentOptions.equipment,
    currentOptions.muscleGroup,
    currentOptions.search,
    currentOptions.popular
  ]);

  const refetch = async () => {
    await fetchExercises();
  };

  const setFilters = (newFilters: Partial<UseExercisesOptions>) => {
    setCurrentOptions(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return {
    exercises,
    loading,
    error,
    pagination,
    filters,
    refetch,
    setFilters
  };
};

// Hook for getting a single exercise
export const useExercise = (id: string) => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await exerciseApi.getExercise(id);
        
        if (response.status === 'success') {
          setExercise(response.data.exercise);
        } else {
          throw new Error('Failed to fetch exercise');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exercise';
        setError(errorMessage);
        console.error('Error fetching exercise:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExercise();
    }
  }, [id]);

  return { exercise, loading, error };
};

// Hook for getting popular exercises
export const usePopularExercises = (limit?: number) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularExercises = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await exerciseApi.getPopularExercises(limit);
        
        if (response.status === 'success') {
          setExercises(response.data.exercises);
        } else {
          throw new Error('Failed to fetch popular exercises');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch popular exercises';
        setError(errorMessage);
        console.error('Error fetching popular exercises:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularExercises();
  }, [limit]);

  return { exercises, loading, error };
};