import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Alert, View, Text, Button, Spinner, theme } from '../../common'
import TextInput from '../../common/components/TextInput'

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    paddingTop: 50,
  },
  thankYouContainer: {
    padding: 50,
    paddingTop: 150,
  },
  description: {
    marginTop: 12,
    marginBottom: 12,
  },
  padding: {
    paddingVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: theme.colors.background,
  },
  button: {
    backgroundColor: theme.colors.pink,
    height: 42,
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
}

const submitUserInterview = async (data: {
  field1: string
  field2: string
}) => {
  const response = await fetch('https://api.tnym.de/userinterview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to submit')
  }
  return response.json()
}

const UserInterviewForm = () => {
  const [availability, setAvailability] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const mutation = useMutation({
    mutationFn: submitUserInterview,
    onSuccess: () => setSubmitted(true),
    onError: () =>
      Alert.alert('Error', 'Something went wrong. Please try again.'),
  })

  const handleSubmit = () => {
    if (!availability.trim() || !phoneNumber.trim()) {
      Alert.alert(
        'Missing Information',
        'Please fill in both fields before submitting.'
      )
      return
    }
    mutation.mutate({ field1: availability, field2: phoneNumber })
  }

  if (submitted) {
    return (
      <View style={[styles.container, styles.thankYouContainer]}>
        <Text type="h2" center bold>
          Thank you!
        </Text>
        <Text center style={styles.padding}>
          The team will check your submission and might contact you.
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text type="h2" bold>
        Share your feedback
      </Text>
      <Text style={styles.description}>
        5-minute call with a Tellonym team member today or tomorrow. We donate
        20€ to an organization for this. Once a month we share the raised amount
        on our Instagram Page.
      </Text>
      <Text type="default" bold style={styles.padding}>
        When are you available today or tomorrow?
      </Text>
      <TextInput
        value={availability}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setAvailability(e.target.value)
        }
        placeholder="add three time slots that work for you"
      />
      <Text type="default" bold style={styles.padding}>
        On what phone number can we contact you?
      </Text>
      <TextInput
        value={phoneNumber}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPhoneNumber(e.target.value)
        }
        placeholder="Your Mobile Phone"
      />
      {mutation.isLoading ? (
        <Spinner color={theme.colors.primary} style={{}} />
      ) : (
        <Button
          style={styles.button}
          borderColor="transparent"
          onPress={handleSubmit}>
          Confirm
        </Button>
      )}
    </View>
  )
}

export default UserInterviewForm
