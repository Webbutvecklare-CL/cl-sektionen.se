const welcome = {
	name: "Välkommen",
	id: "valkommen",
};

const inProgress = {
	name: "På gång i spexet",
	id: "pagangispexet",
};

const abouts = [
	{
		name: "Vad är ett spex?",
		id: "vadarettsaex",
	},
	{
		name: "Grupper",
		id: "grupper",
	},
	{
		name: "Dubbelspexets historia",
		id: "historia",
	},
	{
		name: "Tidigare spex",
		id: "tidigarespexs",
	},
];

const interest = {
	name: "Intresseanmälan",
	id: "intresseanmälan",
};

const contact = {
	name: "Intresseanmälan",
	id: "intresseanmälan",
};


const all_rubrics = [
	welcome,
	inProgress,
	...abouts,
	interest,
	contact,
];

const all_rubrics_ids = {};
all_rubrics_ids[welcome.id] = welcome;
all_rubrics_ids[inProgress.id] = inProgress;
for (const about of abouts) {
	all_rubrics_ids[about.id] = about;
}
all_rubrics_ids[interest.id] = interest;
all_rubrics_ids[contact.id] = contact;

export {
	welcome,
	inProgress,
	abouts,
	interest,
	contact,
	all_rubrics,
	all_rubrics_ids,
};
