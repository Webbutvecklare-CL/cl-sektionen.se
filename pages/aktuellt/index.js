import PostFeed from '../../components/PostFeed';

function Aktuellt() {
    // För varje feed ska alla/ett antal inlägg fetchas
    // och för att sedan skickas in till ett <PostFeed>
    let examplefeed = [
        {
            id: '789234huifrwei',
            title: 'Gr8Bibloteket',
            subtitle: 'Önska böcker Till gr8ns bibliotek!',
            body: `I Gr8n har sektionen en samling kurslitteratur. Nu vill vi i studienämnden utöka denna samling så att den innehåller böcker som är relevanta för oss som går utbildningen just nu. Därför vill vi veta vilka böcker du saknar i Gr8n. (Ni kan även sälja/donera relevant kurslitteratur till biblioteket <3)
            https://docs.google.com/forms/d/e/1FAIpQLSefGeuMcTTPxl1RgCktD3XXHDWut1U0dOJrf-kjk0BHLWSngg/viewform`,
            author: 'Studienämnden',
            tags: ['Gr8an', 'Viktigt'],
            date: '12/20/2022',
            publicationDate: '12/20/2022',
        },
        {
            id: '89y73r490y3e4rf',
            title: 'Kylskåpet i gråttan har gått sönder',
            subtitle: 'Kylskåpet kommer tömmas tisdag 29/11',
            body: `Tyvärr har kylen i gråttan gått sönder, och på grund av detta ber vi er att hämta era matlådor och eventuella andra saker ni har i kylen så fort som möjligt. Även allt som finns bland ”free for all” behöver tömmas ur kylen, är det något du vill ha, plocka med dig det.
            Under lunchen imorgon 29/11 kommer allt som finns kvar i kylen att slängas.
            \/\/Lokalnämnden`,
            author: 'Lokalnämnden',
            tags: ['Gr8an', 'Viktigt'],
            date: '11/28/2022',
            publicationDate: '11/28/2022',
        },
    ];

    return (
        <div id="contentbody">
            <h1>Aktuellt</h1>
            <div className="feed-container">
                {/*Om det finns något i post listan så visas de i PostFeed komponenten
                    Annars visas ett fel meddelande*/}
                {examplefeed && (
                    <PostFeed blogs={examplefeed} title="Nyheter" />
                )}
                {/* {error && <div>Ett fel uppstod! {error}</div>} */}
                {/* {isPending && <div>Laddar händelser...</div>} */}

                {examplefeed && <PostFeed blogs={examplefeed} title="Events" />}
                {/* {error && <div>Ett fel uppstod! {error}</div>} */}
                {/* {isPending && <div>Laddar händelser...</div>} */}
            </div>
        </div>
    );
}
export default Aktuellt;
