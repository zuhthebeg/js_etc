(function() {
	// document.body.innerText.match(/\"contents_seq\":(\d)+\,/g).map(seq => return seq.match(/\d+/)[0]);
	//function openLectureRoom(class_seq, course_code, site_id, subject_code, education_term, sysdate){	
/*
$('.btn_small').each(function(a,d){
    console.log($(d)[0].outerHTML.substring(39,75));
})
VM11263:2 openLectureRoom(1,3292,'B051',2471);
VM11263:2 openLectureRoom(1,3291,'B051',2472);
VM11263:2 openLectureRoom(1,3294,'B051',2469);
VM11263:2 openLectureRoom(1,3293,'B051',2470);
VM11263:2 openLectureRoom(1,3340,'B051',2516);
VM11263:2 openLectureRoom(1,3339,'B051',2517);

*/

	let classData_2019 = [
	{
		class_seq: "1",
		course_code: "3292",
		site_id: "B051",
		subject_code: "2471",
		contents_seq: [144407,144408,144409,144410,144411,144412,144413,144414,144415,144416,144410]
	},
	{
		class_seq: "1",
		course_code: "3291",
		site_id: "B051",
		subject_code: "2472",
		contents_seq: [144417,144418,144419,144420,144421,144422,144423,144424,144425,144426,144427,144419]
	},
	{
		class_seq: "1",
		course_code: "3294",
		site_id: "B051",
		subject_code: "2469",
		contents_seq: ["141967", "141968", "141969", "141970", "141971", "141972", "141973", "141974", "141975", "141976", "141977", "141978", "141979", "141980", "141981", "141982", "141983", "141969"]
	},
	{
		class_seq: "1",
		course_code: "3293",
		site_id: "B051",
		subject_code: "2470",
		contents_seq: [144396,144397,144398,144399,144400,144401,144402,144403,144404,144405,144406,144398]
	},

	{
		class_seq: "1",
		course_code: "3340",
		site_id: "B051",
		subject_code: "2516",
		contents_seq: ["141905", "141906", "141907", "141908", "141909", "141910", "141911", "141912", "141913", "141914", "141915", "141916", "141917", "141918", "141919", "141920", "141921", "141907"]
	},
	{
		class_seq: "1",
		course_code: "3339",
		site_id: "B051",
		subject_code: "2517",
		contents_seq: [144941,144942,144943,144944,144945,144946,144947,144948,144949,144950,144951,144952,144943]
	}




	];

	let extractedFormData = [];
	classData_2019.map(classItem => {
		let classFormdata = JSON.parse(JSON.stringify(classItem));
		classItem.contents_seq.map(contents_seq => {
			classFormdata.contents_seq = contents_seq;
			extractedFormData.push(JSON.parse(JSON.stringify(classFormdata)));
		});
	});

	function passClass(formdata) {
		return new Promise(function(resolve, reject) {
			$.ajax({
				url: "/cmi/addCmi",
				type: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
		    	},
				data: formdata,
				success: function (result) {
					console.log("Success!", result)
				},
				error: function (result) {
					console.log("Error!", result)
				}
			}).then(function(data) {
				resolve();
			}, function(err) {
				reject(err);
			});
		})
	}

	function passAllClass(classArray) {
		let failed = [];
		Promise.all(classArray.map(fd => {
			return passClass(fd)
                .then(doc => { 
                	console.log('class ' + fd.contents_seq + ' - Done');
                })
                .catch(err => {
                	failed.push(fd);
                	console.log('class ' + fd.contents_seq + ' - Error', err); 
                });
		})).then(() => {
			if (!failed.length) {
				alert("ok!");
			} else if (confirm('failed : '+ failed.length +'. retry?')) {
				return passAllClass(failed);
			}
		})
	}

	passAllClass(extractedFormData);

})()
