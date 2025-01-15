function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000) + 'M';
    if (num >= 1000) return (num / 1000) + 'K';
    return num;
}

function createTierRow(tier, score, allocation, currentTier) {
    const isCurrentTier = tier === currentTier;
    return `
        <tr class="${isCurrentTier ? 'current-tier' : ''}">
            <td>Tier ${tier}${isCurrentTier ? ' <span class="you-indicator">< You</span>' : ''}</td>
            <td>${formatNumber(score)}</td>
            <td>${formatNumber(allocation)} <span class="jup-icon"></span></td>
        </tr>
    `;
}

function formatAllocationData(data) {
    return `
        <div style="text-align: center; margin-bottom: 40px;">
            <div style="color: #ffffff; margin-bottom: 20px;">
                <br>
                <h2>Your total allocation is:</h2>
            </div>
            <div class="total-allocation" style="font-size: 3.5em; margin: 30px 0;">
                ${data.total_allocated} <span class="jup-icon"></span>
            </div>
        </div>
        <div class="allocation-details">
            <div class="section">
                <div class="section-title">Swap</div>
                <div class="score-display">${data.swap_allocation_base} <span class="jup-icon"></span></div>
                <div class="score-info">Score: ${Math.round(data.swap_score).toLocaleString()}</div>
                <div class="score-info">Tier: ${data.swap_tier}</div>
                <table class="tier-table">
                    <thead>
                        <tr>
                            <th>Tier</th>
                            <th>Qualifying Score</th>
                            <th>Allocation</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${createTierRow(1, 10000000, 20000, data.swap_tier)}
                        ${createTierRow(2, 5000000, 12000, data.swap_tier)}
                        ${createTierRow(3, 1000000, 5000, data.swap_tier)}
                        ${createTierRow(4, 500000, 2500, data.swap_tier)}
                        ${createTierRow(5, 100000, 1000, data.swap_tier)}
                        ${createTierRow(6, 10000, 200, data.swap_tier)}
                        ${createTierRow(7, 1000, 50, data.swap_tier)}
                        ${createTierRow(8, 500, 25, data.swap_tier)}
                    </tbody>
                </table>
                <div class="info-text">
                    • Your swap score is based on adjusted USD volume and your scoring relative to other users determines your allocation.<br>
                    • Qualifying transactions must be made from 2 Nov 23 - 1 Nov 24<br>
                    • We removed bots, wallets that were trading mostly illiquid pairs, wallets that have traded for less than 3 weeks, and sybils<br>
                    • Circular transactions, swaps <= 5 USD, and swaps on extremely illiquid tokens without reliable pricing data do not contribute to your score<br>
                    • The volume of stable-stable swaps and sol-sol swaps are heavily discounted in your score.
                </div>
            </div>
            <div class="section">
                <div class="section-title">Expert</div>
                <div class="score-display">${data.expert_allocation} <span class="jup-icon"></span></div>
                <div class="score-info">Score: ${Math.round(data.expert_score)}</div>
                <div class="score-info">Tier: ${data.expert_tier}</div>
                <table class="tier-table">
                    <thead>
                        <tr>
                            <th>Tier</th>
                            <th>Qualifying Score</th>
                            <th>Allocation</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${createTierRow(1, 150000, 300000, data.expert_tier)}
                        ${createTierRow(2, 100000, 200000, data.expert_tier)}
                        ${createTierRow(3, 50000, 100000, data.expert_tier)}
                        ${createTierRow(4, 25000, 50000, data.expert_tier)}
                        ${createTierRow(5, 10000, 20000, data.expert_tier)}
                        ${createTierRow(6, 5000, 10000, data.expert_tier)}
                        ${createTierRow(7, 1000, 2000, data.expert_tier)}
                        ${createTierRow(8, 100, 200, data.expert_tier)}
                        ${createTierRow(9, 10, 50, data.expert_tier)}
                        ${createTierRow(10, 1, 20, data.expert_tier)}
                    </tbody>
                </table>
                <div class="info-text">
                    Your expert score is based on usage of DCA, LO, Ape and Perpetuals
                </div>
            </div>
            <div class="section">
                <div class="section-title">Bonus: Swap Consistency</div>
                <div class="score-display">${data.swap_consistency_bonus} <span class="jup-icon"></span></div>
            </div>
            <div class="section">
                <div class="section-title">Mobile Potential Bonus</div>
                <div class="score-display">${data.mobile_potential_bonus} <span class="jup-icon"></span></div>
            </div>
            <div class="section">
                <div class="section-title">Staking</div>
                <div class="score-display">${data.stakers_allocation_base} <span class="jup-icon"></span></div>
                <div class="score-info">Time-weighted Stake: ${Math.round(data.stakers_score).toLocaleString()}</div>
                <div class="info-text">
                    The staking base allocation is given according to your time-weighted stake if you have at least 10 JUP staked on 2 Nov 2024.
                </div>
            </div>
            <div class="section">
                <div class="section-title">Bonus: Super Voters</div>
                <div class="score-display">${data.stakers_super_voter_bonus} <span class="jup-icon"></span></div>
            </div>
            <div class="section">
                <div class="section-title">Bonus: Super Stakers</div>
                <div class="score-display">${data.stakers_super_staker_bonus} <span class="jup-icon"></span></div>
            </div>
        </div>
    `;
}

function fetchData() {
    const walletAddress = document.getElementById('walletInput').value;
    if (!walletAddress) return;

    const url = `https://jup-allocation-proxy.onrender.com/api/allocation?wallet=${walletAddress}`;
    const backup_url = `https://legendary-space-yodel-wj57j6q9q94c574x-80.app.github.dev//api/allocation?wallet=${walletAddress}`
    
    fetch(url)
        .then(response => response.json())
        .then(responseData => {
            const data = JSON.parse(responseData.body).data;

            document.getElementById('result').innerHTML = formatAllocationData(data);
        })
        .catch(error => {
            document.getElementById('result').innerHTML = '<p>Error fetching data. Please try again later.</p>';
        });
}
