export default function handler(req, res) {
    // Establecer el dominio correcto y los atributos necesarios para eliminar la cookie
    res.setHeader('Set-Cookie', [
      'sid=; Path=/; Domain=.tucar.dev; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict',
    ]);
  
    // Responder con éxito
    res.status(200).json({ message: 'Sesión cerrada y cookie eliminada' });
  }
  