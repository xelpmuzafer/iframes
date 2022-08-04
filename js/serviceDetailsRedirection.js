const params = new URLSearchParams(window.location.search).get("id");
const ticketNumber = params?.split("/")[0];
if (!ticketNumber) {
  window.location.replace("#");
}
console.log({ ticketNumber });

if (ticketNumber) {
  fetch("https://web-api.cgmitaan.in/tickets/" + ticketNumber, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((response) => {
      const data = response?.data;
      const serviceMasterId =
        data?.application?.serviceCategory?.serviceMaster?.id;
      if (serviceMasterId)
        window.location.replace(
          `/document-guide/subCategory/${serviceMasterId}`
        );
      else window.location.replace("/document-guide");
    });
}
