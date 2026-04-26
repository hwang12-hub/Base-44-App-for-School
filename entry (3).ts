import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { event_id, trigger_type } = await req.json();
  // trigger_type: "new_event" | "event_updated" | "announcement"
  // For announcements, event_id is actually the announcement id — fetch it separately

  let event, announcement;

  if (trigger_type === 'announcement') {
    const announcements = await base44.asServiceRole.entities.EventAnnouncement.filter({ id: event_id });
    announcement = announcements[0];
    if (!announcement) return Response.json({ error: 'Announcement not found' }, { status: 404 });
    const events = await base44.asServiceRole.entities.Event.filter({ id: announcement.event_id });
    event = events[0];
  } else {
    const events = await base44.asServiceRole.entities.Event.filter({ id: event_id });
    event = events[0];
  }

  if (!event) return Response.json({ error: 'Event not found' }, { status: 404 });

  // Find all subscriptions that match this event (by category or specific event id)
  const allSubs = await base44.asServiceRole.entities.EventSubscription.list();
  const matchingSubs = allSubs.filter((sub) => {
    const categoryMatch = sub.subscribed_categories?.includes(event.category);
    const eventMatch = sub.subscribed_event_ids?.includes(event.id);
    return categoryMatch || eventMatch;
  });

  if (matchingSubs.length === 0) {
    return Response.json({ message: 'No subscribers matched.', event: event.title });
  }

  const formattedDate = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const timeInfo = event.start_time ? `${event.start_time}${event.end_time ? ` – ${event.end_time}` : ''}` : 'Time TBD';

  let subject, bodyIntro, notifTitle, notifMessage;

  if (trigger_type === 'new_event') {
    subject = `New Event: "${event.title}" added`;
    notifTitle = `New Event: ${event.title}`;
    bodyIntro = `A new school event has been added that matches your subscription:`;
    notifMessage = `A new ${event.category} event "${event.title}" on ${formattedDate} has been added.`;
  } else if (trigger_type === 'event_updated') {
    subject = `Event Updated: "${event.title}"`;
    notifTitle = `Event Updated: ${event.title}`;
    bodyIntro = `A school event you're subscribed to has been updated:`;
    notifMessage = `The event "${event.title}" on ${formattedDate} has been updated.`;
  } else if (trigger_type === 'announcement') {
    subject = `Announcement for "${event.title}"`;
    notifTitle = `Announcement: ${event.title}`;
    bodyIntro = `There's a new announcement for an event you're following:`;
    notifMessage = announcement.message;
  }

  const results = [];

  for (const sub of matchingSubs) {
    // Create in-app notification
    await base44.asServiceRole.entities.InAppNotification.create({
      parent_email: sub.parent_email,
      title: notifTitle,
      message: notifMessage,
      event_id: event.id,
      type: trigger_type,
      read: false,
    });

    // Send email
    const emailBody = `Dear ${sub.parent_name || 'Parent/Guardian'},

${bodyIntro}

🗓  ${event.title}
📅  Date: ${formattedDate}
🕐  Time: ${timeInfo}${event.location ? `\n📍  Location: ${event.location}` : ''}${announcement ? `\n\n📢  ${announcement.message}` : ''}${event.description ? `\n\n${event.description}` : ''}

Visit the EduFeedback app to view full details.

Best regards,
EduFeedback School Team
📞 +1-800-EDU-SCHOOL | admin@edufeedback.edu`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: sub.parent_email,
      subject,
      body: emailBody,
      from_name: 'EduFeedback School',
    });

    results.push({ subscriber: sub.parent_email, status: 'notified' });
  }

  return Response.json({
    success: true,
    event: event.title,
    trigger_type,
    notifications_sent: results.length,
    results,
  });
});