// SPDX-License-Identifier: MIT
use ink::prelude::*;
use scale::{Decode, Encode};
use openbrush::traits::Storage;

#[derive(Debug, PartialEq, Eq, Encode, Decode, ink::storage::traits::StorageKey)]
#[ink(storage_key = 100)]
pub struct RewardStats {
    pub id: u32,
    pub max_claims: u32,
    pub claims: u32,
}

#[derive(Debug, PartialEq, Eq, Encode, Decode, ink::storage::traits::StorageKey)]
#[ink(storage_key = 101)]
pub struct Reward {
    pub id: u32,
    pub amount: Balance,
    pub token: AccountId,
    pub active: bool,
    pub claimed: bool,
}

#[ink::contract]
pub mod rewards {
    use ink::storage::Mapping;
    use openbrush::contracts::psp22::PSP22Ref;
    
    #[ink(storage)]
    pub struct Rewards {
        rewards: Mapping<u32, Reward>,
        reward_stats: Mapping<u32, RewardStats>,
        next_reward_id: u32,
        daily_cap: Balance,
        last_cap_check: Timestamp,
    }
    
    #[derive(Debug, PartialEq, Eq, Encode, Decode)]
    #[ink(event)]
    pub enum RewardEvent {
        RewardClaimed {
            id: u32,
            claims: u32,
            max_claims: u32,
            claimer: AccountId,
        },
        RewardAdded {
            id: u32,
            amount: Balance,
            token: AccountId,
            max_claims: u32,
        },
    }
    
    impl Rewards {
        #[ink(constructor)]
        pub fn new(daily_cap: Balance) -> Self {
            Self {
                rewards: Mapping::default(),
                reward_stats: Mapping::default(),
                next_reward_id: 0,
                daily_cap,
                last_cap_check: Self::env().block_timestamp(),
            }
        }
        
        pub fn add_reward(&mut self, amount: Balance, token: AccountId, max_claims: u32) -> u32 {
            let id = self.next_reward_id;
            self.rewards.insert(id, Reward {
                id,
                amount,
                token,
                active: true,
                claimed: false,
            });
            
            self.reward_stats.insert(id, RewardStats {
                id,
                max_claims,
                claims: 0,
            });
            
            self.next_reward_id += 1;
            self.env().emit_event(RewardEvent::RewardAdded {
                id,
                amount,
                token,
                max_claims,
            });
            id
        }
        
        pub fn set_reward_supply(&mut self, id: u32, max_claims: u32) -> Result<(), Error> {
            let stats = self.reward_stats.get(id).ok_or(Error::RewardNotFound)?;
            if stats.claims > max_claims {
                return Err(Error::InvalidClaimCount);
            }
            self.reward_stats.insert(id, RewardStats {
                id,
                max_claims,
                claims: stats.claims,
            });
            Ok(())
        }
        
        pub fn claim_reward(&mut self, id: u32) -> Result<(), Error> {
            let reward = self.rewards.get(id).ok_or(Error::RewardNotFound)?;
            if !reward.active {
                return Err(Error::RewardInactive);
            }
            
            let mut stats = self.reward_stats.get(id).ok_or(Error::RewardNotFound)?;
            if stats.max_claims > 0 && stats.claims >= stats.max_claims {
                return Err(Error::RewardExhausted);
            }
            
            let caller = self.env().caller();
            if reward.claimed {
                return Err(Error::RewardAlreadyClaimed);
            }
            
            let token = PSP22Ref::new();
            token.transfer_from_to(&reward.token, &caller, &self.env().account_id, reward.amount, vec![])?;
            
            self.rewards.insert(id, Reward {
                id: reward.id,
                amount: reward.amount,
                token: reward.token,
                active: reward.active,
                claimed: true,
            });
            
            stats.claims += 1;
            self.reward_stats.insert(id, stats);
            
            self.env().emit_event(RewardEvent::RewardClaimed {
                id,
                claims: stats.claims,
                max_claims: stats.max_claims,
                claimer: caller,
            });
            Ok(())
        }
        
        pub fn get_rewards(&self) -> Vec<(u32, Balance, AccountId, bool, u32, u32)> {
            let mut rewards = Vec::new();
            for i in 0..self.next_reward_id {
                if let (Some(reward), Some(stats)) = (self.rewards.get(i), self.reward_stats.get(i)) {
                    rewards.push((
                        reward.id,
                        reward.amount,
                        reward.token,
                        reward.active,
                        stats.claims,
                        stats.max_claims,
                    ));
                }
            }
            rewards
        }
    }
    
    #[derive(Debug, PartialEq, Eq, Encode, Decode)]
    pub enum Error {
        RewardNotFound,
        RewardInactive,
        RewardAlreadyClaimed,
        RewardExhausted,
        InvalidClaimCount,
        PSP22Error,
    }
    
    impl From<PSP22Error> for Error {
        fn from(err: PSP22Error) -> Self {
            Error::PSP22Error
        }
    }
}