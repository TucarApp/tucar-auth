import { useEffect, useState } from 'react';

import InputField from './InputField';
import { useGlobalAuthData, useGlobalDispatch } from '../../context/context';


function EmailOrPhone() {
  const dispatch = useGlobalDispatch();
  const authData = useGlobalAuthData();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [inputError, setInputError] = useState('');

  const updateEmailOrPhone = (payload) => {
    setEmailOrPhone(payload);
    dispatch({
      type: 'requestPayload',
      payload: {
        submitAction: 'resolve',
        stepType: 'emailOrPhone', // O el stepType del paso actual
        value: payload
      },
    });

    if (payload === '') {
      setInputError('Ingresa un correo o número de teléfono');
      return;
    }
    setInputError('');
  }

  useEffect(() => {
    if (authData?.phone) {
      setEmailOrPhone(authData.phone);
    } else if (authData?.email) {
      setEmailOrPhone(authData.email);
    }
  }, [authData]);

  useEffect(() => {}, [emailOrPhone]);

  return (
    <>
    <div className='flex flex-col justify-center items-center '>
      <p className="text-[#5B5D71] font-Poppins text-[14px] font-medium text-start pt-[25px] mb-[-10px]">
        Ingresa tu correo o número de teléfono
      </p>
      <div className='h-[50px] mt-3'>
      <InputField
        type="text"
        width='320px'
        value={emailOrPhone}
        onChange={(e) =>
          updateEmailOrPhone(e.target.value.toLowerCase())
        }
      
      />
      </div>
      <div className="flex flex-col justify-center items-center">
        {inputError === '' ? null : (
          <p className="text-red-500 text-sm mt-5 font-Poppins font-light">
            {inputError}
          </p>
        )}
      </div>
      </div>
    </>
  )
}

export default EmailOrPhone;