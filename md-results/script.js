document.addEventListener('DOMContentLoaded', () => {
    const csvDataElement = document.getElementById('csv-data');
    const countySelect = document.getElementById('county-select');
    const statewideResultsDiv = document.getElementById('statewide-results');
    const countyResultsDiv = document.getElementById('county-results');
    const selectedCountyNameSpan = document.getElementById('selected-county-name');

    const csvText = csvDataElement.textContent;
    const data = parseCSV(csvText);

    // --- Data Processing ---

    const candidates = Object.keys(data[0]).filter(key =>
        key !== 'jurisdiction' && key !== 'total'
    );

    // Calculate Statewide Totals
    const statewideTotals = {};
    let statewideGrandTotal = 0;
    candidates.forEach(c => statewideTotals[c] = 0);

    data.forEach(county => {
        candidates.forEach(c => {
            statewideTotals[c] += county[c];
        });
        statewideGrandTotal += county.total;
    });

    // --- Populate UI ---

    // Display Statewide Results
    displayStatewideResults(statewideTotals, statewideGrandTotal, candidates);

    // Populate County Dropdown
    populateCountyDropdown(data);

    // --- Event Listener ---
    countySelect.addEventListener('change', (event) => {
        const selectedCountyName = event.target.value;
        if (selectedCountyName) {
            const countyData = data.find(c => c.jurisdiction === selectedCountyName);
            if (countyData) {
                displayCountyResults(countyData, candidates);
                selectedCountyNameSpan.textContent = selectedCountyName;
            } else {
                countyResultsDiv.innerHTML = '<p>Error: County data not found.</p>';
                selectedCountyNameSpan.textContent = 'N/A';
            }
        } else {
            countyResultsDiv.innerHTML = '<p>Select a county from the dropdown above to see results.</p>';
            selectedCountyNameSpan.textContent = 'N/A';
        }
    });


    // --- Helper Functions ---

    function parseCSV(csvString) {
        const lines = csvString.trim().split('\n');
        const headers = lines.shift().trim().split(',');
        const result = [];

        lines.forEach(line => {
            const values = line.trim().split(',');
            const entry = {};
            headers.forEach((header, index) => {
                const value = values[index];
                // Store jurisdiction as string, others as numbers
                entry[header] = (header === 'jurisdiction') ? value : parseInt(value, 10);
            });
            result.push(entry);
        });
        return result;
    }

    function formatPercentage(value) {
        return value.toFixed(2) + '%';
    }

    function formatNumber(num) {
        return num.toLocaleString(); // Adds commas for thousands
    }

    function displayStatewideResults(totals, grandTotal, candidateList) {
        let html = '<ul>';
        candidateList.forEach(c => {
            const percentage = grandTotal > 0 ? (totals[c] / grandTotal) * 100 : 0;
            html += `
                <li>
                    <span class="candidate-name">${c}:</span>
                    <span class="candidate-votes">${formatNumber(totals[c])} votes</span>
                    <span class="candidate-percentage">(${formatPercentage(percentage)})</span>
                </li>
            `;
        });
        html += `<li><hr style="margin: 5px 0; border-color: #eee;"><strong>Total Votes: ${formatNumber(grandTotal)}</strong></li>`;
        html += '</ul>';
        statewideResultsDiv.innerHTML = html;
    }

    function populateCountyDropdown(countyData) {
        countyData
            .sort((a, b) => a.jurisdiction.localeCompare(b.jurisdiction)) // Sort alphabetically
            .forEach(county => {
                const option = document.createElement('option');
                option.value = county.jurisdiction;
                option.textContent = county.jurisdiction;
                countySelect.appendChild(option);
            });
    }

    function displayCountyResults(countyData, candidateList) {
        let html = '<ul>';
        const countyTotal = countyData.total;

        if (countyTotal === 0) {
           html = '<p>No votes recorded for this county.</p>';
           countyResultsDiv.innerHTML = html;
           return;
        }

        candidateList.forEach(c => {
            const votes = countyData[c];
            const percentage = (votes / countyTotal) * 100;
             html += `
                <li>
                    <span class="candidate-name">${c}:</span>
                    <span class="candidate-percentage">${formatPercentage(percentage)}</span>
                    <span class="candidate-votes">(${formatNumber(votes)} votes)</span>
                </li>
            `;
        });
        html += `<li><hr style="margin: 5px 0; border-color: #eee;"><strong>Total County Votes: ${formatNumber(countyTotal)}</strong></li>`;
        html += '</ul>';
        countyResultsDiv.innerHTML = html;
    }

});