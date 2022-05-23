(function() {
	
/*

1. 학습중인 과정에서 아래 코드 실행하고 추출
$('.btn_small').each(function(a,d){
    console.log($(d)[0].outerHTML.substring(39,75));
})
openLectureRoom(6,3340,'B051',2516);
VM10523:2 openLectureRoom(1,3428,'B051',2619);
VM10523:2 openLectureRoom(1,3427,'B051',2620);
VM10523:2 openLectureRoom(1,3437,'B051',2612);
VM10523:2 openLectureRoom(1,3436,'B051',2613);



2. 강의페이지까지 들어가서 아래 코드 실행 (by jax)
Array.from(document.querySelectorAll('script')).at(-1).innerText.match(/\"contents_seq\":(\d)+\,/g).map(v => parseInt(v.replace(/[^0-9]/g, '')))
*/

	let classData_2021_2 = [
	{
		class_seq: "6",
		course_code: "3340",
		site_id: "B051",
		subject_code: "2516",
		contents_seq: [144930, 144931, 144932, 144933, 144934, 144935, 144936, 144937, 144938, 144939, 144940, 144932]
	},{
		class_seq: "1",
		course_code: "3428",
		site_id: "B051",
		subject_code: "2619",
		contents_seq: [146540, 146541, 146542, 146543, 146544, 146545, 146546, 146547, 146548, 146549, 146550, 146551, 146552, 146553, 146542]
	},{
		class_seq: "1",
		course_code: "3427",
		site_id: "B051",
		subject_code: "2620",
		contents_seq: [146554, 146555, 146556, 146557, 146558, 146559, 146560, 146561, 146562, 146563, 146564, 146565, 146566, 146567, 146568, 146569, 146556]
	},{
		class_seq: "1",
		course_code: "3437",
		site_id: "B051",
		subject_code: "2612",
		contents_seq: [146448, 146449, 146450, 146451, 146452, 146453, 146454, 146455, 146456, 146457, 146458, 146459, 146450]
	},{
		class_seq: "1",
		course_code: "3436",
		site_id: "B051",
		subject_code: "2613",
		contents_seq: [146460, 146461, 146462, 146463, 146464, 146465, 146466, 146467, 146468, 146469, 146470, 146471, 146472, 146473, 146462]
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
