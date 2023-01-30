import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

import { doc, setDoc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firestore, storage } from '../firebase/clientApp';

// Används för att kunna skriva rich text vilket gör att man kan formatera texten
// Målet är att WYSIWYG - What you see is what you get. Dvs så man formaterar det
// så kommer det se ut när det är publicerat.
const ReactQuill = dynamic(import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

function Publicera() {
    let [title, setTitle] = useState('');
    let [subtitle, setSubtitle] = useState('');
    let [image, setImage] = useState();
    let [body, setBody] = useState('');
    let [tags, setTags] = useState('');
    let [date, setDate] = useState('');
    let today = new Date().toISOString().substring(0, 10); // Hämtar dagens datum och sätter som default
    let [publishDate, setPublishDate] = useState(today);
    let [author, setAuthor] = useState('');

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState('');

    // Skickar allt till databasen
    const handleSubmit = async (e) => {
        setIsPending(true);
        e.preventDefault();

        // Kollar om alla inputs är ok
        let validation = validate_inputs();
        if (validation != 'ok') {
            setError(validation);
            setIsPending(false);
            return;
        }

        // Validera id/länk
        // Om ej unik be användaren specificera en adress kollar därefter om den är unik
        let exist = true;
        let unique_link = create_id(title);
        while (exist) {
            const docSnap = await getDoc(doc(firestore, 'posts', unique_link));
            if (docSnap.exists()) {
                unique_link = prompt('Ange en unik adress:', 'unik-adress');
                if (unique_link == null || unique_link == '') {
                    //Användaren avbröt
                    setIsPending(false);
                    setError('Adressen var ej unik.');
                    return;
                } else {
                    //Gör något test så länken faktiskt fungerar
                }
            } else {
                // Adressen var unik -> fortsätt försöka skicka data
                exist = false;
            }
        }

        // Skickar data
        let postData = {
            title: title,
            subtitle: subtitle,
            image: '',
            body: body,
            author: author,
            date: Timestamp.fromDate(new Date(date)),
            publishDate: Timestamp.fromDate(new Date(publishDate)),
            tags: [tags],
        };
        const postRef = doc(firestore, 'posts', unique_link);

        try {
            await setDoc(postRef, postData);
        } catch (err) {
            setError('Kunde inte ladda upp inlägget');
            setIsPending(false);
            alert('Kunde inte ladda upp inlägget');
            console.log(err);
        }

        // Kolla om det finns en bild
        if (image) {
            // Ladda upp bilden
            try {
                const imageRef = ref(
                    storage,
                    `posts/${unique_link}/${image.name}`
                );
                await uploadBytes(imageRef, image);
                const downloadUrl = await getDownloadURL(imageRef);

                // Uppdatera en länk till bilden i posten
                await updateDoc(postRef, {
                    image: downloadUrl,
                });

                setIsPending(false);
                setError('');
                clear_form();
                alert('Inlägget är publicerat');
            } catch (err) {
                setError('Inlägget uppladdat men inte bilden');
                setIsPending(false);
                console.log(err);
            }
        }
    };

    // Rensa formuläret
    const clear_form = () => {
        // Nollställ allt
        setTitle('');
        setSubtitle('');
        setImage('');
        setBody('');
        setTags('');
        setDate('');
        setPublishDate(today);
        setAuthor('');
    };

    // Validera alla inputs
    const validate_inputs = () => {
        if (title.length > 60) {
            return 'Titeln får max vara 60 tecken lång.';
        }
        if (title.length < 3) {
            return 'Titeln ska minst vara 3 tecken lång.';
        }
        if (subtitle.length > 120) {
            return 'Subtiteln får max vara 120 tecken lång.';
        }

        if (body.length < 3) {
            return 'Du måste ange en text med minst 3 tecken.';
        }

        if (author.length < 2) {
            return 'Du måste ange en författare med minst 2 tecken.';
        }

        // Date inputs
        try {
            new Date(date);
        } catch {
            return 'Datumet måste vara på formen åååå-mm-dd';
        }

        try {
            if (new Date(publishDate) < new Date().setHours(0, 0, 0, 0)) {
                return 'Du kan inte ange ett tidigare publiceringsdatum än idag.';
            }
        } catch {
            return 'Publiceringsdatumet måste vara på formen åååå-mm-dd';
        }

        // Tags

        // Om inget är fel
        return 'ok';
    };

    // Quill toolbar stuff
    let modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ color: [] }],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link'],
            ['clean'],
        ],
    };

    let formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'color',
    ];

    return (
        <div id="contentbody">
            <h1>Publicera</h1>

            <div className="create">
                <form onSubmit={handleSubmit}>
                    <label>Titel:</label>
                    <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label>Subtitel:</label>
                    <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                    />
                    <label>Bild:</label>
                    <input
                        type="file"
                        onChange={(e) => {
                            setImage(e.target.files[0]);
                            console.log(e.target.files[0]);
                        }}
                    />
                    <label>Inlägg:</label>
                    <ReactQuill
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        value={body}
                        onChange={setBody}
                        required
                    ></ReactQuill>
                    <label>Författare:</label>
                    <input
                        id="today"
                        type="text"
                        required
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                    <div className="date-input">
                        <div>
                            <label>Datum:</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
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
                    <label>Taggar:</label>
                    <select
                        required
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    >
                        <option value="">Välj typ</option>
                        <option value="event">Event</option>
                        <option value="information">Information</option>
                        <option value="annat">Annat</option>
                    </select>

                    {/* Submit */}
                    {!isPending && <button>Skapa</button>}
                    {isPending && (
                        <button disabled>Publicerar händelse...</button>
                    )}
                    {error && <p>Error: {error}</p>}
                </form>
            </div>
        </div>
    );
}

function create_id(title) {
    title = title.toLowerCase();
    title = title.replace(/[åä]/g, 'a');
    title = title.replace(/ö/g, 'o');
    title = title.replace(/([\W_]+){1,}/g, '-'); // Tar bort alla konstiga tecken
    title = title.replace(/[ ]{1,}/g, '-'); // Byter ut alla mellanslag till -
    title = title.replace(/-*$/, ''); // Tar bort alla bindestreck i slutet

    return title;
}

export default Publicera;
