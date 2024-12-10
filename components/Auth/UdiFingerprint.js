import { useEffect, useState } from 'react'
import getBrowserFingerprint from 'get-browser-fingerprint';


function UdiFingerprint() {
  const [fingerprint, setfingerprint] = useState(null);

  const generateFingerprint = async () => {
    const browserFingerprint = await getBrowserFingerprint();
    setfingerprint(browserFingerprint.toString());
  }
  useEffect(() => {
    generateFingerprint();
  }, []);

  useEffect(() => {}, [fingerprint]);

  return fingerprint
}

export default UdiFingerprint