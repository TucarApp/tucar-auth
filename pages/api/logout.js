export default function handler(req, res) {
    if (req.method === 'GET') {
      // Capturamos el redirect_uri del query params
      const { redirect_uri } = req.query;
  
      // Establecer el dominio correcto y los atributos necesarios para eliminar la cookie
      res.setHeader('Set-Cookie', [
        'sid=; Path=/; Domain=.tucar.app; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict',
      ]);
  
      // Si tenemos redirect_uri, hacemos un redireccionamiento
      if (redirect_uri) {
        res.redirect(302, decodeURIComponent(redirect_uri));
      } else {
        // En caso de que no haya redirectUri, devolvemos un mensaje de sesión cerrada
        res.status(200).json({ message: 'Sesión cerrada y cookie eliminada' });
      }
    } else {
      // Si no es una solicitud GET, devolvemos un método no permitido
      res.status(405).json({ message: 'Método no permitido' });
    }
  }
  