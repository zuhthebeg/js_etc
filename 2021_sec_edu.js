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

https://edu.fsec.or.kr/page/elearning_new?course_code=3594&site_id=B051&class_seq=1&subject_code=2498&is_review=N&is_download=0
[144718, 144719, 144720, 144721, 144722, 144723, 144724, 144725, 144726, 144727, 144728, 144729, 144730, 144720]
https://edu.fsec.or.kr/page/elearning_new?course_code=3598&site_id=B051&class_seq=1&subject_code=2504&is_review=N&is_download=0
[144793, 144794, 144795, 144796, 144797, 144798, 144799, 144800, 144801, 144802, 144795]

2. 강의페이지까지 들어가서 아래 코드 실행 (by jax)
Array.from(document.querySelectorAll('script')).at(-1).innerText.match(/\"contents_seq\":(\d)+\,/g).map(v => parseInt(v.replace(/[^0-9]/g, '')))
*/

	let classData_2023_2 = [
	{
		class_seq: "1",
		course_code: "3594",
		site_id: "B051",
		subject_code: "2498",
		contents_seq: [144718, 144719, 144720, 144721, 144722, 144723, 144724, 144725, 144726, 144727, 144728, 144729, 144730, 144720]
	},{
		class_seq: "1",
		course_code: "3598",
		site_id: "B051",
		subject_code: "2504",
		contents_seq: [144793, 144794, 144795, 144796, 144797, 144798, 144799, 144800, 144801, 144802, 144795]
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
