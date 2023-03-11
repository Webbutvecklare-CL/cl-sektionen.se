import React, { useEffect } from 'react';

export default function TV({ props }) {
    useEffect(() => {
        console.log('Started fetching');
        fetch(
            `https://api.sl.se/api2/realtimedeparturesV4.json?key=${'70dd80b89a174ae395c20ec922dc83cd'}&siteid=9204&timewindow=60`
        )
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.error(err);
            });
    });
    return (
        <div>
            <p>Tv</p>
        </div>
    );
}

// export async function getStaticProps() {
//     const API_KEY = process.env.SL_API_KEY;
//     return { props: { API_KEY } };
// }
