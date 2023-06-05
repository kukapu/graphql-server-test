
export const Notify = ({ errorMessage }) => {

  if(!errorMessage) return null
  console.log('RenderError', errorMessage)

  return (
    <div style={{ color: 'red', position: 'fixed', top: 0, width: '100%' }}>
      { typeof errorMessage === 'object' ? errorMessage.message : errorMessage }
    </div>
  )
}

