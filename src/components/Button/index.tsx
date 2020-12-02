import React from 'react'
import { RectButtonProperties } from 'react-native-gesture-handler'

interface ButtonProps extends RectButtonProperties {
  children: string
}

import { Container, ButtonText } from './styles'

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Container {...rest}>
      <ButtonText>
        {children}
      </ButtonText>
    </Container>
  )
}

export default Button
