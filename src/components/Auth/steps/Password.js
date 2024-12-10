import { useState } from 'react';

import InputField from './InputField';
import { useGlobalDispatch } from '../../context/context';

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;

function Password() {
  const dispatch = useGlobalDispatch();
  const [password, setPassword] = useState('');
  const [inputError, setInputError] = useState('');

  const updatePassword = (payload) => {
    
    setPassword(payload);
    dispatch({
      type: 'requestPayload',
      payload: {
        submitAction: 'resolve',
        stepType: 'password',
        value: payload
      },
    });

    if (!passwordRegex.test(payload)) {
      setInputError('"La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un símbolo especial."');
      return;
    }
    setInputError('');
  }

  return (
    <>
      <p className="text-[#5B5D71] font-Poppins text-[14px] font-medium text-start pt-[25px] mb-[-10px]">
        Ingresa tu contraseña
      </p>
      <InputField
        type="password"
        value={password}
        onChange={(e) =>
          updatePassword(e.target.value)
        }
      />
      <div className="flex flex-col justify-center items-center">
        {inputError === '' ? null : (
          <p className="text-red-500 text-sm mt-5 font-Poppins font-light">
            {inputError}
          </p>
        )}
      </div>
    </>
  )
}

export default Password;