function filterRequestPayload(item, requestPayload) {
  /*
  Non intuitive logic:
   - If the incoming stepType is social, we want to clean the requestPayload array of all items.
   - if the incoming stepType is not social, we want to clean the requestPayload array of all items that are social
     and the stepType we want to overwrite.
  */
  if (requestPayload.stepType === 'social') {
    return false;
  } else {
    if (item.stepType === 'social') return false;
    return item.stepType !== requestPayload.stepType
  }
}

const ERROR_MESSAGES = {
  'Application not found': {
    cl: 'Ups algo salió mal'
  },
  'There\'s a problem with your account. Please contact support': {
    cl: 'Hay un problema con tu cuenta. Por favor contacta a soporte'
  },
  'JWT session expired': {
    cl: 'Tu sesión ha expirado, por favor recarga la página'
  },
  'Invalid JWT session': {
    cl: 'Tu sesión es inválida, por favor recarga la página'
  },
  'Internal server error': {
    cl: 'Ups algo salió mal, por favor recarga la página'
  },
  'Invalid code': {
    cl: 'Código inválido, por favor intenta de nuevo'
  },
  'User is not active': {
    cl: 'El usuario no ha sido eliminado'
  },
  'User does not have Google account': {
    cl: 'El usuario no tiene cuenta de Google, por favor intenta con otro método'
  },
  'Invalid password': {
    cl: 'Contraseña inválida, por favor intenta de nuevo'
  },
  'Email have to be the same as the previous step': {
    cl: 'El correo debe ser el mismo ingresado en el paso anterior'
  },
  'Phone have to be the same as the previous step': {
    cl: 'El teléfono debe ser el mismo ingresado en el paso anterior'
  },
  "Phone already exists": {
    cl: 'El teléfono ya está en uso, por favor intenta con otro'
  },
  default: {
    cl: 'Ups algo salió mal, por favor recarga la página o contacta a soporte'
  }
}

function ParseErrorMessage(error) {
  if (error === '') return '';
  return ERROR_MESSAGES[error]?.cl || ERROR_MESSAGES.default.cl;
}

function AuthReducer(tasks, action) {
  switch (action.type) {
    case 'authParam': {
      return {
        ...tasks,
        authParams: action.payload,
      };
    }
    case 'completed': {
      return {
        ...tasks,
        completed: action.payload.completed,
      };
    }
    case 'authFlow': {
      return {
        ...tasks,
        authFlow: action.payload.authFlow,
      };
    }
    case 'authMethods': {
      return {
        ...tasks,
        authMethods: action.payload,
      };
    }
    case 'authData': {
      return {
        ...tasks,
        authData: action.payload,
      };
    }
    case 'requestPayload': {
      if (action.payload.stepType === 'clean') return {
        ...tasks,
        requestPayload: [],
      }
      return {
        ...tasks,
        requestPayload: [
          ...tasks.requestPayload.filter(item => filterRequestPayload(item, action.payload)),
          action.payload,
        ],
      };
    }
    case 'authenticationError': {
      const error = ParseErrorMessage(action.payload);
      return {
        ...tasks,
        authenticationError: error,
      };
    }
    default: {
      return {
        ...tasks,
        authenticationError: ERROR_MESSAGES.default.cl,
      };
    }
  }
}

export default AuthReducer;