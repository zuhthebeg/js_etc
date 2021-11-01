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

	let classData_2021_2 = [
	{
		class_seq: "1",
		course_code: "3407",
		site_id: "B051",
		subject_code: "2592",
		contents_seq: [146070,146071,146072,146073,146074,146075,146076,146077,146078,146079,146080,146081,146082,146072]
	},
	{
		class_seq: "1",
		course_code: "3408",
		site_id: "B051",
		subject_code: "2593",
		contents_seq: [146083,146084,146085,146086,146087,146088,146089,146090,146091,146092,146093,146094,146095,146085]
	},
	{
		class_seq: "1",
		course_code: "3322",
		site_id: "B051",
		subject_code: "2497",
		contents_seq: [144705,144706,144707,144708,144709,144710,144711,144712,144713,144714,144715,144716,144717,144707]
	}




	];

	let extractedFormData = [];
	classData_2021_2.map(classItem => {
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
