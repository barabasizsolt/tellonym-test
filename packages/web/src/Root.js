import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { events } from '@tellonym/core/events'
import { Style, StyleRoot as StyleProvider } from 'radium'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider as StateProvider } from 'react-redux'
import { _, globalStylesheet } from './modules/common'
import { Router } from './modules/navigation/components/Router'
import { configureStore } from './modules/store/configureStore'

const queryClient = new QueryClient()

const store = configureStore()
_.setStore(store)

class App extends React.Component {
  componentDidMount() {
    store.dispatch(events.init())
    store.dispatch(events.mount())
  }

  render() {
    return (
      <StateProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <StyleProvider>
            <Style rules={globalStylesheet} />
            <Router />
          </StyleProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </StateProvider>
    )
  }
}

const container = document.getElementById('root')
const root = createRoot(container)

root.render(<App />)
