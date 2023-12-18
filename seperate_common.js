// 강의 동영상 창에서
(function() {
  // let query = window.opener.location.search // firefox
  let query = window.parent.location.search.substring(1) // chrome
    .split('&')
    .reduce((params, param) => {
      let [key, value] = param.split('=');
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
      return params;
    }, {});

  let contents_seq = Array.from(document.querySelectorAll('script')).at(-1).innerText.match(/\"contents_seq\":(\d)+\,/g).map(v => parseInt(v.replace(/[^0-9]/g, '')));
  
  let classItem = {
    class_seq: "1",
    course_code: query.course_code,
    site_id: query.site_id,
    subject_code: query.subject_code,
    contents_seq: contents_seq
  };

  let extractedFormData = [];
  classItem.contents_seq.map(contents_seq => {
    let classFormdata = JSON.parse(JSON.stringify(classItem));
    classFormdata.contents_seq = contents_seq;
    extractedFormData.push(JSON.parse(JSON.stringify(classFormdata)));
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
        success: function(result) {
          console.log("Success!", result)
        },
        error: function(result) {
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
      } else if (confirm('failed : ' + failed.length + '. retry?')) {
        return passAllClass(failed);
      }
    })
  }

  passAllClass(extractedFormData);
})()
