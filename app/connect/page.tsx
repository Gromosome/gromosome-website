import AppointmentPageClient, { type AppointmentContent } from './AppointmentPageClient';
import { contentUrls, getRemoteContent } from '@/lib/cdn-content';

export default async function AppointmentPage() {
  const appointmentContent = await getRemoteContent<AppointmentContent>(contentUrls.appointment);

  return <AppointmentPageClient appointmentContent={appointmentContent} />;
}
