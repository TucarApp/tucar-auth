import styled from 'styled-components';

const AuthButton = styled.button`
  width: 100%; 
  max-width: 348px; 
  height: 42px;
  display: flex; 
  padding: 0; 
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  border: 1px solid var(--boton-2, #E3EDF7);
  background: var(--boton-2, #E3EDF7);


  box-shadow: -6px -6px 20px 0px #FFF, 4px 4px 20px 0px rgba(111, 140, 176, 0.41);
  margin-top: 20px; 
  color: #5B5D71;
  font-size: 15px;
`;

export default AuthButton;
