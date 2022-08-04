const HEADER_WITH_TYPE_AND_CATEGORY = ` <tr class="ServiceTable">
                                            <th class="ServiceTable">
                                                Service Sub Category
                                            </th>
                                            <th class="ServiceTable">
                                                Sub Category
                                            </th>
                                            <th class="ServiceTable">
                                                Document Details
                                            </th>
                                        </tr>`;
setEmbedSrc = (src, name) => {
  documentEmbed = document.querySelector("#documentEmbed");
  sampleDownloadLink = document.querySelector("#sampleDownloadLink");
  documentEmbed.setAttribute("src", src);
  sampleDownloadLink.setAttribute("href", src);
  sampleDownloadLink.setAttribute("download", name);
};
getDocumentLink = (document) => {
  const docLink = document.sampleDocLink
    ? `https://files-api.cgmitaan.in/${document.sampleDocLink}`
    : null;
  if (docLink)
    return `<li><a href="javascript:void(0)" data-toggle="modal" data-target="#myModal" onclick='return setEmbedSrc("${docLink}","${document.name}")'>${document.name}</a></li>`;
  else return `<li><a href="#" >${document.name}</a></li>`;
};
getEnclosureSummary = (enclosureObj) => {
  let enclosureSummary = "";
  const enclosures = Object.keys(enclosureObj).filter(
    (val) => val !== "typeName"
  );
  enclosures.forEach((enclosure) => {
    if (enclosureObj[enclosure].documents.length > 1) {
      enclosureSummary += `<li><a href="#"><b>${enclosure}</b></a></li>`;
      enclosureSummary += `<div style="padding-left: 20px;">`;
      enclosureObj[enclosure].documents.forEach((document) => {
        enclosureSummary += getDocumentLink(document);
      });
      enclosureSummary += `</div>`;
    } else {
      enclosureSummary += getDocumentLink(enclosureObj[enclosure].documents[0]);
    }
  });
  return enclosureSummary;
};

getServiceAccordion = (serviceName, service) => {
  const buttonHtml = `<button class="accordion">${serviceName}</button>`;
  const accordionWrapper = `<div class="panel accordion-list">`;

  let content = "";
  content += `<ul> <table class="ServiceTable"><tbody>`;
  content += HEADER_WITH_TYPE_AND_CATEGORY;

  const types = Object.keys(service).filter((val) => val !== "typeName");
  types.forEach((type) => {
    const categories = Object.keys(service[type]).filter(
      (val) => val !== "typeName"
    );
    categories.forEach((category) => {
      content += ` <tr class="ServiceTable">
              <td class="ServiceTable" style="width: 25%;">${type}</td>`;
      content += `<td class="ServiceTable" style="width: 20%;">${category}</td>
              <td class="ServiceTable" style="width: 55%;">`;
      content += getEnclosureSummary(service[type][category]);
      content += "</td>";
      content += `</tr>`;
    });
  });
  content += `</tbody></table></ul>`;
  content += `</div>`;
  content = buttonHtml + accordionWrapper + content;
  return content;
};

addServiceListToHTML = (serviceListObj) => {
  let leftSectionHtmlString = "";
  const serviceList = Object.entries(serviceListObj);
  serviceList
    .splice(0, serviceList.length / 2)
    .map(([serviceName, service]) => {
      leftSectionHtmlString += getServiceAccordion(serviceName, service);
    });
  const serviceListLeftSection = document.querySelector(
    "#service-left-container"
  );
  serviceListLeftSection.insertAdjacentHTML("beforeend", leftSectionHtmlString);
  let rightSectionHtmlString = "";
  serviceList.map(([serviceName, service]) => {
    rightSectionHtmlString += getServiceAccordion(serviceName, service);
  });
  const serviceListRightSection = document.querySelector(
    "#service-right-container"
  );
  serviceListRightSection.insertAdjacentHTML(
    "beforeend",
    rightSectionHtmlString
  );
};

fetch("https://web-api.cgmitaan.in/services/summary")
  .then(function (response) {
    return response.json();
  })
  .then((response) => {
    addServiceListToHTML(response.data);
    window.setupAccordionEventListeners();
  })
  .catch((error) => {
    console.log({ error });
  });
