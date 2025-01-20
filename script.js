function formatNumber(num) {
    if (num == null) return '0';
    const formatted = num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return formatted.endsWith('.00') ? formatted.slice(0, -3) : formatted;
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
    const safeData = (key) => data[key] != null ? data[key] : 0;

    let mobilePotentialBonusSection = '';
    if (window.showMobilePotentialBonus) {
        mobilePotentialBonusSection = `
            <div class="section">
                <div class="section-title">Mobile Potential Bonus</div>
                <div class="score-display">${formatNumber(safeData('mobile_potential_bonus'))} <span class="jup-icon"></span></div>
            </div>
        `;
    }

    return `
        <div style="text-align: center; margin-bottom: 40px;">
            <div style="color: #ffffff; margin-bottom: 20px;">
                <br>
                <h2>Your total allocation is:</h2>
            </div>
            <div class="total-allocation" style="font-size: 3.5em; margin: 30px 0;">
                ${formatNumber(safeData('total_allocated'))} <span class="jup-icon"></span>
            </div>
        </div>
        <div class="allocation-details">
            <div class="section">
                <div class="section-title">Swap</div>
                <div class="score-display">${formatNumber(safeData('swap_allocation_base'))} <span class="jup-icon"></span></div>
                <div class="score-info">Score: ${formatNumber(safeData('swap_score'))}</div>
                <div class="score-info">Tier: ${safeData('swap_tier')}</div>
                <table class="tier-table">
                    <thead>
                        <tr>
                            <th>Tier</th>
                            <th>Qualifying Score</th>
                            <th>Allocation</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${createTierRow(1, 10000000, 20000, safeData('swap_tier'))}
                        ${createTierRow(2, 5000000, 12000, safeData('swap_tier'))}
                        ${createTierRow(3, 1000000, 5000, safeData('swap_tier'))}
                        ${createTierRow(4, 500000, 2500, safeData('swap_tier'))}
                        ${createTierRow(5, 100000, 1000, safeData('swap_tier'))}
                        ${createTierRow(6, 10000, 200, safeData('swap_tier'))}
                        ${createTierRow(7, 1000, 50, safeData('swap_tier'))}
                        ${createTierRow(8, 500, 25, safeData('swap_tier'))}
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
                <div class="score-display">${formatNumber(safeData('expert_allocation'))} <span class="jup-icon"></span></div>
                <div class="score-info">Score: ${formatNumber(safeData('expert_score'))}</div>
                <div class="score-info">Tier: ${safeData('expert_tier')}</div>
                <table class="tier-table">
                    <thead>
                        <tr>
                            <th>Tier</th>
                            <th>Qualifying Score</th>
                            <th>Allocation</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${createTierRow(1, 150000, 300000, safeData('expert_tier'))}
                        ${createTierRow(2, 100000, 200000, safeData('expert_tier'))}
                        ${createTierRow(3, 50000, 100000, safeData('expert_tier'))}
                        ${createTierRow(4, 25000, 50000, safeData('expert_tier'))}
                        ${createTierRow(5, 10000, 20000, safeData('expert_tier'))}
                        ${createTierRow(6, 5000, 10000, safeData('expert_tier'))}
                        ${createTierRow(7, 1000, 2000, safeData('expert_tier'))}
                        ${createTierRow(8, 100, 200, safeData('expert_tier'))}
                        ${createTierRow(9, 10, 50, safeData('expert_tier'))}
                        ${createTierRow(10, 1, 20, safeData('expert_tier'))}
                    </tbody>
                </table>
                <div class="info-text">
                    Your expert score is based on usage of DCA, LO, Ape and Perpetuals.
                </div>
            </div>
            <div class="section">
                <div class="section-title">Bonus: Swap Consistency</div>
                <div class="score-display">${formatNumber(safeData('swap_consistency_bonus'))} <span class="jup-icon"></span></div>
            </div>
            ${mobilePotentialBonusSection}
            <div class="section">
                <div class="section-title">Staking</div>
                <div class="score-display">${formatNumber(safeData('stakers_allocation_base'))} <span class="jup-icon"></span></div>
                <div class="score-info">Time-weighted Stake: ${formatNumber(safeData('stakers_score'))}</div>
                <div class="info-text">
                    The staking base allocation is given according to your time-weighted stake if you have at least 10 JUP staked on 2 Nov 2024.
                </div>
            </div>
            <div class="section">
                <div class="section-title">Bonus: Super Voters</div>
                <div class="score-display">${formatNumber(safeData('stakers_super_voter_bonus'))} <span class="jup-icon"></span></div>
            </div>
            <div class="section">
                <div class="section-title">Bonus: Super Stakers</div>
                <div class="score-display">${formatNumber(safeData('stakers_super_staker_bonus'))} <span class="jup-icon"></span></div>
            </div>
        </div>
    `;
}

function fetchData() {
    const walletAddress = document.getElementById('walletInput').value;
    if (!walletAddress) return;

    const url = `https://jup-allocation-proxy.onrender.com/api/allocation?wallet=${walletAddress}`;
    
    fetch(url)
        .then(response => response.json())
        .then(responseData => {
            const data = JSON.parse(responseData.body).data;
            document.getElementById('result').innerHTML = formatAllocationData(data || {});
        })
        .catch(() => {
            document.getElementById('result').innerHTML = '<p>Error fetching data. Please try again later.</p>';
        });
}

// Add this line to the global scope
window.showMobilePotentialBonus = false;
