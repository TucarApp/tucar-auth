// Mock response for authorization
export default function handler(req, res) {
    res.status(200).json({
      authSessionId: 'mock-session-id',
      authFlow: 'sign_up',
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
              completed: false
            }
          ],
          methodType: 'EmailOrPhone',
          inUse: true,
          enableMethod: true
        },
        {
          name: 'Google',
          steps: [
            {
              stepType: ['social'],
              operator: 'or',
              flows: ['sign_up', 'sign_in'],
              completed: false
            }
          ],
          methodType: 'Google',
          actionUrl: 'https://google.com',
          inUse: false,
          enableMethod: true
        },
        {
          name: 'Uber',
          steps: [
            {
              stepType: ['social'],
              operator: 'or',
              flows: ['sign_up', 'sign_in'],
              completed: false
            }
          ],
          methodType: 'Uber',
          actionUrl: 'https://uber.com',
          inUse: false,
          enableMethod: true
        }
      ]
    });
  }
  