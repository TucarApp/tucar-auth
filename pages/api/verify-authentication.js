// Mock response for verify authentication
export default function handler(req, res) {
    res.status(200).json({
      success: true,
      message: 'Authentication verified'
    });
  }
  