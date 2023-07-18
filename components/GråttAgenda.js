const GråttAgenda = () => {
  return (
    <div className="miniKalender kalenderTab gråttagendaWrapper agendaVy">
      <h1 className="kalTitel">Gråttbokningar</h1>
      <iframe
        title="Gråttbokningar agenda vy kommande dagar"
        className="openWebCalendar agenda"
        style={{
          background:
            "url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat",
        }}
        src="https://kalendern-cl.vercel.app/calendar.html?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2Fkonsumclw%2540gmail.com%2Fpublic%2Fbasic.ics&amp;language=sv&amp;tab=agenda&amp;controls=date&amp;tabs=none"
        sandbox="allow-scripts allow-same-origin allow-top-navigation"
        loading="lazy"
      />
    </div>
  );
};
export default GråttAgenda;
