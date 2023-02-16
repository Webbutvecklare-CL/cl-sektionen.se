import { useState } from 'react';

import PubliceraForm from '../components/personalrummet/PubliceraForm';

import {
    googleLogin,
    validateAccountCheck,
    createUser,
    updateUser,
} from '../utils/authUtils';

import {
    getDocs,
    collection,
    query,
    where,
    orderBy,
    limit,
} from 'firebase/firestore';
import { firestore } from '../firebase/clientApp';
import { signOut } from 'firebase/auth';
import FeedPreview from '../components/FeedPreview';

export default function Personalrummet() {
    const [screen, setScreen] = useState('login');
    const [user, setUser] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const [committeePosts, setCommitteePosts] = useState({});

    const loadCommitteePosts = (data) => {
        const postRef = collection(firestore, 'posts');
        const committeeQuery = query(
            postRef,
            where('committee', '==', data.committee),
            orderBy('publishDate', 'desc'),
            limit(5)
        );

        getDocs(committeeQuery).then((docs) => setCommitteePosts(docs));
    };

    const handleLogin = () => {
        googleLogin()
            .then((result) => {
                // Användaren har loggat in med sin förtroendevalds-mail
                // Validera kontot om det finns i databasen och har permission samt nämndtillhörighet
                validateAccountCheck(result.user)
                    .then((data) => {
                        if (data) {
                            data.uid = result.user.uid;
                            // Kontot finns inlagt i systemet
                            console.log('Inloggad');
                            setUser(data);

                            // Hämtar de senaste inläggen nämnden skapat
                            loadCommitteePosts(data);

                            setScreen('menu');
                        } else {
                            // Kontot är inte inlagt i systemet
                            console.log(
                                'Din mailadress är inte inlagd i systemet eller så saknar du behörighet!'
                            );
                            setErrorMsg(
                                'Din mailadress är inte inlagd i systemet eller så saknar du behörighet! Kontakta webbansvariga.'
                            );
                            setScreen('signup');
                        }
                    })
                    .catch((error) => {
                        // Om något gått snett vid valideringen eller inladdningen av posts
                        // ska användaren loggas ut
                        console.log(error);
                        setScreen('login');
                        setErrorMsg('Något gick fel vid valideringen!');
                        signOut();
                    });
            })
            .catch((error) => {
                console.log(error);
                setError('Fel vid inloggningen till google!');
            });
    };

    const handlesignup = () => {
        // Om den förtroendevalda inte finns i user databasen kan den lägga in sin mail och sitt namn
        googleLogin()
            .then((result) => {
                // Användaren har loggat in
                try {
                    // Försöker skapa ett doc i user databasen
                    createUser(result.user);
                    setScreen('login');
                } catch (err) {
                    // Om något gått fel med skapandet av användar-doc så loggas användaren ut
                    console.log(err);
                    signOut();
                    setErrorMsg(
                        'Det gick inte att lägga till kontot. Kolla i konsolen efter felmeddelande.'
                    );
                }
            })
            .catch((error) => {
                // Något har gått fel vid inloggningen
                console.log(error);
                setErrorMsg('Fel vid inloggningen till google!');
            });
    };

    const handleUserUpdate = () => {
        if (user) {
            updateUser(user);
        } else {
            setErrorMsg(
                'Du verkar inte vara inloggad. Prova att ladda om sidan och logga in igen.'
            );
        }
    };
    const [menuSelect, setMenuSelect] = useState('senaste');
    const setSenaste = () => setMenuSelect('senaste');
    const setPublicera = () => setMenuSelect('publicera');
    const setRedigera = () => setMenuSelect('redigera');

    return (
        <div id="contentbody">
            <h1>Personalrummet</h1>

            {user && (
                <div>
                    <div className="userInfo">
                        <p>Välkommen {user.displayName}!</p>
                        <p>
                            Nedanför kan du se {user.committee}s senaste inlägg.
                        </p>
                        {user.permission == 'moderator' && (
                            <p>
                                Du kan skapa nya eller redigera tidigare inlägg.
                                Om du ta bort ett inlägg från din nämnd kan du
                                arkivera det.
                            </p>
                        )}
                        {user.permission == 'admin' && (
                            <p>Du kan göra vad du vill.</p>
                        )}
                    </div>
                    <div
                        className="menu"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 2 + 'rem',
                        }}
                    >
                        <button onClick={setSenaste}>Senaste inläggen</button>
                        <button onClick={setRedigera}>Redigera</button>
                        <button onClick={setPublicera}>Publicera</button>
                        <button onClick={handleUserUpdate}>
                            Uppdatera uppgifter
                        </button>
                    </div>
                    {menuSelect == 'senaste' && (
                        <div>
                            {committeePosts.docs && (
                                <div>
                                    <h2>Nämndens senaste inlägg</h2>
                                    <FeedPreview docs={committeePosts.docs} />
                                </div>
                            )}
                        </div>
                    )}
                    {menuSelect == 'redigera' && (
                        <div>
                            <h2>Redigera</h2>
                        </div>
                    )}
                    {menuSelect == 'publicera' && (
                        <div>
                            <h2>Publicera</h2>
                            <PubliceraForm user={user} />
                        </div>
                    )}
                </div>
            )}

            {screen == 'login' && (
                <div>
                    <p>
                        Här kan du hitta nämndens tidigare inlägg, lägga upp nya
                        och göra andra kul grejjor!
                        <br /> För att använda alla finesser i personalrummet
                        måste du logga in!
                    </p>
                    <button onClick={handleLogin}>Logga in</button>
                </div>
            )}
            {screen == 'signup' && (
                <div>
                    <p>
                        Ditt konto verka inte vara inlagt i personalsystemet...
                        <br />
                        Klicka på &#34;Lägg till konto&#34; för att lägga till
                        din mail i systemet. Meddela därefter någon av de
                        webbansvariga att du vill ha behörighet till
                        personalrummet.
                    </p>
                    <button onClick={handlesignup}>Lägg till konto</button>
                </div>
            )}

            {/*Verktyg för alla förtroendevalda*/}
            {screen == 'updateUser' && <div></div>}
            {screen == 'error' && (
                <div>
                    <p>{error}</p>
                    <p>Vänligen kontakta webbansvariga!</p>
                </div>
            )}

            {errorMsg && <p>{errorMsg}</p>}
        </div>
    );
}
