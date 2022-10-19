(function() {
	
/*

1. 학습중인 과정에서 아래 코드 실행하고 추출
$('.btn_small').each(function(a,d){
    console.log($(d)[0].outerHTML.substring(39,75));
})

openLectureRoom(1,3391,'B051',2577);
openLectureRoom(1,3297,'B051',2475);
openLectureRoom(4,3322,'B051',2497);
openLectureRoom(3,3321,'B051',2498);

2. 강의페이지까지 들어가서 아래 코드 실행 (by jax)
Array.from(document.querySelectorAll('script')).at(-1).innerText.match(/\"contents_seq\":(\d)+\,/g).map(v => parseInt(v.replace(/[^0-9]/g, '')))
*/

	let classData_2022_2 = [
	{
		class_seq: "1",
		course_code: "3391",
		site_id: "B051",
		subject_code: "2577",
		contents_seq: [145324, 145325, 145328, 145329, 145330, 145331, 145332, 145333, 145334, 145328]
	},{
		class_seq: "1",
		course_code: "3297",
		site_id: "B051",
		subject_code: "2475",
		contents_seq: [144449, 144450, 144451, 144452, 144453, 144454, 144455, 144456, 144457, 144458, 144459, 144451]
	},{
		class_seq: "4",
		course_code: "3322",
		site_id: "B051",
		subject_code: "2497",
		contents_seq: [144705, 144706, 144707, 144708, 144709, 144710, 144711, 144712, 144713, 144714, 144715, 144716, 144717, 144707]
	},{
		class_seq: "3",
		course_code: "3321",
		site_id: "B051",
		subject_code: "2498",
		contents_seq: [144718, 144719, 144720, 144721, 144722, 144723, 144724, 144725, 144726, 144727, 144728, 144729, 144730, 144720]
	}




	];

	let extractedFormData = [];
	classData_2022_2.map(classItem => {
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
