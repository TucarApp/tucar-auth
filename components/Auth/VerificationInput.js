import styled from 'styled-components';

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

export default VerificatonInput;
