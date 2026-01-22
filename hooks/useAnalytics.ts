import { useEffect } from 'react';
import { AnalyticsService } from '../services/analyticsService';

export const useAnalytics = (screenName: string) => {
  useEffect(() => {
    // Track screen view when component mounts
    AnalyticsService.trackScreenView(screenName);
  }, [screenName]);

  return {
    trackEvent: AnalyticsService.trackEvent,
    trackUserAction: AnalyticsService.trackUserAction,
  };
};