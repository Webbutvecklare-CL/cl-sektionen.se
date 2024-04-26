import MarkdownRender from "@/components/MarkdownRender";
import { getContentData } from "@/utils/contents";
import Link from "next/link";
import { useState } from "react";

import styles from "@/styles/valbara-kurser.module.css";

import {
	faAngleDown,
	faAngleLeft,
	faAngleRight,
	faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
			<div className={styles.commentWrapper}>
				<FontAwesomeIcon icon={faAngleLeft} onClick={goLeft} />
				<div className={styles.comment}>{comments[commentIdx]}</div>
				<FontAwesomeIcon icon={faAngleRight} onClick={goRight} />
			</div>
		);
	};

	const Course = ({ course }) => {
		const [showDetails, setShowDetails] = useState(false);
		return (
			<div className={`${styles.course}  ${showDetails && styles.expanded}`}>
				<div
					className={styles.title}
					onClick={() => {
						setShowDetails(!showDetails);
					}}
					onKeyDown={() => {
						setShowDetails(!showDetails);
					}}
				>
					{course.id} | {course.name}{" "}
					<FontAwesomeIcon icon={showDetails ? faAngleUp : faAngleDown} />
				</div>
				<div className={styles.detailsWrapper}>
					<div style={{ overflow: "hidden" }}>
						<div>
							<p className={styles.details}>
								<span>HP: {course.hp}</span>{" "}
								<span>Smeknamn: {course.short}</span>
								<span>
									<Link
										href={`https://www.kth.se/student/kurser/kurs/${course.id}`}
										target="_blank"
										rel="noopener noreferrer"
									>
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
			<div className={styles.courseList}>
				{list.map((course, i) => {
					return <Course course={course} key={i} />;
				})}
			</div>
		);
	};

	const CourseForm = () => {
		// Denna är kopplad med kod till formuläret på drive.
		// Ändras den behöver denna komponent ses över
		return (
			<form
				action="https://docs.google.com/forms/d/e/1FAIpQLScxnTpEdIQW7FHF5aX6NX6b9riZQoU7ftxiZ3vOO_MEJXimRw/formResponse"
				target="_blank"
				id="courseForm"
				method="POST"
			>
				<fieldset>
					<p>
						Här kan du ge kommentarer till valbara kurser du läst och tipsa om
						kurser som inte finns med i utbildningsplanen men som går att läsa
						som valbar.
					</p>
				</fieldset>

				<fieldset>
					<legend for="863582543">Vilken inriktning går/gick du?</legend>
					<div class="form-group">
						<div class="radio">
							<input
								type="radio"
								id="radiomafy"
								name="entry.930161229"
								value="Fysik"
								required
							/>
							<label for="radiomafy">Fysik</label>
						</div>
						<div class="radio">
							<input
								type="radio"
								id="radiomake"
								name="entry.930161229"
								value="Kemi"
								required
							/>
							<label for="radiotikt">Kemi</label>
						</div>
						<div class="radio">
							<input
								type="radio"
								id="radioteda"
								name="entry.930161229"
								value="Data"
								required
							/>
							<label for="radioteda">Data</label>
						</div>
						<div class="radio">
							<input
								type="radio"
								id="radiotemi"
								name="entry.930161229"
								value="Energi och Miljö"
								required
							/>
							<label for="radiotemi">Energi och Miljö</label>
						</div>
					</div>
				</fieldset>

				<fieldset>
					<legend for="1219756709">
						Vilka valbara kurser läste du? Ex: SF1674 Flervariabelanalys 7.5hp
					</legend>
					<div class="form-group">
						<textarea
							id="200414168"
							name="entry.200414168"
							class="form-control"
							required
						/>
					</div>
				</fieldset>

				<fieldset>
					<legend for="1144452137">
						Räknas kursen som matte ditt inriktningsämne?
					</legend>
					<div class="form-group">
						<textarea
							id="512426309"
							type="text"
							name="entry.512426309"
							class="form-control"
							required
						/>
					</div>
				</fieldset>

				<fieldset>
					<legend for="231265136">Vad tyckte du om kursen?</legend>
					<div class="form-group">
						<textarea
							id="1722070801"
							name="entry.1722070801"
							class="form-control"
						/>
					</div>
				</fieldset>

				<fieldset>
					<legend for="2141144178">
						Tips till kommande studenter. Kurslitteratur, seminarier, labbar osv
					</legend>
					<div class="form-group">
						<textarea
							id="2058513381"
							name="entry.2058513381"
							class="form-control"
						/>
					</div>
				</fieldset>

				<fieldset>
					<legend for="1787560031">Övrig kommentar</legend>
					<div class="form-group">
						<textarea
							id="1372823783"
							name="entry.1372823783"
							class="form-control"
						/>
					</div>
				</fieldset>

				<input type="hidden" name="fvv" value="1" />
				<input type="hidden" name="fbzx" value="-3961422005687902826" />
				<input type="hidden" name="pageHistory" value="0" />

				<button class="btn btn-primary" type="submit" value="Submit">
					Skicka
				</button>
			</form>
		);
	};

	return (
		<div id="contentbody" className={styles.electiveCourses}>
			<div className={"small-header"}>
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

			<div id="kursformulär">
				<h2>Kursformulär</h2>
				<CourseForm />
			</div>
		</div>
	);
}

export async function getStaticProps() {
	const contents = getContentData("valbara-kurser");
	const courses = JSON.parse(getContentData("data").courses);
	return {
		props: {
			contents,
			courses,
		},
	};
}
