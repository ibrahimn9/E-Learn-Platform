const Admin = require("./model/admin.model.js");
const Student = require("./model/student.model.js");
const Teacher = require("./model/teacher.model.js");

// If You Want To Add Admin You Just Create An object of the admin Class And Save it

// ex  : const admin1 = new Admin(
// 	"Name",
// 	"email",
// 	"password",
// 	color || null,
// 	isVerified || null
// );

// But If You want to Create A Teacher Or Student Under This Admin You should ensure that the admin promise resolve Then try to resolve the promise
// You Can Insert Student And teacher without the reference id to Admin !! For Test
// If you want to make A groupe reference to student feel free you need to create instance of gorupe and then refrence it to class (so you should also create class instance )

// const admin1 = new Admin(
// 	"Zeddoun Admin",
// 	"lokmanezeddoun@gmail.com",
// 	"123456",
// 	null,
// 	null
// );
// const admin2 = new Admin("admin", "admin@esi-sba.dz", "admin123", null, false);
const teacher4 = new Teacher(
	"Sarah Teacher",
	"sarah@example.com",
	"password123",
	"black",
	1,
	2
);

const teacher5 = new Teacher(
	"John Doe",
	"john.doe@example.com",
	"johnnyDoe456",
	"blonde",
	1,
	2
);

const teacher6 = new Teacher(
	"Alice Smith",
	"alice.smith@example.com",
	"alice123",
	"red",
	1,
	2
);

const teacher7 = new Teacher(
	"Michael Johnson",
	"michael.j@example.com",
	"pass@word123",
	"brown",
	1,
	2
);

const teacher8 = new Teacher(
	"Linda Wang",
	"linda.wang@example.com",
	"linda987",
	"black",
	1,
	2
);

const teacher9 = new Teacher(
	"David Lee",
	"david.lee@example.com",
	"dlee456",
	"brown",
	1,
	1
);

const teacher10 = new Teacher(
	"Emily Brown",
	"emily.b@example.com",
	"emilyPass789",
	"blonde",
	1,
	2
);

const teacher11 = new Teacher(
	"Robert Garcia",
	"robert.g@example.com",
	"rg1234",
	"brown",
	1,
	2
);

const teacher12 = new Teacher(
	"Samantha Miller",
	"samantha.m@example.com",
	"sammyMiller",
	"red",
	1,
	2
);

const teacher13 = new Teacher(
	"Daniel Martinez",
	"daniel.m@example.com",
	"dannyM123",
	"black",
	1,
	1
);

const teacher14 = new Teacher(
	"Michelle Patel",
	"michelle.p@example.com",
	"mpatel987",
	"black",
	1,
	1
);

const teacher15 = new Teacher(
	"Christopher Wilson",
	"chris.w@example.com",
	"wilsonChris",
	"brown",
	1,
	2
);

const teacher16 = new Teacher(
	"Lauren Thompson",
	"lauren.t@example.com",
	"laurenT456",
	"blonde",
	1,
	1
);

const teacher17 = new Teacher(
	"Kevin Nguyen",
	"kevin.n@example.com",
	"kevin1234",
	"brown",
	1,
	1
);

const teacher18 = new Teacher(
	"Amy Taylor",
	"amy.t@example.com",
	"amyTaylor",
	"brown",
	1,
	1
);

const teacher19 = new Teacher(
	"Brian Lewis",
	"brian.l@example.com",
	"blewis456",
	"brown",
	1,
	1
);

const teacher20 = new Teacher(
	"Amanda Clark",
	"amanda.c@example.com",
	"amandaC123",
	"brown",
	1,
	1
);
const teacher21 = new Teacher(
	"Rachel White",
	"rachel.w@example.com",
	"rachel456",
	"blonde",
	true,
	1
);

const teacher22 = new Teacher(
	"Matthew Turner",
	"matthew.t@example.com",
	"mturner123",
	"brown",
	true,
	2
);

const teacher23 = new Teacher(
	"Victoria Evans",
	"victoria.e@example.com",
	"vevans789",
	"brown",
	true,
	1
);

const teacher24 = new Teacher(
	"Nathan Brooks",
	"nathan.b@example.com",
	"nbrooks456",
	"brown",
	true,
	1
);

const teacher25 = new Teacher(
	"Madison Walker",
	"madison.w@example.com",
	"madisonWalker",
	"black",
	true,
	2
);

const teacher26 = new Teacher(
	"Jason Allen",
	"jason.a@example.com",
	"jallen789",
	"brown",
	true,
	2
);
const teacher27 = new Teacher(
	"Emma Cooper",
	"emma.c@example.com",
	"emmaC123",
	"brown",
	true,
	1
);

const teacher28 = new Teacher(
	"Nicholas Morris",
	"nicholas.m@example.com",
	"nicholas123",
	"brown",
	true,
	1
);

const teacher29 = new Teacher(
	"Hannah Hill",
	"hannah.h@example.com",
	"hannahH456",
	"blonde",
	true,
	1
);

const teacher30 = new Teacher(
	"Brandon Phillips",
	"brandon.p@example.com",
	"bphillips789",
	"brown",
	true,
	2
);

const teacher31 = new Teacher(
	"Olivia Green",
	"olivia.g@example.com",
	"oliviaG123",
	"brown",
	true,
	1
);

const teacher32 = new Teacher(
	"Jacob Ward",
	"jacob.w@example.com",
	"jacobW456",
	"brown",
	true,
	2
);

const teacher33 = new Teacher(
	"Sophia Collins",
	"sophia.c@example.com",
	"sophiaC123",
	"black",
	true,
	2
);

const teacher34 = new Teacher(
	"Ethan Bennett",
	"ethan.b@example.com",
	"ethanB123",
	"brown",
	true,
	1
);

const teacher35 = new Teacher(
	"Isabella Ross",
	"isabella.r@example.com",
	"isabella123",
	"brown",
	true,
	1
);

const teacher36 = new Teacher(
	"William Powell",
	"william.p@example.com",
	"williamP456",
	"brown",
	true,
	2
);

const teacher37 = new Teacher(
	"Ava Long",
	"ava.l@example.com",
	"avaLong",
	"blonde",
	true,
	2
);

const teacher38 = new Teacher(
	"James Foster",
	"james.f@example.com",
	"jfoster123",
	"brown",
	true,
	1
);

const teacher39 = new Teacher(
	"Mia King",
	"mia.k@example.com",
	"miaK456",
	"brown",
	true,
	1
);

const teacher40 = new Teacher(
	"Alexander Reed",
	"alexander.r@example.com",
	"alexR123",
	"brown",
	true,
	1
);

const teacher41 = new Teacher(
	"Grace Bell",
	"grace.b@example.com",
	"graceBell",
	"brown",
	true,
	2
);

const teacher42 = new Teacher(
	"Logan Price",
	"logan.p@example.com",
	"loganP123",
	"brown",
	true,
	2
);

const teacher43 = new Teacher(
	"Sofia Carter",
	"sofia.c@example.com",
	"sofiaC456",
	"brown",
	true,
	2
);

const teacher44 = new Teacher(
	"Benjamin Scott",
	"benjamin.s@example.com",
	"benjamin123",
	"black",
	true,
	2
);

const teacher45 = new Teacher(
	"Charlotte Hughes",
	"charlotte.h@example.com",
	"charlotteH456",
	"brown",
	true,
	2
);

const teacher46 = new Teacher(
	"Daniel Ward",
	"daniel.w@example.com",
	"danielW123",
	"brown",
	true,
	2
);

const teacher47 = new Teacher(
	"Madeline Foster",
	"madeline.f@example.com",
	"madelineF456",
	"brown",
	true,
	2
);

const teacher48 = new Teacher(
	"Jackson Howard",
	"jackson.h@example.com",
	"jacksonHoward",
	"blonde",
	true,
	1
);

const teacher49 = new Teacher(
	"Avery Allen",
	"avery.a@example.com",
	"avery123",
	"brown",
	true,
	1
);

const teacher50 = new Teacher(
	"Chloe Young",
	"chloe.y@example.com",
	"chloeY456",
	"brown",
	true,
	2
);

// Continue similarly for teacher27 to teacher50

// const student = new Student(
// 	"zeddoun Lokmane",
// 	"l.zeddoun@esi-sba.dz",
// 	"lokmane@ronaldo",
// 	"blue",
// 	null,
// 	1,
// 	null
// );

// Promise.all([
// 	teacher1
// 		.save()
// 		.then(() => {
// 			return teacher2.save();
// 		})
// 		.then(() => {
// 			return teacher3.save();
// 		}),
// ])
// 	.then(() => {
// 		console.log("All promises resolved. Exiting program.");
// 		process.exit();
// 	})
// 	.catch((err) => {
// 		console.error("Error occurred:", err);
// 		process.exit(1); // Exit with error code
// 	});

const teachersToSave = [
	teacher4,
	teacher5,
	teacher6,
	teacher7,
	teacher8,
	teacher9,
	teacher10,
	teacher11,
	teacher12,
	teacher13,
	teacher14,
	teacher15,
	teacher16,
	teacher17,
	teacher18,
	teacher19,
	teacher20,
	teacher21,
	teacher22,
	teacher23,
	teacher24,
	teacher25,
	teacher26,
	teacher27,
	teacher28,
	teacher29,
	teacher30,
	teacher31,
	teacher32,
	teacher33,
	teacher34,
	teacher35,
	teacher36,
	teacher37,
	teacher38,
	teacher39,
	teacher40,
	teacher41,
	teacher42,
	teacher43,
	teacher44,
	teacher45,
	teacher46,
	teacher47,
	teacher48,
	teacher49,
	teacher50,
];

Promise.all(teachersToSave.map((teacher) => teacher.save()))
	.then(() => {
		console.log("All promises resolved. Exiting program.");
		process.exit();
	})
	.catch((err) => {
		console.error("Error occurred:", err);
		process.exit(1); // Exit with error code
	});
