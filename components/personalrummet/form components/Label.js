import { solid, starOfLife, rotate90 } from "../../../styles/fontawesome.module.css";

export default function Label({ children, required }) {
  const RequiredStar = () => {
    return <i className={`${solid} ${starOfLife} ${rotate90} required`} />;
  };

  return (
    <label>
      {children}
      {required ? <RequiredStar /> : ""}
    </label>
  );
}
