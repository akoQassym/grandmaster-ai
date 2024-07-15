import styled, { css } from 'styled-components';

interface ButtonProps {
  mode: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ mode, onClick, children }) => {
  return (
    <StyledButton mode={mode} onClick={onClick}>
      {children}
    </StyledButton>
  );
};

export default Button;

const primaryStyles = css`
  background-color: ${({ theme }) => theme.highlightColor};
  color: ${({ theme }) => theme.white};

  &:hover {
    background-color: ${({ theme }) => theme.highlightColor}CC;
  }
`;

const secondaryStyles = css`
  background-color: ${({ theme }) => theme.gray};
  color: ${({ theme }) => theme.white};

  &:hover {
    background-color: ${({ theme }) => theme.gray}CC;
  }
`;

const StyledButton = styled.button<{ mode: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.mainFont};
  font-weight: ${({ theme }) => theme.fontWeightBold};
  transition: background-color 0.3s;

  ${({ mode }) => (mode === 'primary' ? primaryStyles : secondaryStyles)};
`;
