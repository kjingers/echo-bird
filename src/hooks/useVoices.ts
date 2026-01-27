import { useQuery } from '@tanstack/react-query';
import { speechService } from '@/services';
import type { Voice } from '@/types';

export function useVoices() {
  return useQuery<Voice[], Error>({
    queryKey: ['voices'],
    queryFn: () => speechService.getVoices(),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
    enabled: speechService.isConfigured(),
  });
}
