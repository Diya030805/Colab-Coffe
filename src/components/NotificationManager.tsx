import { useEffect } from 'react';
import { toast } from 'sonner';

export function NotificationManager() {
  useEffect(() => {
    const checkReservations = () => {
      try {
        const saved = localStorage.getItem('active_reservation');
        if (!saved) return;

        const reservation = JSON.parse(saved);
        if (reservation.notified) return;

        const dateStr = reservation.formData.date; // YYYY-MM-DD
        const timeStr = reservation.formData.time; // HH:MM AM/PM

        const [year, month, day] = dateStr.split('-').map(Number);
        
        const [timePart, modifier] = timeStr.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);
        
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const reservationDate = new Date(year, month - 1, day, hours, minutes);
        const now = new Date();
        
        const diffMs = reservationDate.getTime() - now.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        // Trigger if within 60 minutes but more than 45 (to catch it in the hour window)
        // Or just trigger if <= 60 and not notified.
        if (diffMins <= 60 && diffMins > 0) {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("CoLab Coffee Reminder", {
              body: `Your table is reserved for ${timeStr} today! We look forward to seeing you.`,
              icon: '/favicon.ico'
            });
          }
          
          // Always show a toast as fallback/redundancy
          toast.info("Reservation Reminder", {
            description: `Your table is ready in 1 hour (${timeStr})!`,
            duration: 10000,
          });
          
          // Mark as notified
          reservation.notified = true;
          localStorage.setItem('active_reservation', JSON.stringify(reservation));
        }
      } catch (err) {
        console.error("Notification check error:", err);
      }
    };

    const interval = setInterval(checkReservations, 60000); // Check every minute
    checkReservations(); // Initial check

    return () => clearInterval(interval);
  }, []);

  return null;
}
