import React, { useState, useEffect } from "react";

import TextField from "./TextField";

export default function PostForm({ onSubmit, prefill, buttonText = "Skapa" }) {
  let [title, setTitle] = useState(prefill.title);
  let [subtitle, setSubtitle] = useState(prefill.subtitle);
  let [image, setImage] = useState(prefill.image);
  let [body, setBody] = useState(prefill.body);
  let [tags, setTags] = useState(prefill.tags);
  let [date, setDate] = useState(prefill.date);
  let [publishDate, setPublishDate] = useState(prefill.publishDate);
  let [author, setAuthor] = useState(prefill.author);

  const [error, setError] = useState("");

  // Lägg till fler strängar för fler alternativ - endast här behövs. Tänk på stor bokstav i början
  const possible_tags = ["Event", "Aktuellt", "Information", "Annat", "Viktigt", "SM", "StyM"];

  useEffect(() => {
    setTags(prefill.tags);
    prefill.tags.forEach((tag) => {
      document.querySelector(`button[name="${tag}"]`).classList.add("selected");
    });
  }, [prefill.tags]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kollar om alla inputs är ok
    let validation = validate_inputs();
    if (validation != "ok") {
      setError(validation);
      return;
    }

    let formData = {
      title,
      subtitle,
      image,
      body,
      author,
      date,
      publishDate,
      tags,
    };

    onSubmit(formData);
    setError("");
  };

  // Validera alla inputs
  const validate_inputs = (data) => {
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

    // Date inputs
    try {
      new Date(date);
    } catch {
      return "Datumet måste vara på formen åååå-mm-dd";
    }

    try {
      if (new Date(publishDate) < new Date().setHours(0, 0, 0, 0)) {
        return "Du kan inte ange ett tidigare publiceringsdatum än idag.";
      }
    } catch {
      return "Publiceringsdatumet måste vara på formen åååå-mm-dd";
    }

    // Tags
    if (tags.length < 1) {
      return "Du måste ange minst 1 kategori";
    }
    // Om inget är fel
    return "ok";
  };

  const handleTagClick = (e) => {
    //Lite halv sketchy lösning men who cares det kommer funka

    e.preventDefault();
    let tag = e.target.innerHTML;
    let idx = tags.indexOf(tag);
    if (idx > -1) {
      //Ta bort och ändra class
      tags.splice(idx, 1);

      e.target.classList.remove("selected");
    } else {
      tags.push(tag);
      e.target.classList.add("selected");
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
    setDate("");
    setPublishDate("");
    setAuthor("");

    document.querySelectorAll(".tag").forEach((elm) => {
      elm.classList.remove("selected");
    });
    document.querySelector("input[type=file]").value = "";
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Titel:</label>
        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <label>Undertitel:</label>
        <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        <label>Bild:</label>
        {image && (
          <div className="image-file">
            {image.name} <i className="fa-regular fa-trash-can" onClick={() => setImage()} />
          </div>
        )}
        {!image && <input type="file" onChange={(e) => setImage(e.target.files[0])} />}
        <label>Inlägg:</label>
        <TextField value={body} onChange={setBody} />
        <label>Författare:</label>
        <input type="text" required value={author} onChange={(e) => setAuthor(e.target.value)} />
        <div className="date-input">
          <div>
            <label>Datum:</label>
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label>Publiceringsdatum:</label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
            />
          </div>
        </div>
        <label>Kategorier:</label>
        <div className="tag-selector">
          {possible_tags.map((tag, index) => (
            <button className="tag" name={tag} key={index} onClick={handleTagClick}>
              {tag}
            </button>
          ))}
        </div>

        <button className="submit">{buttonText}</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
