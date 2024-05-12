import ReactDOM from 'react-dom/client'
import App from './App'
import { NotificationContextProvider } from './reducers/notificationReducer'
import { UserContextProvider } from './reducers/userReducer'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const client = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={client}>
    <UserContextProvider>
      <NotificationContextProvider>
        <App />
      </NotificationContextProvider>
    </UserContextProvider>
  </QueryClientProvider>
)