import Link from "next/link";
import { useState } from "react";

const sånger = [
    { "title": "Porthos visa", "href": "/porthos_visa" },
    { "title": "Bordeaux Bordeaux", "href": "/bordeaux_bordeaux" },
    { "title": "Vikingen", "href": "/vikingen" }
]

function Sangbok() {
    const [search, setSearch] = useState("")
    console.log(search)
    return (
        <div id="contentbody">
            <h1>Sångbok</h1>
            <p>Här kommer hända saker snart!</p>

            <input 
                type="text" 
                placeholder="Sök efter sång..."
                onChange={(e) => setSearch(e.target.value)}
                className="searchbar"
            ></input>
            <br></br>

            {sånger.filter((sång) => {
                return search.toLowerCase() === "" ? sång : sång.title.toLowerCase().includes(search)
            }).map((sång) =>
                <Link 
                    href={`sangbok${sång.href}`}
                    className="sånglänk"
                >
                    {sång.title}<br></br>
                </Link>
            )}
        </div>
    );
}

export default Sangbok;