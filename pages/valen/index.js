import Link from "next/link";

export default function index() {
    return (
        <div id="contentbody">
            <h1>Valens äventyr</h1>
            <ul>
                <li><Link href="valen/2023-2">SM#2 - 2023</Link></li>
                <li><Link href="valen/2023-3">SM#3 - 2023</Link></li>
            </ul>
        </div>
    );
}

