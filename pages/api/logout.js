export default function handler(req, res) {

    res.setHeader('Set-Cookie', [
      'sid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=none',
    ]);

    res.status(200).json({ message: 'success' });
  }
  