import Script from "next/script";
import Link from "next/link";

import Label from "@/components/personalrummet/form components/Label";

import { useState } from "react";

import styles from "@/styles/contact-form.module.css";

export default function ContactForm({
  contact = true,
  business = true,
  tv = true,
  post = true,
  mailList = true,
}) {
  const [type, setType] = useState("contact");

  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");

  const [subtitle, setSubTitle] = useState("");
  const [other, setOther] = useState("");

  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [image, setImage] = useState("");

  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("");
  // Create a ref for the reCAPTCHA widget

  const formSubmit = async (e) => {
    setStatus("Skickar meddelande...");
    e.preventDefault();

    if (!window.grecaptcha) {
      console.error("Recaptcha kunde inte laddas");
      return;
    }

    const token = await window.grecaptcha.enterprise?.execute(
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
      {
        action: "contact_form",
      }
    );

    console.log(image);

    let data = new FormData();
    data.append("type", type);
    data.append("email", email);
    data.append("token", { token, action: "contact_form" });
    data.append("name", name);
    data.append("title", title);
    data.append("body", body);
    data.append("subtitle", subtitle);
    data.append("other", other);
    data.append("startDate", startDate);
    data.append("endDate", endDate);
    data.append("image", image);

    sendMail(data);
  };

  const sendMail = (data) => {
    fetch("/api/mail", {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
      },
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setResponse({ message: "Mail sent", status: "Success" });
        setStatus("");
      })
      .catch((err) => {
        console.error("Error sending mail:", err);
        setResponse({ message: "Failed to Send!!!", status: "Failed" });
        setStatus("");
      });
  };

  return (
    <div className={styles.contactForm}>
      <Script
        src={
          "https://www.recaptcha.net/recaptcha/enterprise.js?render=" +
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
        }
      />
      <h2>Kontakta oss</h2>
      <form method="post" onSubmit={formSubmit}>
        <div>
          <Label>Vilken typ av meddelande vill du skicka?</Label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
            }}>
            {contact && <option value="contact">Skicka ett meddelande</option>}
            {business && <option value="business">Samarbete</option>}
            {tv && <option value="tv">Lägg upp något på TV:n</option>}
            {post && <option value="post">Lägg upp en nyhet</option>}
            {mailList && <option value="mailList">Prenumerera på mejlutskick</option>}
          </select>
        </div>
        {/* Namn */}
        {type !== "mailList" && (
          <div>
            <Label required>Namn:</Label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
            />
          </div>
        )}
        {/* Mejladress */}
        <div>
          <Label required>Mejladress:</Label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        {/* Title */}
        {["contact", "post", "business"].includes(type) && (
          <div>
            <Label required>{type == "post" ? "Titel" : "Ämne"}:</Label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
        )}
        {/* Subtitle */}
        {type === "post" && (
          <div>
            <Label required>Undertitel:</Label>
            <input type="text" value={subtitle} onChange={(e) => setSubTitle(e.target.value)} />
          </div>
        )}
        {/* Image */}
        {["post", "tv"].includes(type) && (
          <div>
            <Label required>Bild:</Label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
              required
            />
          </div>
        )}
        {/* Meddelande */}
        {!["mailList", "tv"].includes(type) && (
          <div>
            <Label required>Meddelande:</Label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
          </div>
        )}
        {/* TV Datum */}
        {type === "tv" && (
          <>
            <div>
              <Label required>Visas från och med:</Label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label required>Visas till och med:</Label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={
                  new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                }
              />
            </div>
          </>
        )}
        {/* Other */}
        {["post", "tv"].includes(type) && (
          <div>
            <Label required>Övrigt:</Label>
            <textarea
              value={other}
              onChange={(e) => setOther(e.target.value)}
              className={styles.other}
            />
          </div>
        )}

        <button className="g-recaptcha">Skicka</button>
        {/* Måste finnas med https://cloud.google.com/recaptcha-enterprise/docs/faq#id_like_to_hide_the_badge_what_is_allowed */}
        <div className={styles.disclaimer}>
          <p>
            Ditt meddelande sparas enligt vår <Link href={"/dokument"}>personuppgiftspolicy</Link>.
          </p>
          <p>
            Den här sidan och formuläret skyddas av reCAPTCHA Enterprise. Googles{" "}
            <Link href="https://policies.google.com/privacy?hl=sv">integritetspolicy</Link> och{" "}
            <Link href="https://policies.google.com/terms?hl=sv">användarvillkor</Link> gäller.
          </p>
        </div>
      </form>
      {response.message && <p>{response.message}</p>}
      {status && <p>{status}</p>}
    </div>
  );
}
