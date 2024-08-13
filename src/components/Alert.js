import { useEffect } from "react"

export default function Alert({ message, setShowAlert }) {

  useEffect(() => {
    if (setShowAlert) {
      setTimeout(() => {
        setShowAlert(false)
      }, 1000)
    }
  }, [setShowAlert])

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '2rem 5rem',
        borderRadius: '3px',
        zIndex: 200,
        backgroundColor: 'var(--color-orange)',
        color: 'var(--color-white)'
      }}
    >
      <p
        style={{
          textAlign: 'center',
          fontSize: '2rem',
        }}
      >{ message }</p>
    </div>
  )
}