import React, { useState, useEffect } from "react";
import Image from "next/image";

import TextField from "./TextField";
import { create_id } from "../../utils/postUtils";

// Taggar som kan väljas
import { INFOTAGS, EVENTSTAGS, COMMONTAGS } from "../../constants/tags";

export default function PostForm({ onSubmit, prefill, editMode = false }) {
  const [title, setTitle] = useState(prefill.title);
  const [subtitle, setSubtitle] = useState(prefill.subtitle);
  const [image, setImage] = useState(prefill.image);
  const [body, setBody] = useState(prefill.body);
  const [tags, setTags] = useState(prefill.tags);
  const [startDateTime, setStartDateTime] = useState(prefill.startDateTime);
  const [endDateTime, setEndDateTime] = useState(prefill.endDateTime);
  // const [publishDate, setPublishDate] = useState(prefill.publishDate);
  const [visibility, setVisibility] = useState(prefill.visibility);
  const [meetingNumber, setMeetingNumber] = useState(1);
  const [author, setAuthor] = useState(prefill.author);
  const [link, setLink] = useState(prefill.link);

  const [error, setError] = useState("");

  const [type, setType] = useState("");
  const [publishInCalendar, setPublishInCalendar] = useState(false);
  const [sendNotification, setSendNotification] = useState(true);

  // Sätter typ och tags från prefill
  useEffect(() => {
    if (prefill.type) {
      // Null för att handleSetType tar in ett element på första parametern
      handleSetType(null, prefill.type);
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
      // publishDate,
      visibility,
      tags: selectedTags,
      type,
      link,
      publishInCalendar,
      sendNotification,
    };

    // Om det är ett event skickar vi med start- och sluttid
    if (type == "event") {
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

    // try {
    //   if (editMode) {
    //     if (new Date(publishDate) <= new Date(prefill.publishDate)) {
    //       return "Du kan inte ange ett tidigare publiceringsdatum än det tidigare.";
    //     }
    //   } else if (new Date(publishDate) <= new Date().setHours(0, 0, 0, 0)) {
    //     return "Du kan inte ange ett tidigare publiceringsdatum än idag.";
    //   }
    // } catch {
    //   return "Publiceringsdatumet måste vara på formen åååå-mm-dd";
    // }

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
    if (type == "event") {
      // Tar bort SM om StyM om de var valda
      setTags((tags) => ({ ...tags, ...{ SM: false, StyM: false, [tag]: !selected } }));
    } else {
      setTags((tags) => ({ ...tags, ...{ [tag]: !selected } }));
    }
  };

  // När användaren väljer typ av inlägg information/event
  const handleSetType = (e, type) => {
    if (e) {
      e.preventDefault();
    }
    setType(type);

    // Ger varje tag ett på/av värde (av från början)
    const infoTags = {};
    INFOTAGS.forEach((tag) => {
      infoTags[tag] = false;
    });

    const eventTags = {};
    EVENTSTAGS.forEach((tag) => {
      eventTags[tag] = false;
    });

    const commonTags = {};
    COMMONTAGS.forEach((tag) => {
      commonTags[tag] = false;
    });

    if (type === "information") {
      setTags({ ...infoTags, ...commonTags });
    } else if (type === "event") {
      setTags({ ...eventTags, ...commonTags });
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

  // Komponenter
  const RequiredStar = () => {
    return <i className="fa-solid fa-star-of-life fa-rotate-90 required"></i>;
  };

  const Label = ({ children, required }) => {
    return (
      <label>
        {children}
        {required ? <RequiredStar /> : ""}
      </label>
    );
  };

  const ImageInput = () => {
    return (
      <>
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
      </>
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Välj vilken typ av inlägg du ska göra:</label>
        <div className="type-container">
          <button
            disabled={editMode}
            onClick={(e) => handleSetType(e, "information")}
            className={type === "information" ? "selected" : ""}>
            Information
          </button>
          <button
            disabled={editMode}
            onClick={(e) => handleSetType(e, "event")}
            className={type === "event" ? "selected" : ""}>
            Event
          </button>
        </div>
        {type && (
          <div>
            {/* Tagg väljare */}
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

            <Label required>Titel:</Label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />

            <Label>Undertitel:</Label>
            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />

            <Label>Bild:</Label>
            <ImageInput />

            <Label required>Inlägg:</Label>
            <TextField value={body} onChange={setBody} />

            <Label required>Författare:</Label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />

            {type === "event" && (
              <>
                <div className="date-input">
                  <div>
                    <Label required>Start:</Label>
                    <input
                      type="datetime-local"
                      required
                      value={startDateTime}
                      onChange={(e) => setStartDateTime(e.target.value)}
                      min={editMode ? "" : new Date().toLocaleString().substring(0, 16)}
                    />
                  </div>
                  <div>
                    <Label required>Slut:</Label>
                    <input
                      type="datetime-local"
                      required
                      value={endDateTime}
                      onChange={(e) => setEndDateTime(e.target.value)}
                      min={startDateTime}
                    />
                  </div>
                </div>
              </>
            )}

            <div className={"visibility-input"}>
              <Label>Synlighet:</Label>
              <div
                className={`visibility-button ${visibility === "public" ? "active" : ""}`}
                onClick={() => setVisibility(visibility === "public" ? "private" : "public")}>
                <i className={`fa-regular fa-eye${visibility !== "public" ? "-slash" : ""}`}></i>
              </div>
              <p>
                {visibility === "public"
                  ? "Visas på startsidan och aktuelltsidan."
                  : "Kan endast ses i personalrummet."}
              </p>
            </div>

            {/* URL */}
            <Label>
              Url:{" "}
              <div className="infobox-container">
                <i className="fa-regular fa-circle-question fa-xs"> </i>
                <span className="infobox">
                  Länken måste vara unik och får bara innehålla a-z, 0-9 samt &quot;-&quot;.
                </span>
              </div>
            </Label>
            <input
              disabled={editMode || tags.StyM || tags.SM}
              type="text"
              value={link}
              placeholder={"Ex: sm-1-23 ger länken /aktuellt/sm-1-23"}
              onChange={(e) => handleLinkInput(e.target.value)}
            />

            {/* Kalender */}
            {!editMode && type === "event" && (
              <>
                <div className="calender-input">
                  <label htmlFor="calendar">Lägg till i sektionskalendern (beta):</label>
                  <input
                    id="calendar"
                    type="checkbox"
                    checked={publishInCalendar}
                    onChange={() => setPublishInCalendar(!publishInCalendar)}
                  />
                </div>
              </>
            )}

            {!editMode && (
              <>
                <div className="calender-input">
                  <label htmlFor="notis">Skicka notis (Test):</label>
                  <input
                    id="notis"
                    type="checkbox"
                    checked={sendNotification}
                    onChange={() => setSendNotification(!sendNotification)}
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
