// SPDX-License-Identifier: MIT
use ink::env::test::*;
use rewards::*;

#[ink::test]
fn test_reward_claim_cap() {
    let mut rewards = Rewards::new(1000);
    let id = rewards.add_reward(100, alice(), 3); // 3-claim cap
    
    // First 3 claims succeed
    assert_eq!(rewards.claim_reward(id), Ok(()));
    assert_eq!(rewards.claim_reward(id), Ok(()));
    assert_eq!(rewards.claim_reward(id), Ok(()));
    
    // 4th claim fails
    assert_eq!(rewards.claim_reward(id), Err(Error::RewardExhausted));
}

#[ink::test]
fn test_reward_claim_stats() {
    let mut rewards = Rewards::new(1000);
    let id = rewards.add_reward(100, alice(), 5);
    
    // Verify initial state
    let stats = rewards.get_rewards();
    assert_eq!(stats[0].4, 0); // claims
    assert_eq!(stats[0].5, 5); // max_claims
    
    // Claim once and verify
    rewards.claim_reward(id).unwrap();
    let stats = rewards.get_rewards();
    assert_eq!(stats[0].4, 1); // claims
}

#[ink::test]
fn test_reward_unlimited_claims() {
    let mut rewards = Rewards::new(1000);
    let id = rewards.add_reward(100, alice(), 0); // 0 = unlimited
    
    // Multiple claims should succeed
    for _ in 0..5 {
        rewards.claim_reward(id).unwrap();
    }
}

#[ink::test]
fn test_set_reward_supply() {
    let mut rewards = Rewards::new(1000);
    let id = rewards.add_reward(100, alice(), 10);
    
    // Set lower cap after claims
    rewards.claim_reward(id).unwrap();
    rewards.set_reward_supply(id, 1).unwrap();
    
    // Should reject additional claims
    assert_eq!(rewards.claim_reward(id), Err(Error::RewardExhausted));
}