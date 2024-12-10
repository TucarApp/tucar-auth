import { useEffect, useState } from 'react';

import InputField from './InputField';
import { useGlobalAuthData, useGlobalDispatch } from '../../context/context';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Email() {
  const dispatch = useGlobalDispatch();
  const authData = useGlobalAuthData();
  const [email, setEmail] = useState('');
  const [inputError, setInputError] = useState('');

  const updateEmail = (payload) => {
    
    setEmail(payload);
    dispatch({
      type: 'requestPayload',
      payload: {
        submitAction: 'resolve',
        stepType: 'email',
        value: payload
      },
    });

    if (!emailRegex.test(email)) {
      setInputError('Ingresa un correo válido');
      return;
    }
    setInputError(false);
  }

  useEffect(() => {
    if (authData?.email) {
      setEmail(authData.email);
    }
  }, [authData]);

  useEffect(() => {}, [email]);

  return (
    <>
      <p className="text-[#5B5D71] font-Poppins text-[14px] font-medium text-start pt-[25px] mb-[-10px]">
        Ingresa tu email
      </p>
      <InputField
        type="text"
        placeholder='example@example.com'
        value={email}
        onChange={(e) =>
          updateEmail(e.target.value.toLowerCase())
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

export default Email;