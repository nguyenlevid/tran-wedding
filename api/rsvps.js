import { connectDB, RSVP } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { passcode } = req.body ?? {};
  if (!passcode || passcode !== process.env.ADMIN_PASSCODE) {
    return res.status(401).json({ error: 'Invalid passcode.' });
  }

  try {
    await connectDB();
    const rsvps = await RSVP.find().sort({ submittedAt: -1 }).lean();
    res.json({ ok: true, rsvps });
  } catch (err) {
    console.error('Admin fetch error:', err);
    res.status(500).json({ ok: false, error: 'Failed to fetch RSVPs.' });
  }
}
