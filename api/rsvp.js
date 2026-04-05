import { connectDB, RSVP } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    await connectDB();

    const { location, name, message, attendCeremony, attendDinner, extraGuests } = req.body;

    if (!location || !name?.trim()) {
      return res.status(400).json({ ok: false, error: 'Name and location are required.' });
    }

    const doc = await RSVP.create({
      location,
      name: name.trim(),
      message: message?.trim() ?? '',
      attendCeremony: attendCeremony ?? null,
      attendDinner:   attendDinner   ?? null,
      extraGuests:    extraGuests    ?? 0,
    });

    res.status(201).json({ ok: true, id: doc._id });
  } catch (err) {
    console.error('RSVP save error:', err);
    res.status(500).json({ ok: false, error: 'Failed to save. Please try again.' });
  }
}
