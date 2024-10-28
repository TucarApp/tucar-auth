export default function handler(req, res) {
    if (req.method === 'GET') {
      const { redirect_uri } = req.query;
  
    
      res.setHeader('Set-Cookie', [
        'sid=; Path=/; Domain=.tucar.dev; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict',
      ]);
  
 
      if (redirect_uri) {
        res.redirect(302, decodeURIComponent(redirect_uri));
      } else {
        
        res.status(200).json({ message: 'Sesión cerrada y cookie eliminada' });
      }
    } else {
     
      res.status(405).json({ message: 'Método no permitido' });
    }
  }
  