export default function Backdrop() {

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 300,
        backdropFilter: 'blur(.5rem)'
      }}
    ></div>
  )
}