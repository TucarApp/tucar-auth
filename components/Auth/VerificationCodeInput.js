import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

// Estilos para el input de verificación
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

const VerificationInput = ({ submitVerificationCode, isLoading }) => {
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  const resetCode = () => {
    inputRefs.forEach(ref => {
      ref.current.value = '';
    });
    inputRefs[0].current.focus();
    setCode(['', '', '', '']);
  };

  useEffect(() => {
    if (code.every(char => char !== '')) {
      submitVerificationCode(code.join(''));
    }
  }, [code, submitVerificationCode]);

  const handleInput = (e, index) => {
    const input = e.target;
    const nextInput = inputRefs[index + 1];
    const newCode = [...code];
    newCode[index] = input.value;

    setCode(newCode);

    if (input.value && nextInput) {
      nextInput.current.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace') {
      const previousInput = inputRefs[index - 1];
      const newCode = [...code];
      
      if (code[index] !== '') {
        newCode[index] = '';
        setCode(newCode);
      } else if (previousInput) {
        previousInput.current.focus();
        newCode[index - 1] = '';
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e) => {
    const pastedCode = e.clipboardData.getData('text');
    if (pastedCode.length === 4) {
      setCode(pastedCode.split(''));
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
          disabled={isLoading}
          type='text'  // Cambiado de 'number' a 'text'
        />
      ))}
    </div>
  );
};

export default VerificationInput;


