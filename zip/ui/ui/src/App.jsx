import { useState } from 'react'

const initialMessages = [
  {
    sender: 'Supervisor',
    text: 'Hi! Ask me anything and I will route it to the right agent.'
  }
]

function detectMathQuestion(question) {
  const lower = question.toLowerCase()
  const mathWords = [
    'plus', 'minus', 'multiply', 'divide', 'total', 'average',
    'percent', 'percentage', 'square', 'root', 'calculate',
    'profit', 'interest', 'travel', 'speed', 'distance', 'time'
  ]

  return /[0-9]|\+|\-|\*|\/|=/.test(question) || mathWords.some((word) => lower.includes(word))
}

function askSupervisor(question) {
  const clean = question.trim()

  if (!clean) {
    return {
      route: 'supervisor',
      agent: 'Supervisor',
      output: 'Please type a question before sending.'
    }
  }

  if (detectMathQuestion(clean)) {
    return {
      route: 'calculator',
      agent: 'Calculation Agent',
      output: `I routed this to the Calculation Agent. For the question: "${clean}", I would solve it using the calculator workflow.`
    }
  }

  return {
    route: 'rag',
    agent: 'RAG',
    output: `I routed this to the RAG agent. For the question: "${clean}", I would look up the knowledge base answer.`
  }
}

export default function App() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [working, setWorking] = useState('Supervisor')

  const sendMessage = (event) => {
    if (event) event.preventDefault()

    const trimmed = input.trim()
    if (!trimmed) return

    const userMessage = { sender: 'You', text: trimmed }
    const result = askSupervisor(trimmed)

    setMessages((prev) => [...prev, userMessage, { sender: 'Supervisor', text: result.output }])
    setWorking(result.agent)
    setInput('')
  }

  return (
    <div className="app-shell">
      <div className="chat-panel">
        <header className="chat-header">
          <div>
            <p className="eyebrow">Multi-Agent System</p>
            <h1>Supervisor Chat</h1>
          </div>
        </header>

        <main className="messages">
          {messages.map((message, index) => (
            <div key={`${message.sender}-${index}`} className={`bubble ${message.sender === 'You' ? 'me' : 'bot'}`}>
              <span className="sender">{message.sender}</span>
              <p>{message.text}</p>
            </div>
          ))}
        </main>

        <form className="composer" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a question..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
        </form>
      </div>

      <footer className="status-bar">
        Working: <strong>{working}</strong>
      </footer>
    </div>
  )
}
