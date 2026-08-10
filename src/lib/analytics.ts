export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  console.log(`[Analytics Event]: ${eventName}`, eventData || {});
  
  try {
    const history = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    history.push({
      event: eventName,
      data: eventData || {},
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('analytics_events', JSON.stringify(history));
  } catch (e) {
    console.error('Failed to log event', e);
  }
};
