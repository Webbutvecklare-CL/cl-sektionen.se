import React, { useEffect, useState } from "react";

export default function Departures({ data }) {
  return (
    <div className="departures">
      {data.map((departure, i) => {
        return (
          <div className="departure" key={i}>
            <div className="line">{departure.LineNumber}</div>
            <div className="destination">{departure.Destination}</div>
            <div className="display-time">{departure.DisplayTime}</div>
          </div>
        );
      })}
    </div>
  );
}
