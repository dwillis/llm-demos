// Global variable to store our election data
let electionData = [];
let statewideResults = {};

// Function to load and parse the CSV data
async function loadData() {
    try {
        // Fetch the CSV file
        const response = await fetch('md_pres_county.csv');
        const csvText = await response.text();
        
        // Parse the CSV data
        const rows = csvText.split('\n');
        const headers = rows[0].split(',');
        
        // Process each row of data
        for (let i = 1; i < rows.length; i++) {
            if (rows[i].trim() === '') continue; // Skip empty rows
            
            const values = rows[i].split(',');
            const county = {};
            
            // Create an object for each county with its data
            headers.forEach((header, index) => {
                // Convert numeric values to numbers
                if (index > 0) {
                    county[header.trim()] = parseInt(values[index].trim());
                } else {
                    county[header.trim()] = values[index].trim();
                }
            });
            
            electionData.push(county);
        }
        
        // Calculate statewide totals
        statewideResults = {
            jurisdiction: 'Statewide',
            harris: 0,
            trump: 0,
            oliver: 0,
            stein: 0,
            kennedy: 0,
            others: 0,
            total: 0
        };
        
        electionData.forEach(county => {
            statewideResults.harris += county.harris;
            statewideResults.trump += county.trump;
            statewideResults.oliver += county.oliver;
            statewideResults.stein += county.stein;
            statewideResults.kennedy += county.kennedy;
            statewideResults.others += county.others;
            statewideResults.total += county.total;
        });
        
        // Populate the county dropdown
        populateCountyDropdown();
        
        // Show statewide results by default
        displayResults(statewideResults);
        
    } catch (error) {
        console.error('Error loading election data:', error);
        document.body.innerHTML = '<h1>Error loading data. Please try again later.</h1>';
    }
}

// Function to populate the county dropdown
function populateCountyDropdown() {
    const dropdown = document.getElementById('county-select');
    
    // Sort counties alphabetically
    electionData.sort((a, b) => a.jurisdiction.localeCompare(b.jurisdiction));
    
    // Add each county as an option
    electionData.forEach(county => {
        const option = document.createElement('option');
        option.value = county.jurisdiction;
        option.textContent = county.jurisdiction;
        dropdown.appendChild(option);
    });
    
    // Add event listener to the dropdown
    dropdown.addEventListener('change', handleCountyChange);
}

// Function to handle county selection change
function handleCountyChange(event) {
    const selectedValue = event.target.value;
    
    if (selectedValue === 'statewide') {
        displayResults(statewideResults);
    } else {
        const selectedCounty = electionData.find(county => county.jurisdiction === selectedValue);
        if (selectedCounty) {
            displayResults(selectedCounty);
        }
    }
}

// Function to display results for a selected county or statewide
function displayResults(data) {
    // Update the title
    document.getElementById('results-title').textContent = 
        data.jurisdiction === 'Statewide' ? 'Statewide Results' : `${data.jurisdiction} County Results`;
    
    // Update vote counts
    document.getElementById('harris-votes').textContent = formatNumber(data.harris);
    document.getElementById('trump-votes').textContent = formatNumber(data.trump);
    document.getElementById('oliver-votes').textContent = formatNumber(data.oliver);
    document.getElementById('stein-votes').textContent = formatNumber(data.stein);
    document.getElementById('kennedy-votes').textContent = formatNumber(data.kennedy);
    document.getElementById('others-votes').textContent = formatNumber(data.others);
    document.getElementById('total-votes').textContent = formatNumber(data.total);
    
    // Calculate and update percentages
    document.getElementById('harris-percentage').textContent = 
        calculatePercentage(data.harris, data.total);
    document.getElementById('trump-percentage').textContent = 
        calculatePercentage(data.trump, data.total);
    document.getElementById('oliver-percentage').textContent = 
        calculatePercentage(data.oliver, data.total);
    document.getElementById('stein-percentage').textContent = 
        calculatePercentage(data.stein, data.total);
    document.getElementById('kennedy-percentage').textContent = 
        calculatePercentage(data.kennedy, data.total);
    document.getElementById('others-percentage').textContent = 
        calculatePercentage(data.others, data.total);
}

// Helper function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Helper function to calculate and format percentage
function calculatePercentage(part, total) {
    if (total === 0) return '0%';
    const percentage = (part / total) * 100;
    return percentage.toFixed(1) + '%';
}

// Load data when the page loads
document.addEventListener('DOMContentLoaded', loadData);
