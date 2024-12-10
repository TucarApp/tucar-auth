import { useState, useRef } from 'react';
import styled from 'styled-components';

import { useGlobalDispatch } from '../../context/context';

const VerificatonInput = styled.input`
  width: 20px;
  height: 66px;
  flex: 1;
  border-radius: 4px;
  border: 1px solid var(--Blanco, #FFF);
  background: #E3EDF7;
  box-shadow: -4px -4px 9px 0px rgba(255, 255, 255, 0.88) inset, 
              4px 4px 14px 0px #D9D9D9 inset;
  ::placeholder,
  ::-webkit-input-placeholder {
    color: #5b5d71;
  }
  :-ms-input-placeholder {
    color: red;
  }
  
  font-size: 22px;
  text-align: center;
  margin-top: 15px;
  color: #5b5d71;
  justify-content: center;
  align-items: center;

  &.error {
    border-color: #FF0000;
    box-shadow: none;
    background: #FFE5E5;
  }
`;

function VerificationCode() {
  const dispatch = useGlobalDispatch();
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];
  const [inputError, setInputError] = useState('');

  const handleInput = (e, index) => {
    const input = e.target;
    const nextInput = inputRefs[index + 1];

    if (input.value && nextInput) {
      nextInput.current.focus();
    }

    if (inputRefs[0].current.value && inputRefs[1].current.value && inputRefs[2].current.value && inputRefs[3].current.value) {
      const code = inputRefs.map((inputRef) => inputRef.current.value).join('');
      dispatch({
        type: 'requestPayload',
        payload: {
          submitAction: 'resolve',
          stepType: 'verificationCode',
          value: code
        },
      })
      setInputError('');
    } else {
      setInputError('Por favor completa todos los campos.');
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace') {
      const previousInput = inputRefs[index - 1];
      inputRefs[index].current.value = '';
      if (previousInput) {
        previousInput.current.focus();
      }
    }
  };

  const handlePaste = (e) => {
    const pastedCode = e.clipboardData.getData('text');
    if (pastedCode.length === 4) {
      inputRefs.forEach((inputRef, index) => {
        inputRef.current.value = pastedCode.charAt(index);
      });
    }
  };

  const handleKeyPress = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };

  return (
    <>
      <p className="text-[#5B5D71] font-Poppins text-[14px] font-medium text-start pt-[25px] mb-[-10px]">
        Ingresa el código que hemos enviado al número de teléfono
      </p>
      <div className="flex gap-x-[25px] lg:w-[350px]">
        {[0, 1, 2, 3].map((index) => (
          <VerificatonInput
            key={index}
            ref={inputRefs[index]}
            maxLength={1}
            className="verification-input"
            onChange={(e) => handleInput(e, index)}
            onKeyDown={(e) => handleBackspace(e, index)}  // Detectar la tecla Backspace
            onPaste={handlePaste}
            onKeyPress={handleKeyPress}
            type='text'  // Cambiado de 'number' a 'text'
          />
        ))}
      </div>
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

export default VerificationCode;