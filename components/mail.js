import Link from "next/link";
const Mail = ({mailadress}) => {
    return (
        <Link href={`mailto:${mailadress}`}>
            {mailadress}
        </Link>
    );
};

export default Mail;