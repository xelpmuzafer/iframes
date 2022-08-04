var feedbackApp = angular.module("myMitan", []);
var isHindi = window.location.pathname.indexOf("feedback_hindi") > 0;

const getRatingContainer = () => {
  return `<ul class="feedback">
  <li class="angry" value="1">
      <div>
          <svg class="eye left">
              <use xlink:href="#eye">
          </svg>
          <svg class="eye right">
              <use xlink:href="#eye">
          </svg>
          <svg class="mouth">
              <use xlink:href="#mouth">
          </svg>
      </div>
  </li>
  <li class="sad" value="2">
      <div>
          <svg class="eye left">
              <use xlink:href="#eye">
          </svg>
          <svg class="eye right">
              <use xlink:href="#eye">
          </svg>
          <svg class="mouth">
              <use xlink:href="#mouth">
          </svg>
      </div>
  </li>
  <li class="ok" value="3">
      <div></div>
  </li>
  <li class="good active" value="4">
      <div>
          <svg class="eye left">
              <use xlink:href="#eye">
          </svg>
          <svg class="eye right">
              <use xlink:href="#eye">
          </svg>
          <svg class="mouth">
              <use xlink:href="#mouth">
          </svg>
      </div>
  </li>
  <li class="happy" value="5">
      <div>
          <svg class="eye left">
              <use xlink:href="#eye">
          </svg>
          <svg class="eye right">
              <use xlink:href="#eye">
          </svg>
      </div>
  </li>
</ul>


      
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 4" id="eye">
      <path d="M1,1 C1.83333333,2.16666667 2.66666667,2.75 3.5,2.75 C4.33333333,2.75 5.16666667,2.16666667 6,1"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 7" id="mouth">
      <path d="M1,5.5 C3.66666667,2.5 6.33333333,1 9,1 C11.6666667,1 14.3333333,2.5 17,5.5"></path>
  </symbol>
</svg>`
}

const handleRatingSelection = () => {
  document.querySelectorAll('.feedback li').forEach(entry => entry.addEventListener('click', e => {
    document.querySelector("#rating").value=entry.value;
    if(!entry.classList.contains('active')) {
        document.querySelector('.feedback li.active').classList.remove('active');
        entry.classList.add('active');
    }
    e.preventDefault();
  }));
}

const getSummaryQuestions = (lastSerialNo = 0) => {
  return `<div class="input-container flex">
  <div>Q${++lastSerialNo}.</div>
  <div>
    <label for="comment">
    ${
      isHindi
        ? "क्या मितान की सेवाओं को बेहतर बनाने के लिए आप कोई सुझाव देना चाहेंगे?"
        : "Do you have any suggestion on improving the performance of Mitaan?"
    }
    </label>
    <textarea
      name="comment"
      id="comment"
      rows="10"
      cols="30"
      required
    ></textarea>
  </div>
</div>
<div class="input-container flex">
  <div>Q${++lastSerialNo}.</div>
  <div>
    <label for="rating">
      
      ${
        isHindi
          ? "आप हमारी सेवा का मूल्यांकन कैसे करना चाहेंगे?"
          : "How would you like to rate our service?"
      }
    </label>
    <div>
    <input type="hidden" value="4" name="rating" id="rating"/>
      ${getRatingContainer()}
    </div>
  </div>
</div>`;
};

const setNavigationParams = (id) => {
  document
    .querySelector("#feedbackEngLink")
    .setAttribute("href", "feedback_eng.html?id=" + id);
  document
    .querySelector("#feedbackHindiLink")
    .setAttribute("href", "feedback_hindi.html?id=" + id);
};

feedbackApp.controller("mitaan_connect", function ($scope, $http) {
  const params = new URLSearchParams(window.location.search).get("id");
  const ticketNumber = params?.split("/")[0];
  let feedbackQuestions = [];
  if (!ticketNumber) {
    window.location.replace("#");
  }
  setNavigationParams(ticketNumber);
  const questionContainer = document.querySelector("#questionContainer");

  const loader = document.querySelector("#loader");
  const formContainer = document.querySelector("#formContainer");
  const successMessage = document.querySelector("#successMessage");
  const errorMessage = document.querySelector("#errorMessage");

  $http.get("https://web-api.cgmitaan.in/tickets/" + ticketNumber).then(
    function successCallback(response) {
      console.log({ response });
      const data = response.data?.data?.application;
      const applicantName = data
        ? `${data.citizen?.firstName} ${data.citizen?.lastName}`
        : "name here";
      const applicantMobile = data?.citizen?.phoneNumber
        ? `${data.citizen?.phoneNumber}`
        : "citizen mobile here";
      const serviceName = data?.serviceCategory
        ? `${data.serviceCategory.serviceMaster?.name}`
        : "serviceName here";
      document.getElementById("name").setAttribute("value", applicantName);
      document.getElementById("mobile").setAttribute("value", applicantMobile);
      document.getElementById("service").setAttribute("value", serviceName);
    },
    function errorCallback(response) {
      document.getElementById("mainText").innerHTML = "Failed to connect..";
      document.getElementById("subText").innerHTML =
        response.data.message || "Something went wrong";
      document.getElementById("loader").style.display = "none";
    }
  );
  $http.get("https://web-api.cgmitaan.in/feedbacks/questions").then(
    (response) => {
      const data = response?.data?.data;
      if (data?.length) {
        feedbackQuestions = data;
      }
      let choiceQuestions = "";
      feedbackQuestions.forEach((question) => {
        choiceQuestions += `
        <div class="input-container flex">
        <div>Q${question.serialNo}.</div>
        <div>
          <p class="label">
            ${isHindi ? question.hindi : question.eng}
          </p>
          <div>
            <input
              type="radio"
              id="${question.id}-yes"
              name="${question.id}"
              value="YES"
              required
            />
            <label for="${question.id}-yes">${isHindi ? "हाँ" : "Yes"}</label>
            <input
              type="radio"
              id="${question.id}-no"
              name="${question.id}"
              value="NO"
              required
            />
            <label for="${question.id}-no">${isHindi ? "नहीं" : "No"}</label>
          </div>
        </div>
      </div>`;
      });
      const summaryQuestions = getSummaryQuestions(
        (feedbackQuestions?.length || 1)
      );
      questionContainer.insertAdjacentHTML(
        "afterbegin",
        choiceQuestions + summaryQuestions
      );
      loader.style.display = "none";
      formContainer.style.display = "flex";
      handleRatingSelection();
    },
    (error) => {
      console.log("error", error);
    }
  );
  questionContainer.addEventListener("submit", (event) => {
    event.preventDefault();
    const questionsResponses = feedbackQuestions.map(({ id }) => ({
      [id]: event.target.elements[id].value,
    }));
    const payload = {
      ticketNumber,
      questionsResponses: JSON.stringify(questionsResponses),
      comment: event.target.elements["comment"].value,
      rating: Number(event.target.elements["rating"].value),
    };

    loader.style.display = "flex";
    formContainer.style.display = "none";
    fetch("https://web-api.cgmitaan.in/feedbacks", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(function (response) {
        console.log(response);
        loader.style.display = "none";
        if (response.ok) {
          successMessage.style.display = "flex";
          setTimeout(() => {
            window.location.replace("#");
          }, 4000);
        } else {
          errorMessage.style.display = "flex";
        }
      })
      .catch(function (response) {
        loader.style.display = "none";
        errorMessage.style.display = "flex";
        console.log({ response });
      });
  });
});
