# Withdrawal delayer protocol

## Goal

The purpose of this smart contract is to delay the withdraw. Hence, tokens will be held by the smart contract for a period of `D` and only afterwards tokens could be really withdrawn.

## Actors

- `hermezRollup`: Smart contract responsible of making deposits and it's able to change the delay
- `hermezKeeperAddress`: can enable emergency mode and modify the delay to make a withdrawal
- `hermezGovernanceDAOAddress`: can claim the funds in an emergency mode
- `whiteHackGroupAddress`: can claim the funds in an emergency when `MAX_EMERGENCY_MODE_TIME` is exceeded

> These addresses can only be updated if the sender of the transaction that changes them is the current address.

## Mechanism

When a certain state has been reached in `Hermez Contract`, the tokens will be sent to the `WithdrawalDelayer` contract.

So, the tokens will be in the contract during period `D`. In that period it will be decided whether it was an attack or a normal process.

That period `D` can only be changed by `hermezKeeperAddress` or by `hermezRollup`.

Actions that will be taken if an attack is detected are the following ones:

- The `WithdrawalDelayer` contract will stay in `NORMAL_MODE` until it is decided that there has been an attack. Then, if there was an attack, it would go to `EMERGENCY_MODE` and the decision can not be reversed.
- Only `hermezKeeperAddress` will be able to put the system in `EMERGENCY_MODE`.

![](mode_withdrawal.png)

There will be a delay time `D` to decide if there has been an attack or not:

- Not attack:
    - `WithdrawalDelayer` remains in `NORMAL_MODE`, and users will be able to withdraw their tokens normally but with a delay
- Attack:
    - `WithdrawalDelayer` change to `EMERGENCY_MODE`, then only `GovernanceDAO` will be able to withdraw the funds
    - Aragon court will have the option to reject proposals on how the `GovernanceDAO` will distribute the funds
    - If after `MAX_EMERGENCY_MODE_TIME` the funds are still stopped, the `whiteHackGroupAddress` can withdraw the funds if they think it's necessary to avoid a permanent block

![](../hermez-protocol/contracts/emergency-mechanism.png)

## Parameters

- `D`: delay to withdraw from `WithdrawalDelayer` measured in seconds
- `MAX_WITHDRAWAL_DELAY`: maximum delay time to decide if it was an attack or not mesured in weeks --> 2 weeks
- `MAX_EMERGENCY_MODE_TIME`: maximum time that funds can stay in the contract mesured in weeks --> 1 year (~ 52 weeks)
