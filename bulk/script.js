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

    walletAddresses.forEach(walletAddress => {
        const url = `https://legendary-space-yodel-wj57j6q9q94c574x-80.app.github.dev//api/allocation?wallet=${walletAddress}`;

        fetch(url)
            .then(response => response.json())
            .then(responseData => {
                // Parse the response data safely
                const parsedData = JSON.parse(responseData.body);
                const data = parsedData.data;

                const row = `
                    <tr>
                        <td>${walletAddress}</td>
                        <td>${data?.total_allocated || '0'}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            })
            .catch(() => {
                const row = `
                    <tr>
                        <td>${walletAddress}</td>
                        <td>None</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            })
            .finally(() => {
                completed += 1;
                status.textContent = `Fetching ${completed}/${walletAddresses.length} wallets...`;

                if (completed === walletAddresses.length) {
                    loading.classList.add('hidden');
                    fetchButton.disabled = false;
                    status.textContent = "All wallets fetched.";
                }
            });
    });
}
