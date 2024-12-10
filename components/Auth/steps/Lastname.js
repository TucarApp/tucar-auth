import { useEffect, useState } from 'react';

import InputField from './InputField';
import { useGlobalAuthData, useGlobalDispatch } from '../../context/context';


function Lastname() {
  const dispatch = useGlobalDispatch();
  const authData = useGlobalAuthData();
  const [lastname, setLastname] = useState('');
  const [inputError, setInputError] = useState('');

  const updateLastname = (payload) => {
    setLastname(payload);
    dispatch({
      type: 'requestPayload',
      payload: {
        submitAction: 'resolve',
        stepType: 'lastname',
        value: payload
      },
    });

    if (payload === '') {
      setInputError('Ingresa tu apellido');
      return;
    }
    setInputError('');
  }

  useEffect(() => {
    if (authData?.lastname) {
      setLastname(authData.lastname);
    }
  }, [authData]);

  useEffect(() => {}, [lastname]);

  return (
    <>
      <p className="text-[#5B5D71] font-Poppins text-[14px] font-medium text-start pt-[25px] mb-[-10px]">
        Ingresa tu apellido
      </p>
      <InputField
        type="text"
        placeholder='Apellido'
        value={lastname}
        onChange={(e) =>
          updateLastname(e.target.value.toLowerCase())
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

export default Lastname;