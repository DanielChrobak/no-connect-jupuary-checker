async function fetchData() {
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

    tableBody.innerHTML = '';
    loading.classList.remove('hidden');
    fetchButton.disabled = true;

    const maxRetries = 5;
    let baseDelay = 1000; // 1 second
    const maxBaseDelay = 10000; // 10 seconds

    for (let i = 0; i < walletAddresses.length; i++) {
        const walletAddress = walletAddresses[i];
        status.textContent = `Fetching ${i + 1}/${walletAddresses.length} wallets...`;

        let retries = 0;
        while (retries <= maxRetries) {
            try {
                const url = `https://jupuary.danielchrobak.tech/api/allocation?wallet=${walletAddress}`;
                const response = await fetch(url);
                const responseData = await response.json();

                if (responseData.status_code === 429) {
                    baseDelay = Math.min(baseDelay * 2, maxBaseDelay);
                    const delay = Math.pow(2, retries) * baseDelay;
                    status.textContent = `Rate limited. Retrying in ${delay / 1000} seconds...`;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    retries++;
                    continue;
                }

                const parsedData = JSON.parse(responseData.body);
                const data = parsedData.data;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${walletAddress}</td>
                    <td>${data?.total_allocated || '0'}</td>
                `;
                tableBody.appendChild(row);
                break;
            } catch (error) {
                if (retries === maxRetries) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${walletAddress}</td>
                        <td>Error: ${error.message}</td>
                    `;
                    tableBody.appendChild(row);
                } else {
                    const delay = Math.pow(2, retries) * baseDelay;
                    status.textContent = `Error occurred. Retrying in ${delay / 1000} seconds...`;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    retries++;
                }
            }
        }
    }

    loading.classList.add('hidden');
    fetchButton.disabled = false;
    status.textContent = "All wallets fetched.";
}
