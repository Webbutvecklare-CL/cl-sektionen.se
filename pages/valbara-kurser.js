import MarkdownRender from "../components/MarkdownRender";
import { getContentData } from "../utils/contents";
import { useState } from "react";
import Link from "next/link";

export default function Valbarakurser({ contents, courses }) {
  const CommentCarousel = ({ comments }) => {
    const [commentIdx, setCommentIdx] = useState(0);
    const goLeft = () => {
      if (commentIdx <= 0) {
        setCommentIdx(comments.length - 1);
      } else {
        setCommentIdx(commentIdx - 1);
      }
    };

    const goRight = () => {
      if (commentIdx >= comments.length - 1) {
        setCommentIdx(0);
      } else {
        setCommentIdx(commentIdx + 1);
      }
    };

    return (
      <div className="comment-wrapper">
        <i className={`fa-solid fa-angle-left`} onClick={goLeft} />
        <div className="comment">{comments[commentIdx]}</div>
        <i className={`fa-solid fa-angle-right`} onClick={goRight} />
      </div>
    );
  };

  const Course = ({ course }) => {
    const [showDetails, setShowDetails] = useState(false);
    return (
      <div className={`course  ${showDetails ? "expanded" : ""}`}>
        <div
          className="title"
          onClick={() => {
            setShowDetails(!showDetails);
          }}>
          {course.id} | {course.name}{" "}
          <i className={`fa-solid fa-angle-${showDetails ? "up" : "down"}`} />
        </div>
        <div className={`details-wrapper`}>
          <div style={{ overflow: "hidden" }}>
            <div>
              <p className="details">
                <span>HP: {course.hp}</span> <span>Smeknamn: {course.short}</span>
                <span>
                  <Link
                    href={`https://www.kth.se/student/kurser/kurs/${course.id}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    Kursbeskrivning
                  </Link>
                </span>
              </p>
            </div>
            <span>Kommentarer</span>
            <CommentCarousel comments={course.comments} />
          </div>
        </div>
      </div>
    );
  };

  const CourseList = ({ list }) => {
    return (
      <div className="course-list">
        {list.map((course, i) => {
          return <Course course={course} key={i} />;
        })}
      </div>
    );
  };

  return (
    <div id="contentbody" className="elective-courses">
      <div className="small-header">
        <h1 id="page-title">Valbara kurser</h1>
        <MarkdownRender mdData={contents["valbara-kurser"]} />
      </div>
      <h2>MAFY</h2>
      <CourseList
        list={courses.filter((course) => {
          return course.specialization.includes("mafy");
        })}
      />
      <h2>MAKE</h2>
      <CourseList
        list={courses.filter((course) => {
          return course.specialization.includes("make");
        })}
      />
      <h2>TEDA</h2>
      <CourseList
        list={courses.filter((course) => {
          return course.specialization.includes("teda");
        })}
      />
      <h2>TEMI</h2>
      <CourseList
        list={courses.filter((course) => {
          return course.specialization.includes("temi");
        })}
      />

      <div id="kursformulär" className="form-wrapper">
        <h2>Kursformulär</h2>
        <iframe
          title="kursformulär"
          src="https://docs.google.com/forms/d/e/1FAIpQLScxnTpEdIQW7FHF5aX6NX6b9riZQoU7ftxiZ3vOO_MEJXimRw/viewform?embedded=true"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          loading="lazy">
          Läser in…
        </iframe>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const contents = getContentData("valbara-kurser");
  const courses = JSON.parse(getContentData("data")["courses"]);
  return {
    props: {
      contents,
      courses,
    },
  };
}
