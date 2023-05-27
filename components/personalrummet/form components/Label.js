const RequiredStar = () => {
  return <i className="fa-solid fa-star-of-life fa-rotate-90 required"></i>;
};

export default function Label({ children, required }) {
  return (
    <label>
      {children}
      {required ? <RequiredStar /> : ""}
    </label>
  );
}
