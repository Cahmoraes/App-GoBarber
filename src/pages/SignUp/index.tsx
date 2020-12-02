import React, { useCallback, useRef } from 'react'
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'

import api from '../../services/api'

import getValidationErrors from '../../utils/getValidationErrors'
import logoImg from '../../assets/logo.png'
import Input from '../../components/Input'
import Button from '../../components/Button'

import { Container, Title, BackToSignInText, BackToSignIn } from './styles'

interface SignUpFormData {
  name: string
  email: string
  password: string
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const navigation = useNavigation()

  const emailInpuRef = useRef<TextInput>(null)
  const passwordInpuRef = useRef<TextInput>(null)

  const handleSignUp = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({})
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'No mínimo 6 dígitos')
      })
      await schema.validate(data, {
        abortEarly: false
      })
      await api.post('/users', data)
      Alert.alert('Cadastro realizado com sucesso', 'Você já pode fazer login na aplicação')
      navigation.goBack()

    } catch (err) {
      console.log(err)
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)
        formRef.current?.setErrors(errors)
        return;
      }

      Alert.alert('Erro no cadastro', 'Ocorreu um erro ao fazer cadastro, tente novamente.',
      )
    }
  }, [navigation])

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Cria sua conta</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                autoCapitalize="words"
                name="name" icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInpuRef.current?.focus()
                }}
              />

              <Input
                ref={emailInpuRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email" icon="mail" placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInpuRef.current?.focus()
                }}
              />

              <Input
                ref={passwordInpuRef}
                secureTextEntry
                name="password" icon="lock" placeholder="Senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm()
                }}
              />

            </Form>
            <Button onPress={() => {
              formRef.current?.submitForm()
            }}>Entrar</Button>

          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => { navigation.goBack() }}>
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInText>
          Voltar para Logon
        </BackToSignInText>
      </BackToSignIn>
    </>
  )
}

export default SignUp