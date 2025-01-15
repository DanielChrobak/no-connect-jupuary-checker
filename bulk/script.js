function fetchData() {
    const walletInput = document.getElementById('walletInput').value;
    const fetchButton = document.getElementById('fetchButton');
    const status = document.getElementById('status');
    const loading = document.getElementById('loading');
    const tableBody = document.querySelector('#allocationTable tbody');

    if (!walletInput.trim()) {
        alert("Please enter one or more wallet addresses.");
        return;
    }

    const walletAddresses = walletInput
        .split(/[\n,]+/)
        .map(addr => addr.trim())
        .filter(addr => addr);

    if (walletAddresses.length === 0) {
        alert("No valid wallet addresses found.");
        return;
    }

    tableBody.innerHTML = ''; // Clear previous results
    status.textContent = `Fetching 0/${walletAddresses.length} wallets...`;
    loading.classList.remove('hidden');
    fetchButton.disabled = true;

    let completed = 0;
    const results = Array(walletAddresses.length).fill(null); // To store results in order

    walletAddresses.forEach((walletAddress, index) => {
        const url = `https://jupuary.danielchrobak.tech///api/allocation?wallet=${walletAddress}`;

        fetch(url)
            .then(response => response.json())
            .then(responseData => {
                // Parse the response data safely
                const parsedData = JSON.parse(responseData.body);
                const data = parsedData.data;

                results[index] = `
                    <tr>
                        <td>${walletAddress}</td>
                        <td>${data?.total_allocated || '0'}</td>
                    </tr>
                `;
            })
            .catch(() => {
                results[index] = `
                    <tr>
                        <td>${walletAddress}</td>
                        <td>None</td>
                    </tr>
                `;
            })
            .finally(() => {
                completed += 1;
                status.textContent = `Fetching ${completed}/${walletAddresses.length} wallets...`;

                if (completed === walletAddresses.length) {
                    // Populate table after all requests complete
                    tableBody.innerHTML = results.join('');
                    loading.classList.add('hidden');
                    fetchButton.disabled = false;
                    status.textContent = "All wallets fetched.";
                }
            });
    });
}
