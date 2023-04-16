import React, { useState, useEffect } from "react";
import Image from "next/image";

import TextField from "./TextField";
import { create_id } from "../../utils/postUtils";

export default function PostForm({ onSubmit, prefill, editMode = false }) {
  const [title, setTitle] = useState(prefill.title);
  const [subtitle, setSubtitle] = useState(prefill.subtitle);
  const [image, setImage] = useState(prefill.image);
  const [body, setBody] = useState(prefill.body);
  const [tags, setTags] = useState(prefill.tags);
  const [startDateTime, setStartDateTime] = useState(prefill.startDateTime);
  const [endDateTime, setEndDateTime] = useState(prefill.endDateTime);
  const [publishDate, setPublishDate] = useState(prefill.publishDate);
  const [meetingNumber, setMeetingNumber] = useState(1);
  const [author, setAuthor] = useState(prefill.author);
  const [link, setLink] = useState(prefill.link);

  const [error, setError] = useState("");

  const [type, setType] = useState("");
  const [publishInCalendar, setPublishInCalendar] = useState(false);

  // Sätter typ och tags från prefill
  useEffect(() => {
    if (prefill.type) {
      // Null för att handleSetType tar in ett element på första parametern
      handleSetType(null, prefill.type);
    } else if (prefill.tags.includes("Event")) {
      prefill.tags.slice(prefill.tags.indexOf("Event"), 1);
      handleSetType(null, "Event");
    } else if (["Nyheter", "Annat", "Information"].some((tag) => prefill.tags.includes(tag))) {
      // Om prefill innehåller nyheter, annat eller Information antar vi att det är av typen nyhet
      handleSetType(null, "Nyheter");
    }

    // Markera de tidigare valda taggarna
    let newTags = {};
    for (let tag of prefill.tags) {
      newTags[tag] = true;
    }
    setTags((tags) => ({ ...tags, ...newTags }));
  }, [prefill.tags, prefill.type]);

  // Uppdaterar författare input med prefill
  useEffect(() => {
    setAuthor(prefill.author);
  }, [prefill.author]);

  // Om det är ett SM eller StyM så uppdatera länken efter typ och mötes nummer
  useEffect(() => {
    if (tags["SM"]) {
      setLink(create_id({ number: meetingNumber }, "SM"));
    } else if (tags["StyM"]) {
      setLink(create_id({ number: meetingNumber }, "StyM"));
    }
  }, [meetingNumber, tags]);

  // Om det inte är ett SM eller StyM så uppdateras länken efter titeln
  useEffect(() => {
    if (!(tags["SM"] || tags["StyM"])) {
      setLink(create_id(title));
    }
  }, [title, tags]);

  // Uppdaterar bild preview
  // useEffect(() => {
  //   const frame = document.getElementById("frame");
  //   console.log(image);
  //   console.log(URL.revokeObjectURL(image));
  //   const reader = new FileReader();
  //   reader.onload = function (e) {
  //     frame.attr("src", e.target.result);
  //   };
  //   reader.readAsDataURL(image);
  // }, [image]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kollar om alla inputs är ok
    let validation = validate_inputs();
    if (validation != "ok") {
      setError(validation);
      return;
    }

    let selectedTags = [];
    Object.entries(tags).forEach((pair) => {
      if (pair[1]) {
        selectedTags.push(pair[0]);
      }
    });

    let formData = {
      title,
      subtitle,
      image,
      body,
      author,
      publishDate,
      tags: selectedTags,
      type,
      publishInCalendar,
      link,
    };

    // Om det är ett event skickar vi med start- och sluttid
    if (type == "Event") {
      formData.startDateTime = startDateTime;
      formData.endDateTime = endDateTime;
    }

    onSubmit(formData);
    setError("");
  };

  // Validera alla inputs
  const validate_inputs = () => {
    if (title.length > 60) {
      return "Titeln får max vara 60 tecken lång.";
    }
    if (title.length < 3) {
      return "Titeln ska minst vara 3 tecken lång.";
    }
    if (subtitle.length > 120) {
      return "Subtiteln får max vara 120 tecken lång.";
    }

    if (body.length < 3) {
      return "Du måste ange en text med minst 3 tecken.";
    }

    if (author.length < 2) {
      return "Du måste ange en författare med minst 2 tecken.";
    }

    try {
      if (editMode) {
        if (new Date(publishDate) < new Date(prefill.publishDate)) {
          return "Du kan inte ange ett tidigare publiceringsdatum än det tidigare.";
        }
      } else if (new Date(publishDate) <= new Date().setHours(0, 0, 0, 0)) {
        return "Du kan inte ange ett tidigare publiceringsdatum än idag.";
      }
    } catch {
      return "Publiceringsdatumet måste vara på formen åååå-mm-dd";
    }

    //Kollar start- och sluttider
    try {
      if (new Date(startDateTime) > new Date(endDateTime)) {
        return "Du kan inte ange ett slutdatum tidigare än startdatumet!";
      }
    } catch {
      return "Publiceringsdatumet måste vara på formen åååå-mm-dd HH:mm";
    }

    // Om inget är fel
    return "ok";
  };

  // När användaren klickar på en tagg
  const handleTagClick = (e) => {
    e.preventDefault();
    let tag = e.target.innerHTML;
    let selected = e.target.classList.contains("selected");

    // Om det är SM eller StyM ska alla andra tagga rensas
    if (tag === "SM" || tag === "StyM") {
      setTags((tags) => {
        // Sätter alla andra taggar till false
        Object.keys(tags).forEach((key) => {
          tags[key] = false;
        });

        // Returnerar alla taggar som false förutom den nya SM/StyM
        return { ...tags, ...{ [tag]: !selected } };
      });

      return;
    }

    // Rensar link input om SM eller StyM var valda tidigare
    if (tags["SM"] || tags["StyM"]) {
      setLink("");
    }

    // Kopiera förra statet och skriver över värdet på den valda tagen
    if (type == "Event") {
      // Tar bort SM om StyM om de var valda
      setTags((tags) => ({ ...tags, ...{ SM: false, StyM: false, [tag]: !selected } }));
    } else {
      setTags((tags) => ({ ...tags, ...{ [tag]: !selected } }));
    }
  };

  // När användaren väljer typ av inlägg nyhet/event
  const handleSetType = (e, type) => {
    if (e) {
      e.preventDefault();
    }
    setType(type);
    if (type === "Nyheter") {
      setTags({
        Aktuellt: false,
        Viktigt: false,
        Information: false,
        Annat: false,
      });
    }
    if (type === "Event") {
      setTags({
        Idrott: false,
        Gasque: false,
        Pub: false,
        Lunchföreläsning: false,
        Workshop: false,
        Förtroendevalda: false,
        SM: false,
        StyM: false,
      });
    }
  };

  // Ändrar värdet så att det är en korrekt länk
  const handleLinkInput = (txt) => {
    if (txt.endsWith(" ")) {
      // Låter användaren skriva mellan slag som om de lägger till fler tecken blir ett -
      setLink(create_id(txt) + " ");
    } else if (txt.endsWith("-")) {
      // Låter användaren skriva in - som försvinner om inga fler tecken läggs till
      setLink(create_id(txt) + "-");
    } else {
      setLink(create_id(txt));
    }
  };

  // Rensa formuläret
  const clear_form = () => {
    // Nollställ allt
    setTitle("");
    setSubtitle("");
    setImage("");
    setBody("");
    setTags([]);
    setPublishDate("");
    setAuthor("");

    document.querySelectorAll(".tag").forEach((elm) => {
      elm.classList.remove("selected");
    });
    document.querySelector("input[type=file]").value = "";
  };

  // Konverterar firebase bild länk till filnamn
  const getImageName = (link) => {
    const url_token = link.split("?");
    const url = url_token[0].split("/");
    const fileName = url[url.length - 1].split("%2F")[2];
    return fileName;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Välj vilken typ av inlägg du ska göra:</label>
        <div className="type-container">
          <button
            disabled={editMode}
            onClick={(e) => handleSetType(e, "Nyheter")}
            className={type === "Nyheter" ? "selected" : ""}>
            Nyheter
          </button>
          <button
            disabled={editMode}
            onClick={(e) => handleSetType(e, "Event")}
            className={type === "Event" ? "selected" : ""}>
            Event
          </button>
        </div>
        {type && (
          <div>
            {(!editMode || !(tags["SM"] || tags["StyM"])) && (
              <>
                <label>
                  Kategorier:
                  <i className="fa-solid fa-star-of-life fa-rotate-90 required"></i>
                </label>
                <div className="tag-container">
                  <div className="tag-selector">
                    {Object.keys(tags).map((tag, index) => {
                      return (
                        <button
                          className={`tag ${tags[tag] ? "selected" : ""}`}
                          name={tag}
                          key={index}
                          onClick={handleTagClick}>
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                  {(tags["SM"] || tags["StyM"]) && (
                    <div className="meeting-input">
                      <label>
                        Mötes nummer:
                        <i className="fa-solid fa-star-of-life fa-rotate-90 required"></i>
                      </label>
                      <input
                        required
                        type="number"
                        value={meetingNumber}
                        min={0}
                        max={10}
                        width="100px"
                        onChange={(e) => setMeetingNumber(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            <label>
              Titel:
              <i className="fa-solid fa-star-of-life fa-rotate-90 required"></i>
            </label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />

            <label>Undertitel:</label>
            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />

            <label>Bild:</label>
            {image.name && (
              <>
                <div className="image-file">
                  {/* Om image är en sträng så är det en länk och då plockar vi ut filnamnet */}
                  {image.name}{" "}
                  <i
                    className="fa-regular fa-trash-can"
                    onClick={() => setImage({ name: undefined, url: undefined })}
                  />
                </div>
                <p>
                  <i>Så här kommer bilden se ut i flödet</i>
                </p>
                {/* Om det är en sträng så är det länken från firebase annars skapa en lokal url */}
                {console.log(image)}
                <Image
                  id="frame"
                  src={image.url ? image.url : URL.createObjectURL(image)}
                  width={120}
                  height={100}
                  alt="Förhandsvisning"
                />
              </>
            )}
            {!image.name && <input type="file" onChange={(e) => setImage(e.target.files[0])} />}

            <label>
              Inlägg:
              <i className="fa-solid fa-star-of-life fa-rotate-90 required"></i>
            </label>
            <TextField value={body} onChange={setBody} />

            <label>
              Författare:
              <i className="fa-solid fa-star-of-life fa-rotate-90 required"></i>
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />

            <div className="date-input">
              {type === "Event" && (
                <>
                  <div>
                    <label>
                      Start:
                      <i className="fa-solid fa-star-of-life fa-rotate-90 required"></i>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={startDateTime}
                      onChange={(e) => setStartDateTime(e.target.value)}
                      min={new Date().toLocaleString().substring(0, 16)}
                    />
                  </div>
                  <div>
                    <label>
                      Slut:
                      <i className="fa-solid fa-star-of-life fa-rotate-90 required"></i>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={endDateTime}
                      onChange={(e) => setEndDateTime(e.target.value)}
                      min={startDateTime}
                    />
                  </div>
                </>
              )}

              <div>
                <label>
                  Publiceringsdatum:
                  <i className="fa-solid fa-star-of-life fa-rotate-90 required"></i>
                </label>
                <input
                  type="date"
                  required
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  min={editMode ? "" : new Date().toLocaleDateString()}
                />
              </div>
            </div>

            <label>
              Url:{" "}
              <div className="infobox-container">
                <i className="fa-regular fa-circle-question fa-xs"> </i>
                <span className="infobox">
                  Länken måste vara unik och får bara innehålla a-z, 0-9 samt &quot;-&quot;.
                </span>
              </div>
            </label>
            <input
              disabled={editMode || tags.StyM || tags.SM}
              type="text"
              value={link}
              placeholder={"Ex: sm-1-23 ger länken /aktuellt/sm-1-23"}
              onChange={(e) => handleLinkInput(e.target.value)}
            />

            {!editMode && type === "Event" && (
              <>
                <div className="calender-input">
                  <label htmlFor="calendar">Lägg till i sektionskalendern (test):</label>
                  <input
                    id="calendar"
                    type="checkbox"
                    checked={publishInCalendar}
                    onChange={() => setPublishInCalendar(!publishInCalendar)}
                  />
                </div>
              </>
            )}

            <button className="submit">{editMode ? "Uppdatera" : "Publicera"}</button>
          </div>
        )}
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
