import { useEffect, useState } from 'react';

import InputField from './InputField';
import { useGlobalAuthData, useGlobalDispatch } from '../../context/context';

const phoneRegex = /^\+?\d{10,15}$/;

function Phone() {
  const dispatch = useGlobalDispatch();
  const authData = useGlobalAuthData();
  const [phone, setPhone] = useState('');
  const [inputError, setInputError] = useState('');

  const updatePhone = (payload) => {
    
    setPhone(payload);
    dispatch({
      type: 'requestPayload',
      payload: {
        submitAction: 'resolve',
        stepType: 'phone',
        value: payload
      },
    });

    if (!phoneRegex.test(payload)) {
      setInputError('Ingresa un número de teléfono válido');
      return;
    }
    setInputError('');
  }

  useEffect(() => {
    if (authData?.phone) {
      setPhone(authData.phone);
    }
  }, [authData]);

  useEffect(() => {}, [phone]);

  return (
    <>
      <p className="text-[#5B5D71] font-Poppins text-[14px] font-medium text-start pt-[25px] mb-[-10px]">
        Ingresa tu número de teléfono
      </p>
      <InputField
        type="text"
        placeholder='+56969303121'
        value={phone}
        onChange={(e) =>
          updatePhone(e.target.value.toLowerCase())
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

export default Phone;