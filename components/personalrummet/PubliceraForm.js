import Link from 'next/link';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import { doc, setDoc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firestore, storage } from '../../firebase/clientApp';

// Används för att kunna skriva rich text vilket gör att man kan formatera texten
// Målet är att WYSIWYG - What you see is what you get. Dvs så man formaterar det
// så kommer det se ut när det är publicerat.
const ReactQuill = dynamic(import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function Publicera({ user }) {
    let [title, setTitle] = useState('');
    let [subtitle, setSubtitle] = useState('');
    let [image, setImage] = useState();
    let [body, setBody] = useState('');
    let [tags, setTags] = useState([]);
    let [date, setDate] = useState('');
    let today = new Date().toISOString().substring(0, 10); // Hämtar dagens datum och sätter som default
    let [publishDate, setPublishDate] = useState(today);
    let [author, setAuthor] = useState(user.committee);

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState('');

    const [successLink, setSuccessLink] = useState(''); // False/null om inlägget inte har publicerats

    // Lägg till fler strängar för fler alternativ - endast här behövs. Tänk på stor bokstav i början
    const possible_tags = [
        'Event',
        'Aktuellt',
        'Information',
        'Annat',
        'Viktigt',
        'SM',
        'StyM',
    ];

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
        const link = await validateLink(title);
        if (!link) {
            // Användaren
            setIsPending(false);
            setError('Användaren avbröt uppladdningen.');
            return;
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
            tags: tags,
            committee: user.committee, // Länkar inlägget med nämnden
            creator: user.uid, // Länkar inlägget till användaren
        };

        const postRef = doc(firestore, 'posts', link);

        try {
            await setDoc(postRef, postData);
            console.log('Inlägget är publicerat!');
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
                const imageRef = ref(storage, `posts/${link}/${image.name}`);
                await uploadBytes(imageRef, image);
                const downloadUrl = await getDownloadURL(imageRef);

                // Uppdatera en länk till bilden i posten
                await updateDoc(postRef, {
                    image: downloadUrl,
                });

                // Hoppar ner och rensar formuläret osv
            } catch (err) {
                setError('Inlägget uppladdat men inte bilden');
                setIsPending(false);
                console.log(err);
            }
        }
        setIsPending(false);
        setError('');
        clear_form();
        setSuccessLink(link);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleTagClick = (e) => {
        //Lite halv sketchy lösning men who cares det kommer funka

        e.preventDefault();
        let tag = e.target.innerHTML;
        let idx = tags.indexOf(tag);
        if (idx > -1) {
            //Ta bort och ändra class
            tags.splice(idx, 1);

            e.target.classList.remove('selected');
        } else {
            tags.push(tag);
            e.target.classList.add('selected');
        }
    };

    // Rensa formuläret
    const clear_form = () => {
        // Nollställ allt
        setTitle('');
        setSubtitle('');
        setImage('');
        setBody('');
        setTags([]);
        setDate('');
        setPublishDate(today);
        setAuthor('');

        document.querySelectorAll('.tag').forEach((elm) => {
            elm.classList.remove('selected');
        });
        document.querySelector('input[type=file]').value = '';
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
        if (tags.length < 1) {
            return 'Du måste ange minst 1 kategori';
        }
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

    if (successLink) {
        return (
            <div>
                <p>
                    Inlägget är publicerat du hittar på följande länk:{' '}
                    <Link
                        href={`/aktuellt/${successLink}`}
                    >{`www.cl-sektionen.se/aktuellt/${successLink}`}</Link>
                    <br />
                    <i>
                        Observera att endast förtroendevalda som är inloggade
                        kan se inlägget om det har ett senare publikationsdatum.
                    </i>
                    <br />
                </p>
            </div>
        );
    }

    return (
        <div className="create">
            {user && (
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
                        onChange={(e) => setImage(e.target.files[0])}
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
                    <label>Kategorier:</label>
                    <div className="tag-selector">
                        {possible_tags.map((tag, index) => (
                            <button
                                className="tag"
                                key={index}
                                onClick={handleTagClick}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    {/* Submit */}
                    {!isPending && <button className="submit">Skapa</button>}
                    {isPending && (
                        <button className="submit" disabled>
                            Publicerar händelse...
                        </button>
                    )}
                    {error && <p>Error: {error}</p>}
                </form>
            )}
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

async function validateLink(title) {
    let exist = true;
    let unique_link = create_id(title);
    while (exist) {
        const docSnap = await getDoc(doc(firestore, 'posts', unique_link));
        if (docSnap.exists()) {
            unique_link = prompt('Ange en unik adress:', 'unik-adress');
            if (unique_link == null || unique_link == '') {
                //Användaren avbröt
                return false;
            } else {
                //Gör något test så länken faktiskt fungerar
                unique_link = create_id(title);
            }
        } else {
            // Adressen var unik -> fortsätt försöka skicka data
            exist = false;
        }
    }
    return unique_link;
}
