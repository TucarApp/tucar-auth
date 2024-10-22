export default function handler(req, res) {
    // Capturamos el redirect_uri del query params
    const redirectUri = req.query.redirect_uri;
  
    // Establecer el dominio correcto y los atributos necesarios para eliminar la cookie
    res.setHeader('Set-Cookie', [
      'sid=; Path=/; Domain=.tucar.dev; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict',
    ]);
  
    // Si tenemos redirectUri, hacemos un redireccionamiento
    if (redirectUri) {
      res.redirect(302, decodeURIComponent(redirectUri));
    } else {
      // En caso de que no haya redirectUri, devolvemos un mensaje de sesión cerrada
      res.status(200).json({ message: 'Sesión cerrada y cookie eliminada' });
    }
  }
  
  