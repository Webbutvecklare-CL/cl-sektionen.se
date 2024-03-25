export default function ErrorPage({ error = {}, close }) {
  return (
    <div>
      {error.header ? <h2>{error.header}</h2> : <h2>Ett fel har inträffat!</h2>}
      {error.body ? <p>{error.body}</p> : <p>Det fanns inget felmeddelande!</p>}

      <p>Vänligen kontakta webbansvariga.</p>

      {close && <button onClick={close}>Tillbaka</button>}
    </div>
  );
}
