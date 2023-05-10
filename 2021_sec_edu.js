(function() {
	
/*

1. 학습중인 과정에서 아래 코드 실행하고 추출
$('.btn_small').each(function(a,d){
    console.log($(d)[0].outerHTML.substring(39,75));
})

openLectureRoom(1,3550,'B051',2677);
openLectureRoom(1,3593,'B051',2497);
openLectureRoom(1,3597,'B051',2503);
openLectureRoom(1,3595,'B051',2499);

2. 강의페이지까지 들어가서 아래 코드 실행 (by jax)
Array.from(document.querySelectorAll('script')).at(-1).innerText.match(/\"contents_seq\":(\d)+\,/g).map(v => parseInt(v.replace(/[^0-9]/g, '')))
*/

	let classData_2023_2 = [
	{
		class_seq: "1",
		course_code: "3550",
		site_id: "B051",
		subject_code: "2677",
		contents_seq: [146977, 146978, 146990, 146991, 146992, 146993, 146994, 146995, 146996, 146997, 146988, 146998, 146999, 147000, 147001, 147002, 147003, 147004, 147005, 147006, 146989, 147007, 147008, 147009, 147010, 147011, 147012, 147013, 147014, 146990]
	},{
		class_seq: "1",
		course_code: "3593",
		site_id: "B051",
		subject_code: "2497",
		contents_seq: [144705, 144706, 144707, 144708, 144709, 144710, 144711, 144712, 144713, 144714, 144715, 144716, 144717, 144707]
	},{
		class_seq: "4",
		course_code: "3597",
		site_id: "B051",
		subject_code: "2503",
		contents_seq: [144781, 144782, 144783, 144784, 144785, 144786, 144787, 144788, 144789, 144790, 144791, 144792, 144783]
	},{
		class_seq: "3",
		course_code: "3595",
		site_id: "B051",
		subject_code: "2499",
		contents_seq: [144731, 144732, 144733, 144734, 144735, 144736, 144737, 144738, 144739, 144740, 144741, 144742, 144743, 144744, 144733]
	}




	];

	let extractedFormData = [];
	classData_2023_2.map(classItem => {
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
