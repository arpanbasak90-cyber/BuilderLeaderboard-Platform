#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol,
};

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct BuilderProfile {
    pub address: Address,
    pub name: String,
    pub xp: u32,
    pub level: u32,
    pub xlm_earned: u32,
    pub quests_completed: u32,
    pub tx_count: u32,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct QuestRecord {
    pub quest_id: u32,
    pub xp_reward: u32,
    pub xlm_reward: u32,
    pub completed_count: u32,
}

#[contracttype]
pub enum DataKey {
    Profile(Address),
    Quest(u32),
    GlobalCount,
}

const COUNT_KEY: Symbol = symbol_short!("COUNT");

#[contract]
pub struct LeaderboardContract;

#[contractimpl]
impl LeaderboardContract {
    /// Register or update a builder's profile on-chain with persistent storage
    pub fn register_builder(env: Env, builder: Address, name: String) -> BuilderProfile {
        builder.require_auth();

        let key = DataKey::Profile(builder.clone());
        let existing: Option<BuilderProfile> = env.storage().persistent().get(&key);

        let profile = match existing {
            Some(mut p) => {
                p.name = name;
                p.tx_count += 1;
                p
            }
            None => BuilderProfile {
                address: builder.clone(),
                name,
                xp: 100,
                level: 1,
                xlm_earned: 10,
                quests_completed: 0,
                tx_count: 1,
            },
        };

        env.storage().persistent().set(&key, &profile);
        profile
    }

    /// Complete a quest on-chain, update builder stats, and increment global completion metrics
    pub fn complete_quest(
        env: Env,
        builder: Address,
        quest_id: u32,
        xp_reward: u32,
        xlm_reward: u32,
    ) -> BuilderProfile {
        builder.require_auth();

        let profile_key = DataKey::Profile(builder.clone());
        let mut profile: BuilderProfile = env
            .storage()
            .persistent()
            .get(&profile_key)
            .unwrap_or(BuilderProfile {
                address: builder.clone(),
                name: String::from_str(&env, "SorobanBuilder"),
                xp: 0,
                level: 1,
                xlm_earned: 0,
                quests_completed: 0,
                tx_count: 0,
            });

        profile.xp += xp_reward;
        profile.xlm_earned += xlm_reward;
        profile.quests_completed += 1;
        profile.tx_count += 1;
        profile.level = (profile.xp / 500) + 1;

        env.storage().persistent().set(&profile_key, &profile);

        // Update Quest stats
        let quest_key = DataKey::Quest(quest_id);
        let mut quest: QuestRecord = env
            .storage()
            .persistent()
            .get(&quest_key)
            .unwrap_or(QuestRecord {
                quest_id,
                xp_reward,
                xlm_reward,
                completed_count: 0,
            });

        quest.completed_count += 1;
        env.storage().persistent().set(&quest_key, &quest);

        // Global count increment
        let global: u32 = env.storage().instance().get(&COUNT_KEY).unwrap_or(0);
        env.storage().instance().set(&COUNT_KEY, &(global + 1));

        profile
    }

    /// Retrieve a builder profile from storage
    pub fn get_builder(env: Env, builder: Address) -> Option<BuilderProfile> {
        let key = DataKey::Profile(builder);
        env.storage().persistent().get(&key)
    }

    /// Retrieve quest record
    pub fn get_quest(env: Env, quest_id: u32) -> Option<QuestRecord> {
        let key = DataKey::Quest(quest_id);
        env.storage().persistent().get(&key)
    }

    /// Legacy increment method for backwards compatibility
    pub fn increment(env: Env) -> u32 {
        let mut count: u32 = env.storage().instance().get(&COUNT_KEY).unwrap_or(0);
        count += 1;
        env.storage().instance().set(&COUNT_KEY, &count);
        count
    }

    /// Legacy get_count method
    pub fn get_count(env: Env) -> u32 {
        env.storage().instance().get(&COUNT_KEY).unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env, String};

    #[test]
    fn test_register_and_complete_quest() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, LeaderboardContract);
        let client = LeaderboardContractClient::new(&env, &contract_id);

        let builder = Address::generate(&env);
        let name = String::from_str(&env, "Alex");

        // 1. Register builder
        let profile = client.register_builder(&builder, &name);
        assert_eq!(profile.name, name);
        assert_eq!(profile.level, 1);
        assert_eq!(profile.xp, 100);

        // 2. Complete quest
        let updated = client.complete_quest(&builder, &1, &500, &50);
        assert_eq!(updated.quests_completed, 1);
        assert_eq!(updated.xp, 600);
        assert_eq!(updated.level, 2);
        assert_eq!(updated.xlm_earned, 60);

        // 3. Fetch builder from contract
        let fetched = client.get_builder(&builder).unwrap();
        assert_eq!(fetched.xp, 600);
        assert_eq!(fetched.level, 2);

        // 4. Fetch quest record
        let quest = client.get_quest(&1).unwrap();
        assert_eq!(quest.completed_count, 1);
        assert_eq!(quest.xp_reward, 500);

        // 5. Test legacy count
        assert_eq!(client.get_count(), 1);
    }
}
