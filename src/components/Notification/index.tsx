// notification component using radix ui

import { Toast } from '@radix-ui/react-toast'
import { createContext, useContext, useState } from 'react'

type Notification = {
  notification: string
  isOpen: boolean
  ttl: number
}

const NotificationContext = createContext<{
  addNotification: (notification: Notification) => void
  notification: Notification
}>({
  addNotification: () => {},
  notification: {
    notification: '',
    isOpen: false,
    ttl: 1000
  }
})

export const NotificationProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [notification, setNotification] = useState<Notification>({
    notification: '',
    isOpen: false,
    ttl: 1000
  })

  return (
    <NotificationContext.Provider
      value={{ notification, addNotification: setNotification }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)

export const Notification = () => {
  const { notification } = useNotification()
  return (
    <Toast open={notification.isOpen} content={notification.notification} />
  )
}
