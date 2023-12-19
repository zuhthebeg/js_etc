async function processButton(d) {
  var params = $(d)[0].outerHTML.substring(39, 75);
  if (!params.includes("openLectureRoom")) return;

  var class_seq = 1;
  var course_code = params.split(",")[1];
  var site_id = params.split(",")[2].replace(/'/g, "");
  var subject_code = params.split(",")[3].replace(");", "");
  var url = `./user_e_classroom_home?class_seq=${class_seq}&course_code=${course_code}&site_id=${site_id}&subject_code=${subject_code}`;

  try {
    var w = window.open(url, "process", "width=500,height=500");

    await new Promise(resolve => setTimeout(resolve, 2000));

    w.document.querySelector("#studyStartBtn").click();

    await new Promise(resolve => setTimeout(resolve, 5000));

    // Get the contents_seq values for the subject
    let classItem = {
      class_seq: class_seq,
      course_code: course_code,
      site_id: site_id,
      subject_code: subject_code,
      contents_seq: Array.from(
        w.myCampusMainView.elearningPopup.document.querySelectorAll("script")
      )
      .at(-1)
      .innerText.match(/\"contents_seq\":(\d)+\,/g)
      .map((v) => parseInt(v.replace(/[^0-9]/g, ""))),
    };

    // Create individual form data entries for each content sequence
    let extractedFormData = [];
    classItem.contents_seq.forEach((contents_seq) => {
      let classFormdata = { ...classItem, contents_seq: contents_seq };
      extractedFormData.push(classFormdata);
    });

    // Function to pass the class using an AJAX call, returning a Promise
    async function passClass(formdata) {
      return new Promise((resolve, reject) => {
        console.log(formdata);
        // Uncomment and configure your AJAX request here
        
        $.ajax({
          url: "/cmi/addCmi",
          type: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
          data: formdata,
          success: function (result) {
            console.log("Success!", result);
            resolve();
          },
          error: function (result) {
            console.error("Error!", result);
            reject(result);
          },
        });
        
        resolve();
      });
    }

    // Function to pass all classes
    async function passAllClass(classArray) {
      for (let formdata of classArray) {
        try {
          await passClass(formdata);
          console.log("class " + formdata.contents_seq + " - Done");
        } catch (err) {
          console.error("class " + formdata.contents_seq + " - Error", err);
        }
      }
    }

    // Pass all classes
    await passAllClass(extractedFormData);

    w.myCampusMainView.elearningPopup.close();
    w.close();

  } catch (error) {
    console.error('An error occurred: ', error);
  }
}

// Loop through all buttons using async/await to control the sequence
(async function processAllButtons() {
  const buttons = $(".btn_small").toArray();
  for (let i = 0; i < buttons.length; i++) {
    await processButton(buttons[i]);
    console.log('Processing of button ' + (i + 1) + ' completed.');
  }
  location.reload()
})();

