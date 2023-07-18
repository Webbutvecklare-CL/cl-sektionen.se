export default function GråttKalender() {
  return (
    <div className="miniKalender kalenderTab gråttan månad">
      <h1 className="kalTitel">Gråttbokningar</h1>
      <iframe
        title="Gråttbokningar månadsvy"
        id="openWebCalendar månad"
        className="openWebCalendar"
        style={{
          background:
            "url('https://raw.githubusercontent.com/niccokunzmann/open-web-calendar/master/static/img/loaders/circular-loader.gif') center center no-repeat",
        }}
        src="https://kalendern-cl.vercel.app/calendar.html?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2Fkonsumclw%2540gmail.com%2Fpublic%2Fbasic.ics&amp;url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2F008gpl3s787te6jhipk5729c6g%2540group.calendar.google.com%2Fpublic%2Fbasic.ics&amp;language=sv&amp;tab=month"
        sandbox="allow-scripts allow-same-origin allow-top-navigation"
        height="400px"
        width="100%"
        loading="lazy"
      />
    </div>
  );
}
