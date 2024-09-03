
export default function handler(req, res) {
    res.status(200).json({
      authSessionId: 'mock-session-id',
      authFlow: 'sign_in',
      completed: false,
      authData: {
        email: 'user@example.com',
        phone: '+1234567890',
        firstname: 'John',
        lastname: 'Doe'
      },
      authMethods: [
        {
          name: 'EmailOrPhone',
          steps: [
            {
              stepType: ['emailOrPhone'],
              operator: 'or',
              flows: ['sign_up', 'sign_in'],
              completed: true
            },
            {
              stepType: ['verificationCode'],
              operator: 'or',
              flows: ['sign_up', 'sign_in'],
              completed: false
            }
          ],
          methodType: 'EmailOrPhone',
          inUse: true,
          enableMethod: true
        }
      ]
    });
  }
  