import { useEffect, useState } from 'react';

import InputField from './InputField';
import { useGlobalAuthData, useGlobalDispatch } from '../../context/context';


function Firstname() {
  const dispatch = useGlobalDispatch();
  const authData = useGlobalAuthData();
  const [firstname, setFirstname] = useState('');
  const [inputError, setInputError] = useState('');

  const updateFirstname = (payload) => {
    setFirstname(payload);
    dispatch({
      type: 'requestPayload',
      payload: {
        submitAction: 'resolve',
        stepType: 'firstname',
        value: payload
      },
    });

    if (payload === '') {
      setInputError('Ingresa tu nombre');
      return;
    }
    setInputError('');
  }

  useEffect(() => {
    if (authData?.firstname) {
      setFirstname(authData.firstname);
    }
  }, [authData]);

  useEffect(() => {}, [firstname]);

  return (
    <>
      <p className="text-[#5B5D71] font-Poppins text-[14px] font-medium text-start pt-[25px] mb-[-10px]">
        Ingresa tu nombre
      </p>
      <InputField
        type="text"
        placeholder='Nombre'
        value={firstname}
        onChange={(e) =>
          updateFirstname(e.target.value)
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

export default Firstname;