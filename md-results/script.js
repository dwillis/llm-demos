const data = `jurisdiction,harris,trump,oliver,stein,kennedy,others,total
Allegany,9231,22141,130,136,363,136,32137
Anne Arundel,171945,128892,2141,2429,3375,2790,311572
Baltimore City,195109,27984,892,3222,1875,1672,230754
Baltimore County,249958,149560,2240,4195,3858,3104,412915
Calvert,23438,29361,297,232,554,309,54191
Caroline,4860,11053,84,99,180,54,16330
Carroll,36867,62273,845,629,1182,855,102651
Cecil,17628,33871,291,286,536,219,52831
Charles,63454,26145,334,828,889,447,92097
Dorchester,6954,9390,57,138,191,42,16772
Frederick,82409,68753,970,1378,1494,1110,156114
Garrett,3456,11983,75,48,223,53,15838
Harford,62453,83050,1023,935,1559,1070,150090
Howard,124764,49425,1246,3341,1712,1803,182291
Kent,5251,5561,60,82,114,60,11128
Montgomery,386581,112637,2416,8009,4276,5302,519221
Prince George's,347038,45008,1038,5369,3428,2128,404009
Queen Anne's,11273,20200,174,153,336,211,32347
Saint Mary's,23531,33582,409,352,669,411,58954
Somerset,4054,5805,32,85,114,47,10137
Talbot,11119,11125,109,120,194,163,22830
Washington,27260,44054,363,513,811,331,73332
Wicomico,21513,24065,205,371,544,214,46912
Worcester,12431,19632,139,184,342,153,32881`;

const parsedData = data.trim().split("\n").map(row => row.split(","));
const headers = parsedData[0];
const counties = parsedData.slice(1);

const nameMap = {
  harris: "Kamala Harris",
  trump: "Donald Trump",
  oliver: "Chase Oliver",
  stein: "Jill Stein",
  kennedy: "Robert Kennedy Jr.",
  others: "Other Candidates"
};

const colorMap = {
  harris: "dem",
  trump: "rep",
  oliver: "lib",
  stein: "green",
  kennedy: "ind",
  others: "oth"
};

function formatPercent(val, total) {
  return ((val / total) * 100).toFixed(2) + "%";
}

function computeStatewide() {
  const totals = new Array(headers.length).fill(0);
  counties.forEach(row => {
    row.forEach((val, i) => {
      totals[i] += i === 0 ? 0 : parseInt(val);
    });
  });
  return totals;
}

function populateTable(tableId, dataRow, total) {
  const table = document.getElementById(tableId);
  table.innerHTML = "";
  const headerRow = document.createElement("tr");
  ["Candidate", "Votes", "Percentage"].forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  headers.slice(1, -1).forEach((key, i) => {
    const row = document.createElement("tr");
    const val = parseInt(dataRow[i + 1]);
    const percent = formatPercent(val, total);
    const barWidth = parseFloat(percent);
    row.innerHTML = `<td>${nameMap[key]}</td><td>${val}</td><td>${percent} <span class='bar ${colorMap[key]}' style='width:${barWidth * 2}px'></span></td>`;
    table.appendChild(row);
  });
}

function init() {
  const statewide = computeStatewide();
  populateTable("statewide-table", statewide, statewide[headers.length - 1]);

  const select = document.getElementById("county");
  counties.forEach(row => {
    const option = document.createElement("option");
    option.value = row[0];
    option.textContent = row[0];
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    const selected = counties.find(row => row[0] === select.value);
    populateTable("county-table", selected, parseInt(selected[headers.length - 1]));
  });

  select.value = counties[0][0];
  select.dispatchEvent(new Event("change"));
}

document.addEventListener("DOMContentLoaded", init);