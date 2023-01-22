import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Används för att kunna skriva rich text vilket gör att man kan formatera texten
// Målet är att WYSIWYG - What you see is what you get. Dvs så man formaterar det
// så kommer det se ut när det är publicerat.
const ReactQuill = dynamic(import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

function Publicera() {
    let [title, setTitle] = useState('');
    let [subtitle, setSubtitle] = useState('');
    let [image, setImage] = useState(null);
    let [body, setBody] = useState('');
    let [tags, setTags] = useState('');
    let [date, setDate] = useState('');
    let today = new Date().toISOString().substring(0, 10); // Hämtar dagens datum och sätter som default
    let [publicationDate, setPublicationDate] = useState(today);
    let [author, setAuthor] = useState('');

    const [isPending, setIsPending] = useState(false);

    // Skickar allt till databasen
    const handleSubmit = (e) => {
        setIsPending(true);
        e.preventDefault();
        return;
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
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    <label>Inlägg:</label>
                    <ReactQuill
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        value={body}
                        onChange={setBody}
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
                                value={publicationDate}
                                onChange={(e) =>
                                    setPublicationDate(e.target.value)
                                }
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
                        <option value="fest">Event</option>
                        <option value="lunch">Information</option>
                        <option value="annat">Annat</option>
                    </select>

                    {/* Submit */}
                    {!isPending && <button>Skapa</button>}
                    {isPending && (
                        <button disabled>Publicera händelse...</button>
                    )}
                </form>
            </div>
        </div>
    );
}
export default Publicera;
